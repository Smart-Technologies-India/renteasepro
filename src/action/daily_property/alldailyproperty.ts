"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllDailyPropertysPayload {}

const AllDailyPropertys = async (
  payload: AllDailyPropertysPayload
): Promise<ApiResponseType<property[] | null>> => {
  try {
    const allpropertys = await prisma.daily_property.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!allpropertys)
      return {
        status: false,
        data: null,
        message: "No propertys found. Please try again.",
        functionname: "AllDailyPropertys",
      };

    return {
      status: true,
      data: allpropertys,
      message: "Propertys data get successfully",
      functionname: "AllDailyPropertys",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllDailyPropertys",
    };
    return response;
  }
};

export default AllDailyPropertys;
