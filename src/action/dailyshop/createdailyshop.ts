"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { daily_shop, Floors, shop } from "@prisma/client";

interface CreateDailyShopPayload {
  propertyId: number;
  creadtedById: number;
  name: string;
  capacity: number;
  rate_per_day: string;
  rate_prep_day: string;
  rate_handover_day: string;
  deposit_per_day: string;
}

const CreateDailyShop = async (
  payload: CreateDailyShopPayload
): Promise<ApiResponseType<daily_shop | null>> => {
  try {
    const shopexist = await prisma.daily_shop.findFirst({
      where: {
        name: payload.name,
        propertyId: payload.propertyId,
      },
    });

    if (shopexist)
      return {
        status: false,
        data: null,
        message: "Unit already exist with this number.",
        functionname: "CreateDailyShopPayload",
      };

    const shop = await prisma.daily_shop.create({
      data: {
        shopCategoryId: 10,
        propertyId: payload.propertyId,
        name: payload.name,
        capacity: payload.capacity,
        rate_per_day: payload.rate_per_day,
        rate_prep_day: payload.rate_prep_day,
        rate_handover_day: payload.rate_handover_day,
        deposit_per_day: payload.deposit_per_day,
        createdById: payload.creadtedById,
      },
    });

    if (!shop)
      return {
        status: false,
        data: null,
        message: "Unable to create shop. Please try again.",
        functionname: "CreateDailyShop",
      };

    return {
      status: true,
      data: shop,
      message: "Shop data get successfully",
      functionname: "CreateDailyShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateDailyShop",
    };
    return response;
  }
};

export default CreateDailyShop;
