"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface GetRentPayload {
  id: number;
}

const GetRent = async (
  payload: GetRentPayload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const rent_respone = await prisma.rent.findFirst({
      where: {
        status: "RUNNING",
        shopId: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetRent",
      };

    return {
      status: true,
      data: true,
      message: "Rent is already created on this shop.",
      functionname: "GetRent",
    };
    
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRent",
    };
    return response;
  }
};

export default GetRent;
