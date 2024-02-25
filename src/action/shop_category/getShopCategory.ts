"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetShopCategoryPayload {
  id: number;
}

const GetshopCategory = async (
  payload: GetShopCategoryPayload
): Promise<ApiResponseType<shop_category | null>> => {
  try {
    const shop_category = await prisma.shop_category.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!shop_category)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetshopCategory",
      };

    return {
      status: true,
      data: shop_category,
      message: "Shop Category data get successfully",
      functionname: "GetshopCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetshopCategory",
    };
    return response;
  }
};

export default GetshopCategory;
