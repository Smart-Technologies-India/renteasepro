"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property, refund_amount, RefundAmountType } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetRefundRequestPayload {
  userId: number;
  rentId: number;
  shopId: number;
  retund_type: RefundAmountType;
}

const GetRefundRequest = async (
  payload: GetRefundRequestPayload
): Promise<ApiResponseType<refund_amount | null>> => {
  try {
    const refund_amount = await prisma.refund_amount.findFirst({
      where: {
        userId: payload.userId,
        rentId: payload.rentId,
        shopId: payload.shopId,
        refund_type: payload.retund_type,
      },
    });

    if (!refund_amount)
      return {
        status: false,
        data: null,
        message: "Unable to create refund request. Please try again.",
        functionname: "GetRefundRequest",
      };

    return {
      status: true,
      data: refund_amount,
      message: "Refund request created successfully",
      functionname: "GetRefundRequest",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRefundRequest",
    };
    return response;
  }
};

export default GetRefundRequest;
