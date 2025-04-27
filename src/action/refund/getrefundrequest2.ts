"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property, refund_amount, RefundAmountType } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetRefundRequestPayload {
  userId: number;
  rentId: number;
  shopId: number;
}

const GetRefundRequest2 = async (
  payload: GetRefundRequestPayload
): Promise<ApiResponseType<refund_amount[] | null>> => {
  try {
    const refund_amount = await prisma.refund_amount.findMany({
      where: {
        userId: payload.userId,
        rentId: payload.rentId,
        shopId: payload.shopId,
      },
    });

    if (!refund_amount)
      return {
        status: false,
        data: null,
        message: "Unable to create refund request. Please try again.",
        functionname: "GetRefundRequest2",
      };

    return {
      status: true,
      data: refund_amount,
      message: "Refund request created successfully",
      functionname: "GetRefundRequest2",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRefundRequest2",
    };
    return response;
  }
};

export default GetRefundRequest2;
