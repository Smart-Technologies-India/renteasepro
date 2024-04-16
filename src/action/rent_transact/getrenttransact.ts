"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { rent_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetRentTranPayload {
  id: number;
}

const GetRentTran = async (
  payload: GetRentTranPayload
): Promise<ApiResponseType<rent_transact | null>> => {
  try {
    const rent_respone = await prisma.rent_transact.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
        user: true,
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetRentTran",
      };

    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
      functionname: "GetRentTran",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRentTran",
    };
    return response;
  }
};

export default GetRentTran;
