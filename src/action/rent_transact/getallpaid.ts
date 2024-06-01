"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface GetAllPaidRentPayload {}

const GetAllPaidRent = async (
  payload: GetAllPaidRentPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const rent_transact_response = await prisma.rent_transact.findMany({
      where: {
        status: "PAID",
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
        rent: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!rent_transact_response)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetAllPaidRent",
      };

    return {
      status: true,
      data: rent_transact_response,
      message: "Rent Transact data get successfully",
      functionname: "GetAllPaidRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllPaidRent",
    };
    return response;
  }
};

export default GetAllPaidRent;
