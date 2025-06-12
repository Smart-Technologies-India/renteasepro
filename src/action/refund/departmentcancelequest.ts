"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_rent, RefundAmountType } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DepartmentRequestPayload {
  updatedById: number;
  rentId: number;
}

const DepartmentRequest = async (
  payload: DepartmentRequestPayload
): Promise<ApiResponseType<daily_rent | null>> => {
  try {
    const isexist = await prisma.refund_amount.findFirst({
      where: {
        rentId: payload.rentId,
        deletedAt: null,
        deletedById: null,
      },
    });

    if (isexist)
      return {
        status: false,
        data: null,
        message: "Refund request already exists for this rent.",
        functionname: "DepartmentRequest",
      };

    const update_daily_rent = await prisma.daily_rent.updateMany({
      where: {
        id: payload.rentId,
      },
      data: {
        updatedById: payload.updatedById,
        status: "CANCELLED",
      },
    });

    if (!update_daily_rent)
      return {
        status: false,
        data: null,
        message: "Unable to update daily rent status. Please try again.",
        functionname: "DepartmentRequest",
      };

    return {
      status: true,
      data: isexist,
      message: "Refund request created successfully",
      functionname: "DepartmentRequest",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DepartmentRequest",
    };
    return response;
  }
};

export default DepartmentRequest;
