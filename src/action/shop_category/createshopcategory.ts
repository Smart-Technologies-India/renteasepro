"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreateShopCategoryPayload {
  name: string;
  createdById: number;
}

const CreateShopCategory = async (
  payload: CreateShopCategoryPayload
): Promise<ApiResponseType<shop_category | null>> => {
  try {
    const isshop_categoryExist = await prisma.shop_category.findFirst({
      where: {
        name: payload.name,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (isshop_categoryExist)
      return {
        status: false,
        data: null,
        message: "Shop Category already exist",
        functionname: "CreateShopCategory",
      };

    const shop_category = await prisma.shop_category.create({
      data: {
        name: payload.name,
        createdById: payload.createdById,
      },
    });

    if (!shop_category)
      return {
        status: false,
        data: null,
        message: "Shop Category not created",
        functionname: "CreateShopCategory",
      };

    return {
      status: true,
      data: shop_category,
      message: "Shop Category created successfully",
      functionname: "CreateShopCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateShopCategory",
    };
    return response;
  }
};

export default CreateShopCategory;
