"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_shop, shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyShopPayload {
  id: number;
}

const GetDailyShop = async (
  payload: GetDailyShopPayload
): Promise<ApiResponseType<daily_shop | null>> => {
  try {
    const shop = await prisma.daily_shop.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        property: true,
        shop_category: true,
      },
    });

    if (!shop)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetDailyShop",
      };

    return {
      status: true,
      data: shop,
      message: "Shop data get successfully",
      functionname: "GetDailyShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyShop",
    };
    return response;
  }
};

export default GetDailyShop;
