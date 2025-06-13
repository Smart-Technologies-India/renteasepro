"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_rent_description } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyRentDescriptionPayload {
  id: number;
}

const GetDailyRentDescription = async (
  payload: GetDailyRentDescriptionPayload
): Promise<ApiResponseType<Array<daily_rent_description> | null>> => {
  try {
    const rent_respone = await prisma.daily_rent_description.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "ACTIVE",
        shopId: payload.id,
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetDailyRentDescription",
      };

    if (rent_respone.length === 0) {
      return {
        status: false,
        data: null,
        message: "No daily rent description found for this shop.",
        functionname: "GetDailyRentDescription",
      };
    }
    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
      functionname: "GetDailyRentDescription",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyRentDescription",
    };
    return response;
  }
};

export default GetDailyRentDescription;
