"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  daily_property,
  daily_rent_photo,
  daily_shop,
  property,
  shop,
  shop_category,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyShopPayload {
  id: number;
}

const GetDailyShop = async (
  payload: GetDailyShopPayload
): Promise<
  ApiResponseType<
    | (daily_shop & {
        property: daily_property;
        shop_category: shop_category;
        daily_rent_photo: daily_rent_photo[];
      })
    | null
  >
> => {
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
        daily_rent_photo: true,
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
