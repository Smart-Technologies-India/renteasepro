"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_shop, shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyShopFromPropertyPayload {
  propertyid: number;
}

const GetDailyShopFromProperty = async (
  payload: GetDailyShopFromPropertyPayload
): Promise<ApiResponseType<daily_shop[] | null>> => {
  try {
    const shops = await prisma.daily_shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        propertyId: parseInt(payload.propertyid.toString()),
      },
      include: {
        shop_category: true,
      },
    });

    if (!shops)
      return {
        status: false,
        data: null,
        message: "No Daily Shop Found. Please try again.",
        functionname: "GetDailyShopFromProperty",
      };

    return {
      status: true,
      data: shops,
      message: "Daily Shops data get successfully",
      functionname: "GetDailyShopFromProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyShopFromProperty",
    };
    return response;
  }
};

export default GetDailyShopFromProperty;
