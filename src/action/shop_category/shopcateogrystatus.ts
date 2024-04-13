"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Status, shop_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface ChangeShopCategoryPayload {
  id: number;
  userId: number;
  status: Status;
}

const CahangeShopCategory = async (
  payload: ChangeShopCategoryPayload
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
        functionname: "CahangeShopCategory",
      };

    const changeShopCategory = await prisma.shop_category.update({
      where: {
        id: payload.id,
      },
      data: {
        status: payload.status,
      },
    });

    if (!changeShopCategory)
      return {
        status: false,
        data: null,
        message: "Shop Category status not changed. Please try again.",
        functionname: "CahangeShopCategory",
      };

    return {
      status: true,
      data: shop_category,
      message: "Shop Category status changed successfully",
      functionname: "CahangeShopCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CahangeShopCategory",
    };
    return response;
  }
};

export default CahangeShopCategory;
