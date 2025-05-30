"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { daily_rent_transact } from "@prisma/client";

interface TestPaymentPayload {
  rentid: number;
  orderid: string;
}

function toUTCDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

const TestPayment = async (
  payload: TestPaymentPayload
): Promise<ApiResponseType<daily_rent_transact | null>> => {
  try {
    const gstnumber = await prisma.gstinvoice.findFirst({
      orderBy: { id: "desc" },
    });

    if (!gstnumber) {
      return {
        status: false,
        data: null,
        message: "GST invoice number not found",
        functionname: "TestPayment",
      };
    }

    await prisma.gstinvoice.create({
      data: {
        number: gstnumber?.number + 1,
      },
    });

    const updatedata = await prisma.daily_rent_transact.update({
      where: {
        id: payload.rentid,
      },
      data: {
        gstinvoice: gstnumber.number,
        transactionid: "12345678",
        trackid: payload.orderid,
        status: "PAID",
        transaction_date: new Date().toISOString(),
        paymentmode: "ONLINE",
        remarks: "Payment received successfully",
      },
      include: {
        user: true,
        daily_rent: true,
        daily_shop: {
          include: {
            property: true,
            shop_category: true,
          },
        },
      },
    });

    if (!updatedata) {
      return {
        status: false,
        data: null,
        message: "Daily rent transaction not found",
        functionname: "TestPayment",
      };
    }

    await prisma.daily_rent.update({
      where: {
        id: updatedata.daily_rent.id,
      },
      data: {
        status: "DEPOSITDUE",
      },
    });

    const RentIsPaid = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Confirmation%3A%20Your%20rent%20for%20${updatedata.daily_shop.shop_category.name}%20at%20${updatedata.daily_shop.property.name}%20has%20been%20paid.%20We%20appreciate%20your%20timely%20payment%20-DNH%20PDA.&MobileNumbers=91${updatedata.user.contactone}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const message_response = await fetch(RentIsPaid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      status: true,
      data: updatedata,
      message: "Daily rent created successfully",
      functionname: "TestPayment",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "TestPayment",
    };
    return response;
  }
};

export default TestPayment;
