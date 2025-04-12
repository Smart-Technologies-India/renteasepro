"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";
import { SMSType, sendSMS } from "@/utils/smsmessage";
import { customAlphabet } from "nanoid";

interface PayRentPayload {
  rentid: number[];
  transactionid: string;
  bankname: string;
  startdate: Date;
  orderid: string;
}

const PayRent = async (
  payload: PayRentPayload
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

    const update_response = await prisma.rent_transact.updateMany({
      where: {
        id: {
          in: payload.rentid,
        },
      },
      data: {
        gstinvoice: isrestart ? 1 : gstnumber.number,
        bankname: payload.bankname,
        transactionid: `${uniqueid}111${isrestart ? 1 : gstnumber.number}`,
        status: "PAID",
        paymentmode: "ONLINE",
        orderid: payload.orderid,
        transaction_date: payload.startdate.toISOString(),
        trackid: `500${isrestart ? 1 : gstnumber.number}`,
        deletedAt: null,
        remarks: payload.transactionid,
      },
    });

    if (!update_response)
      return {
        status: false,
        data: null,
        message: "Something Went wrong unable to pay rent. Please try again.",
        functionname: "PayRent",
      };

    const rentresponse = await prisma.rent_transact.findFirst({
      where: {
        id: {
          in: payload.rentid,
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

    if (!rentresponse)
      return {
        status: false,
        data: null,
        message: "Rent transaction not found.",
        functionname: "PayRent",
      };

    const messageresponse = await sendSMS({
      type: SMSType.RentIsPaid,
      contact: rentresponse.user.contactone!,
      propertyName: rentresponse.shop.property.name,
      shopCategory: rentresponse.shop.shop_category.name,
    });

    if (!messageresponse.status) {
      return {
        status: false,
        data: null,
        message: messageresponse.message,
        functionname: "PayRent",
      };
    }

    return {
      status: true,
      data: null,
      message: "Rent paid successfully",
      functionname: "PayRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "PayRent",
    };
    return response;
  }
};

export default PayRent;
