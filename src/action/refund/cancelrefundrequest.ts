"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property, refund_amount, RefundAmountType } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CancelRefundRequestPayload {
  creadtedById: number;
  rentId: number;
  shopId: number;
  refunded_amount: number;
  refund_type: RefundAmountType;
}

const CancelRefundRequest = async (
  payload: CancelRefundRequestPayload
): Promise<ApiResponseType<refund_amount | null>> => {
  try {
    const refund_amount = await prisma.refund_amount.create({
      data: {
        createdById: payload.creadtedById,
        shopId: payload.shopId,
        actual_refund_amount: "0",
        refunded_amount: payload.refunded_amount.toString(),
        rentId: payload.rentId,
        userId: payload.creadtedById,
        status: "DUE",
        refund_type: payload.refund_type,
      },
    });

    if (!refund_amount)
      return {
        status: false,
        data: null,
        message: "Unable to create refund request. Please try again.",
        functionname: "CancelRefundRequest",
      };

    const update_daily_rent = await prisma.daily_rent.updateMany({
      where: {
        id: payload.rentId,
      },
      data: {
        status: "USERCANCELLED",
      },
    });

    if (!update_daily_rent)
      return {
        status: false,
        data: null,
        message: "Unable to update daily rent status. Please try again.",
        functionname: "CancelRefundRequest",
      };

    return {
      status: true,
      data: refund_amount,
      message: "Refund request created successfully",
      functionname: "CancelRefundRequest",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CancelRefundRequest",
    };
    return response;
  }
};

export default CancelRefundRequest;
