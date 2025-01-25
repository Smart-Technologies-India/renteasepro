"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface GetUserFirstRentPayload {
  rentid: number;
}

const GetUserFirstRent = async (
  payload: GetUserFirstRentPayload
): Promise<ApiResponseType<rent_transact | null>> => {
  try {
    const rent_transact_response = await prisma.rent_transact.findFirst({
      where: {
        rentId: parseInt(payload.rentid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
        rent: true,
        user: true,
      },
    });

    if (!rent_transact_response)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetUserFirstRent",
      };

    return {
      status: true,
      data: rent_transact_response,
      message: "Rent Transact data get successfully",
      functionname: "GetUserFirstRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetUserFirstRent",
    };
    return response;
  }
};

export default GetUserFirstRent;
