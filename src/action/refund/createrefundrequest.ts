"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property, refund_amount } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreateRefundRequestPayload {
  photo1: string;
  photo2: string;
  photo3: string;
  creadtedById: number;
  rentId: number;
  shopId: number;
  actual_refund_amount: number;
}

const CreateRefundRequest = async (
  payload: CreateRefundRequestPayload
): Promise<ApiResponseType<refund_amount | null>> => {
  try {
    const refund_amount = await prisma.refund_amount.create({
      data: {
        photo1: payload.photo1,
        photo2: payload.photo2,
        photo3: payload.photo3,
        createdById: payload.creadtedById,
        shopId: payload.shopId,
        actual_refund_amount: payload.actual_refund_amount.toString(),
        rentId: payload.rentId,
        userId: payload.creadtedById,
        status: "DUE",
      },
    });

    if (!refund_amount)
      return {
        status: false,
        data: null,
        message: "Unable to create refund request. Please try again.",
        functionname: "CreateRefundRequest",
      };

    return {
      status: true,
      data: refund_amount,
      message: "Refund request created successfully",
      functionname: "CreateRefundRequest",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateRefundRequest",
    };
    return response;
  }
};

export default CreateRefundRequest;
