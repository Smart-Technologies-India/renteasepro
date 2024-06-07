"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import axios from "axios";

interface UpdateRentTrasactPayload {}

const UpdateRentTrasact = async (
  payload: UpdateRentTrasactPayload
): Promise<ApiResponseType<number | null>> => {
  try {
    // current date
    const new_date = new Date();

    // new date today + 20 day
    const new_date_n20 = new Date(
      new Date().setDate(new Date().getDate() + 20)
    );

    // curretn date today - 11 days
    const new_date_p11 = new Date(
      new Date().setDate(new Date().getDate() - 11)
    );

    // curretn date today - 29 days
    const new_date_p30 = new Date(
      new Date().setDate(new Date().getDate() - 29)
    );

    // now update the rent transact table according to the date if the date is greater than the current date then update the status to DUE and more then 11 then update the status to LATE and if the date is greater than 30 days then update the status to MONTHCROSS

    // due section start from here

    const rent_transact_response_due = await prisma.rent_transact.updateMany({
      where: {
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_n20,
        },
      },
      data: {
        status: "DUE",
      },
    });

    const get_due_rent = await prisma.rent_transact.findMany({
      where: {
        status: "DUE",
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_n20,
        },
      },
      include: {
        user: true,
        shop: {
          include: {
            property: true,
            shop_category: true,
          },
        },
      },
    });

    if (get_due_rent.length > 0) {
      get_due_rent.map(async (rent) => {
        const get_rent_sms = await prisma.rent_sms.findFirst({
          where: {
            rentId: rent.rentId,
            userId: rent.userId,
            rentTransactId: rent.id,
          },
        });

        if (get_rent_sms && get_rent_sms.due != "SENT") {
          const response = await sent_due_rent_sms({
            contact: rent.user.contactone!,
            propertyName: rent.shop.property.name,
            shopCategory: rent.shop.shop_category.name,
          });
          if (!response.status) {
            return {
              status: false,
              data: null,
              message: response.message,
              functionname: "UpdateRentTrasact",
            };
          }

          const update_rent_sms = await prisma.rent_sms.update({
            where: {
              id: get_rent_sms.id,
            },
            data: {
              due: "SENT",
            },
          });
        }
      });
    }

    // due section end here

    //  late section start from here

    const rent_transact_response_late = await prisma.rent_transact.updateMany({
      where: {
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p11,
        },
      },
      data: {
        status: "LATE",
      },
    });

    const get_late_rent = await prisma.rent_transact.findMany({
      where: {
        status: "LATE",
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p11,
        },
      },
      include: {
        user: true,
        shop: {
          include: {
            property: true,
            shop_category: true,
          },
        },
      },
    });

    if (get_late_rent.length > 0) {
      get_late_rent.map(async (rent) => {
        const get_rent_sms = await prisma.rent_sms.findFirst({
          where: {
            rentId: rent.rentId,
            userId: rent.userId,
            rentTransactId: rent.id,
          },
        });

        if (get_rent_sms && get_rent_sms.late != "SENT") {
          const response = await send_late_rent_sms({
            contact: rent.user.contactone!,
            propertyName: rent.shop.property.name,
            shopCategory: rent.shop.shop_category.name,
          });
          if (!response.status) {
            return {
              status: false,
              data: null,
              message: response.message,
              functionname: "UpdateRentTrasact",
            };
          }

          const update_rent_sms = await prisma.rent_sms.update({
            where: {
              id: get_rent_sms.id,
            },
            data: {
              late: "SENT",
            },
          });
        }
      });
    }

    // late section end here

    // monthcross section start from here

    const rent_transact_response_monthcross =
      await prisma.rent_transact.updateMany({
        where: {
          NOT: [{ status: "PAID" }],
          formonth: {
            lte: new_date_p30,
          },
        },
        data: {
          status: "MONTHCROSS",
        },
      });

    const get_monthcross_rent = await prisma.rent_transact.findMany({
      where: {
        status: "MONTHCROSS",
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p30,
        },
      },
      include: {
        user: true,
        shop: {
          include: {
            property: true,
            shop_category: true,
          },
        },
      },
    });

    if (get_monthcross_rent.length > 0) {
      get_monthcross_rent.map(async (rent) => {
        const get_rent_sms = await prisma.rent_sms.findFirst({
          where: {
            rentId: rent.rentId,
            userId: rent.userId,
            rentTransactId: rent.id,
          },
        });

        if (get_rent_sms && get_rent_sms.monthcross != "SENT") {
          const response = await send_monthcross_rent_sms({
            contact: rent.user.contactone!,
            propertyName: rent.shop.property.name,
            shopCategory: rent.shop.shop_category.name,
          });
          if (!response.status) {
            return {
              status: false,
              data: null,
              message: response.message,
              functionname: "UpdateRentTrasact",
            };
          }

          const update_rent_sms = await prisma.rent_sms.update({
            where: {
              id: get_rent_sms.id,
            },
            data: {
              monthcross: "SENT",
            },
          });
        }
      });
    }

    // monthcross section end here

    if (
      !rent_transact_response_due ||
      !rent_transact_response_late ||
      !rent_transact_response_monthcross
    )
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "UpdateRentTrasact",
      };

    return {
      status: true,
      data: null,
      message: "Rent Transact data get successfully",
      functionname: "UpdateRentTrasact",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateRentTrasact",
    };
    return response;
  }
};

export default UpdateRentTrasact;

interface SendSmsPayload {
  contact: string;
  propertyName?: string;
  shopCategory?: string;
}

const sent_due_rent_sms = async (payload: SendSmsPayload) => {
  try {
    const messagebody = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Rent%20payment%20for%20${payload.shopCategory}%20at%20${payload.propertyName}%20is%20due.%20Please%20ensure%20prompt%20payment%20through%20the%20portal.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const response = await axios.get(messagebody);
    if (response.data.Data[0].MessageErrorDescription == "Success") {
      return {
        status: true,
        data: true,
        message: "SMS sent successfully",
        functionname: "sendSMS",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Unable to send SMS",
        functionname: "sendSMS",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
      message: errorToString(error),
      functionname: "sendSMS",
    };
  }
};

const send_late_rent_sms = async (payload: SendSmsPayload) => {
  try {
    const messagebody = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20payment%20for%20${payload.shopCategory}%20at%20${payload.propertyName}%20is%20now%20past%20due%20for%20the%20previous%20month.%20Urgent%20action%20is%20required.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const response = await axios.get(messagebody);
    if (response.data.Data[0].MessageErrorDescription == "Success") {
      return {
        status: true,
        data: true,
        message: "SMS sent successfully",
        functionname: "sendSMS",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Unable to send SMS",
        functionname: "sendSMS",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
      message: errorToString(error),
      functionname: "sendSMS",
    };
  }
};

const send_monthcross_rent_sms = async (payload: SendSmsPayload) => {
  try {
    const messagebody = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20payment%20for%20${payload.shopCategory}%20at%20${payload.propertyName}%20is%20now%20overdue.%20Kindly%20settle%20the%20outstanding%20amount%20promptly%20through%20the%20portal%20-DNH%20PDA.&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const response = await axios.get(messagebody);
    if (response.data.Data[0].MessageErrorDescription == "Success") {
      return {
        status: true,
        data: true,
        message: "SMS sent successfully",
        functionname: "sendSMS",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Unable to send SMS",
        functionname: "sendSMS",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
      message: errorToString(error),
      functionname: "sendSMS",
    };
  }
};
