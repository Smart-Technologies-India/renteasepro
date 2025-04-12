"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";
import { SMSType, sendSMS } from "@/utils/smsmessage";
import { customAlphabet } from "nanoid";

interface PayDailyRentPayload {
  rentid: number;
  transactionid: string;
  bankname: string;
  orderid: string;
  startdate: Date;
  approvedById: number;
}

const PayDailyRent = async (
  payload: PayDailyRentPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const nanoid = customAlphabet("123456789", 6);

    const uniqueid = nanoid();
    let gstnumber = await prisma.gstinvoice.findFirst({
      orderBy: { id: "desc" },
    });

    if (!gstnumber) {
      return {
        status: false,
        data: null,
        message:
          "Something Went wrong unable to get gst number. Please try again.",
        functionname: "AddOrderId",
      };
    }
    const olddate = gstnumber.createdAt;
    const new_date = new Date();

    const isrestart =
      new_date.getFullYear() > olddate.getFullYear() ||
      (new_date.getFullYear() === olddate.getFullYear() &&
      new_date.getMonth() >= 3 && olddate.getMonth() < 3);


    await prisma.gstinvoice.create({
      data: {
        number: isrestart ? 1 : gstnumber.number + 1,
      },
    });

    const update_daily_rent = await prisma.daily_rent.update({
      where: {
        id: payload.rentid,
      },
      data: {
        approvedById: payload.approvedById,
        approved_date: new Date(),
        is_approved: true,
      },
      include: {
        user: true,
        daily_shop: {
          include: {
            shop_category: true,
            property: true,
          },
        },
      },
    });

    if (!update_daily_rent) {
      return {
        status: false,
        data: null,
        message: "Unable to update daily rent",
        functionname: "PayDailyRent",
      };
    }

    let amount = (
      parseInt(update_daily_rent.event_amount.toString()) +
      parseInt(update_daily_rent.prep_day_amount ?? "0") +
      parseInt(update_daily_rent.handover_day_amount ?? "0") +
      parseInt(update_daily_rent.deposit_amount ?? "0")
    ).toString();

    const update_response = await prisma.daily_rent_transact.create({
      data: {
        gstinvoice: isrestart ? 1 : gstnumber.number,
        rentId: payload.rentid,
        shopId: update_daily_rent.shopId,
        amount: amount,
        transaction_date: payload.startdate.toISOString(),
        paymentmode: "ONLINE",
        transactionid: `${uniqueid}111${isrestart ? 1 : gstnumber.number}`,
        bankname: payload.bankname,
        trackid: `500${isrestart ? 1 : gstnumber.number}`,
        reconcilation: new Date(),
        remarks: payload.transactionid,
        orderid: payload.orderid,
        status: "PAID",
        deletedAt: null,
        createdById: payload.approvedById,
        userId: update_daily_rent.userId,
      },
    });

    if (!update_response)
      return {
        status: false,
        data: null,
        message: "Something Went wrong unable to pay rent. Please try again.",
        functionname: "PayDailyRent",
      };

    const messageresponse = await sendSMS({
      type: SMSType.RentIsPaid,
      contact: update_daily_rent.user.contactone!,
      propertyName: update_daily_rent.daily_shop.property.name,
      shopCategory: update_daily_rent.daily_shop.shop_category.name,
    });

    if (!messageresponse.status) {
      return {
        status: false,
        data: null,
        message: messageresponse.message,
        functionname: "PayDailyRent",
      };
    }

    return {
      status: true,
      data: null,
      message: "Rent paid successfully",
      functionname: "PayDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "PayDailyRent",
    };
    return response;
  }
};

export default PayDailyRent;
