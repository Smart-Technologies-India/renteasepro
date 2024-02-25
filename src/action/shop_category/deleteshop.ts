"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DeleteShopCategoryPayload {
  id: number;
  userId: number;
}

const DeleteShopCategory = async (
  payload: DeleteShopCategoryPayload
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
        functionname: "DeleteShopCategory",
      };

    const deleteShopCategory = await prisma.shop_category.update({
      where: {
        id: payload.id,
      },
      data: {
        deletedAt: new Date(),
        deletedById: payload.userId,
      },
    });

    if (!deleteShopCategory)
      return {
        status: false,
        data: null,
        message: "Shop Category not deleted. Please try again.",
        functionname: "DeleteShopCategory",
      };

    return {
      status: true,
      data: shop_category,
      message: "Shop Category deleted successfully",
      functionname: "DeleteShopCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteShopCategory",
    };
    return response;
  }
};

export default DeleteShopCategory;
