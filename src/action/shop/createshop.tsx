"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { Floors, shop } from "@prisma/client";

interface CreateShopPayload {
  shopCategoryId: number;
  propertyId: number;
  creadtedById: number;
  floor: Floors;
  shopNumber: string;
  shopSize: string;
  meterno?: string;
}

const CreateShop = async (
  payload: CreateShopPayload
): Promise<ApiResponseType<shop | null>> => {
  try {
    const shopexist = await prisma.shop.findFirst({
      where: {
        shopNumber: payload.shopNumber,
        propertyId: payload.propertyId,
      },
    });

    if (shopexist)
      return {
        status: false,
        data: null,
        message: "Shop already exist with this number.",
        functionname: "CreateShop",
      };

    const data_to_update: any = {
      shopCategoryId: payload.shopCategoryId,
      propertyId: payload.propertyId,
      floor: payload.floor,
      shopNumber: payload.shopNumber,
      shopSize: payload.shopSize,
      createdById: payload.creadtedById,
    };

    if (payload.meterno) {
      data_to_update["meterno"] = payload.meterno;
    }

    const shop = await prisma.shop.create({
      data: data_to_update,
    });

    if (!shop)
      return {
        status: false,
        data: null,
        message: "Unable to create shop. Please try again.",
        functionname: "CreateShop",
      };

    return {
      status: true,
      data: shop,
      message: "Shop data get successfully",
      functionname: "CreateShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateShop",
    };
    return response;
  }
};

export default CreateShop;
