"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent } from "@prisma/client";

interface GetRentByUserPayload {
  userid: number;
}

const GetUserRent = async (
  payload: GetRentByUserPayload
): Promise<ApiResponseType<rent[] | null>> => {
  try {
    const rent_response = await prisma.rent.findMany({
      where: {
        userId: payload.userid,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
      },
    });

    if (!rent_response)
      return {
        status: false,
        data: null,
        message: "No Rent Data Found for This User. Please try again.",
        functionname: "GetUserRent",
      };

    return {
      status: true,
      data: rent_response,
      message: "Rent data get successfully",
      functionname: "GetUserRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetUserRent",
    };
    return response;
  }
};

export default GetUserRent;
