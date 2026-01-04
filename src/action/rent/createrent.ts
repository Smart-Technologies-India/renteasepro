"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { SMSStatus, rent } from "@prisma/client";
import { SMSType, sendSMS } from "@/utils/smsmessage";

interface MonthType {
  isDisable: boolean;
  amount: string;
  month: string;
}

interface CreateRentPayload {
  shopId: number;
  userId: number;
  createdById: number;
  rent_amount: number;
  rent_start_date: string;
  rent_end_date: string;
  due_date: number;
  rent_agrement_file?: string;
  chargeone?: number;
  chargetwo?: number;
  chargethree?: number;
  monthamount: Array<MonthType>;
}

const CreateRent = async (
  payload: CreateRentPayload
): Promise<ApiResponseType<rent | null>> => {
  try {
    const rentexist = await prisma.rent.findFirst({
      where: {
        shopId: payload.shopId,
        status: "RUNNING",
      },
    });
    const data_to_update: any = {
      shopId: payload.shopId,
      rent_amount: payload.rent_amount,
      rent_start_date: new Date(payload.rent_start_date + "T00:00:00.000Z"),
      rent_end_date: new Date(payload.rent_end_date + "T00:00:00.000Z"),
      due_date: payload.due_date,
      userId: payload.userId,
      createdById: payload.createdById,
    };
    if (payload.rent_agrement_file) {
      data_to_update["rent_agrement_file"] = payload.rent_agrement_file;
    }
    if (payload.chargeone) {
      data_to_update["chargeone"] = payload.chargeone;
    }
    if (payload.chargetwo) {
      data_to_update["chargetwo"] = payload.chargetwo;
    }
    if (payload.chargethree) {
      data_to_update["chargethree"] = payload.chargethree;
    }

    if (rentexist) {
      if (
        new Date(rentexist.rent_end_date) < new Date(payload.rent_start_date)
      ) {
        const rent = await prisma.rent.create({
          data: data_to_update,
          include: {
            user: true,
            shop: {
              include: {
                shop_category: true,
                property: true,
              },
            },
          },
        });
        if (!rent)
          return {
            status: false,
            data: null,
            message: "Unable to create shop rent. Please try again.",
            functionname: "CreateRent",
          };
        await prisma.shop.update({
          where: {
            id: payload.shopId,
          },
          data: {
            status: "RENTED",
          },
        });
        const rentmonth = await createRentTransaction({
          start_date: new Date(payload.rent_start_date + "T00:00:00.000Z"),
          end_date: new Date(payload.rent_end_date + "T00:00:00.000Z"),
          due_date: payload.due_date,
          // rent_amount: payload.rent_amount,
          rent_id: rent.id,
          userId: payload.userId,
          createdById: payload.createdById,
          shopId: payload.shopId,
          amount_month: payload.monthamount,
        });
        if (!rentmonth) {
          return {
            status: false,
            data: null,
            message: "Unable to create shop rent. Please try again.",
            functionname: "CreateRent",
          };
        }

        const messageresponse = await sendSMS({
          type: SMSType.RentIsStarted,
          contact: rent.user.contactone!,
          propertyName: rent.shop.property.name,
          shopCategory: rent.shop.shop_category.name,
        });

        if (!messageresponse.status) {
          return {
            status: false,
            data: null,
            message: messageresponse.message,
            functionname: "CreateRent",
          };
        }

        return {
          status: true,
          data: rent,
          message: "Shop rent created successfully",
          functionname: "CreateRent",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Shop rent already exist for this shop. Please try again.",
          functionname: "CreateRent",
        };
      }
    } else {
      const rent = await prisma.rent.create({
        data: data_to_update,
        include: {
          user: true,
          shop: {
            include: {
              shop_category: true,
              property: true,
            },
          },
        },
      });
      await prisma.shop.update({
        where: {
          id: payload.shopId,
        },
        data: {
          status: "RENTED",
        },
      });
      const rentmonth = await createRentTransaction({
        start_date: new Date(payload.rent_start_date + "T00:00:00.000Z"),
        end_date: new Date(payload.rent_end_date + "T00:00:00.000Z"),
        due_date: payload.due_date,
        amount_month: payload.monthamount,
        rent_id: rent.id,
        userId: payload.userId,
        createdById: payload.createdById,
        shopId: payload.shopId,
      });
      if (!rentmonth) {
        return {
          status: false,
          data: null,
          message: "Unable to create shop rent. Please try again.",
          functionname: "CreateRent",
        };
      }
      if (!rent)
        return {
          status: false,
          data: null,
          message: "Unable to create shop rent. Please try again.",
          functionname: "CreateRent",
        };

      const messageresponse = await sendSMS({
        type: SMSType.RentIsStarted,
        contact: rent.user.contactone!,
        propertyName: rent.shop.property.name,
        shopCategory: rent.shop.shop_category.name,
      });

      if (!messageresponse.status) {
        return {
          status: false,
          data: null,
          message: messageresponse.message,
          functionname: "CreateRent",
        };
      }

      return {
        status: true,
        data: rent,
        message: "Shop rent created successfully",
        functionname: "CreateRent",
      };
    }
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateRent",
    };
    return response;
  }
};

export default CreateRent;

interface CreateRentTransactionPayload {
  start_date: Date;
  end_date: Date;
  due_date: number;
  // rent_amount: number;
  rent_id: number;
  userId: number;
  createdById: number;
  shopId: number;
  amount_month: MonthType[];
}
const createRentTransaction = async (
  props: CreateRentTransactionPayload
): Promise<boolean> => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // create month array from start date to end date inclue due date
  let start_date = new Date(new Date(props.start_date).setDate(props.due_date));
  let end_date = new Date(new Date(props.end_date).setDate(props.due_date));

  let months = [];

  // i need month between start date and end date

  while (start_date <= end_date) {
    months.push(new Date(new Date(start_date).setDate(props.due_date)));
    start_date.setMonth(start_date.getMonth() + 1);
  }

  if (new Date(props.end_date) < months[months.length - 1]) {
    months.pop();
  }

  for (let i = 0; i < months.length; i++) {
    const month: Date = months[i];

    const amounts: MonthType[] = props.amount_month.filter(
      (val: MonthType) => val.month == monthNames[month.getMonth()]
    );

    const create_rent_transaction = await prisma.rent_transact.create({
      data: {
        rentId: props.rent_id,
        userId: props.userId,
        createdById: props.createdById,
        shopId: props.shopId,
        amount: parseInt(amounts[0].amount),
        formonth: month,
        status: "INACTIVE",
      },
    });

    if (!create_rent_transaction) {
      return false;
    }

    // create sms_rent_transaction
    const smsrent = await prisma.rent_sms.create({
      data: {
        userId: props.userId,
        rentId: props.rent_id,
        rentTransactId: create_rent_transaction.id,
        due: SMSStatus.ACTIVE,
        late: SMSStatus.ACTIVE,
        monthcross: SMSStatus.ACTIVE,
        status: "ACTIVE",
      },
    });

    if (!smsrent) {
      return false;
    }
  }

  return true;
};
