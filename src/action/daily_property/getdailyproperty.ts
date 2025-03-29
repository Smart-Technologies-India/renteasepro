"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Status, property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyPropertyPayload {
  id: number;
}

const GetDailyProperty = async (
  payload: GetDailyPropertyPayload
): Promise<ApiResponseType<property | null>> => {
  try {
    const property = await prisma.daily_property.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
      },
    });

    if (!property)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetDailyProperty",
      };

    return {
      status: true,
      data: property,
      message: "Daily Property data get successfully",
      functionname: "GetDailyProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyProperty",
    };
    return response;
  }
};

export default GetDailyProperty;
