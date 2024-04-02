"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface GetPaymentPayload {
  id: number;
}

const GetPayment = async (
  payload: GetPaymentPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    let bidpayment = await prisma.bid_payment.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
      },
    });

    if (!bidpayment)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetPayment",
      };

    return {
      status: true,
      data: bidpayment,
      message: "Bid payment data get successfully",
      functionname: "GetPayment",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetPayment",
    };
    return response;
  }
};

export default GetPayment;
