"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { rent, rent_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetAllRentTransactPayload {}

const GetAllRentTransact = async (
  payload: GetAllRentTransactPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const rent_respone = await prisma.rent_transact.findMany({
      where: {
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
        functionname: "GetAllRentTransact",
      };

    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
      functionname: "GetAllRentTransact",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllRentTransact",
    };
    return response;
  }
};

export default GetAllRentTransact;
