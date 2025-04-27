"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  refund_amount,
  RefundAmountType,
  RentTransactStatus,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface UpdateRefundRequestPayload {
  id: number;
  refund_type: RefundAmountType;
  remark?: string;
  bankname?: string;
  paymentmode?: string;
  transactionid?: string;
  creadtedById: number;
  amount?: string;
  status?: RentTransactStatus;
}

const UpdateRefundRequest = async (
  payload: UpdateRefundRequestPayload
): Promise<ApiResponseType<refund_amount | null>> => {
  try {
    const isexist = await prisma.refund_amount.findFirst({
      where: {
        id: payload.id,
        refund_type: payload.refund_type,
      },
    });

    if (!isexist)
      return {
        status: false,
        data: null,
        message: "Unable to create refund request. Please try again.",
        functionname: "UpdateRefundRequest",
      };

    const data_to_update = {
      ...(payload.remark && { officer_remark: payload.remark }),
      ...(payload.bankname && { bankname: payload.bankname }),
      ...(payload.paymentmode && { paymentmode: payload.paymentmode }),
      ...(payload.transactionid && { transactionid: payload.transactionid }),
      ...(payload.status && { status: payload.status }),
      ...(payload.amount && { actual_refund_amount: payload.amount }),
    };

    const refund_amount = await prisma.refund_amount.update({
      where: {
        id: payload.id,
        refund_type: payload.refund_type,
      },
      data: data_to_update,
    });
    if (!refund_amount)
      return {
        status: false,
        data: null,
        message: "Unable to create refund request. Please try again.",
        functionname: "UpdateRefundRequest",
      };

    return {
      status: true,
      data: refund_amount,
      message: "Refund request created successfully",
      functionname: "UpdateRefundRequest",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateRefundRequest",
    };
    return response;
  }
};

export default UpdateRefundRequest;
