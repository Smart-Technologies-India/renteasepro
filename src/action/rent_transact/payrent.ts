"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";
import { SMSType, sendSMS } from "@/utils/smsmessage";

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
    let gstnumber = await prisma.gstinvoice.findFirst({
      orderBy: { id: "desc" },
    });

    if (!gstnumber) {
      return {
        status: false,
        data: null,
        message:
          "Something Want wrong unable to get gst number. Please try again.",
        functionname: "AddOrderId",
      };
    }

    await prisma.gstinvoice.create({
      data: {
        number: gstnumber?.number + 1,
      },
    });

    const update_response = await prisma.rent_transact.updateMany({
      where: {
        id: {
          in: payload.rentid,
        },
      },
      data: {
        gstinvoice: gstnumber.number,
        bankname: payload.bankname,
        transactionid: payload.transactionid,
        status: "PAID",
        paymentmode: "ONLINE",
        orderid: payload.orderid,
        transaction_date: payload.startdate.toISOString(),
        trackid: `500${gstnumber.number}`,
        deletedAt: null,
        remarks: "Success",
      },
    });

    if (!update_response)
      return {
        status: false,
        data: null,
        message: "Something Want wrong unable to pay rent. Please try again.",
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
