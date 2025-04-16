"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_shop, shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllDailyShopsPayload {}

const AllDailyShops = async (
  payload: AllDailyShopsPayload
): Promise<ApiResponseType<daily_shop[] | null>> => {
  try {
    const allshops = await prisma.daily_shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop_category: true,
      },
    });

    if (!allshops)
      return {
        status: false,
        data: null,
        message: "No daily shops found. Please try again.",
        functionname: "AllDailyShops",
      };

    return {
      status: true,
      data: allshops,
      message: "Daily Shops data get successfully",
      functionname: "AllDailyShops",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllDailyShops",
    };
    return response;
  }
};

export default AllDailyShops;
