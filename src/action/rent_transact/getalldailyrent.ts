"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { daily_rent_transact } from "@prisma/client";

interface GetAllDailyRentPayload {}

const GetAllDailyRent = async (
  payload: GetAllDailyRentPayload
): Promise<ApiResponseType<daily_rent_transact[] | null>> => {
  try {
    const rent_transact_response = await prisma.daily_rent_transact.findMany({
      where: {
        status: "PAID",
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        daily_shop: { include: { property: true } },
        daily_rent: true,
        user: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!rent_transact_response)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetAllDailyRent",
      };

    return {
      status: true,
      data: rent_transact_response,
      message: "Daily Rent Transact data get successfully",
      functionname: "GetAllDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllDailyRent",
    };
    return response;
  }
};

export default GetAllDailyRent;
