"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllShopCategorysPayload {}

const AllShopCategorys = async (
  payload: AllShopCategorysPayload
): Promise<ApiResponseType<shop_category[] | null>> => {
  try {
    const allshop_categorys = await prisma.shop_category.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!allshop_categorys)
      return {
        status: false,
        data: null,
        message: "No Shop Categorys. Please try again.",
        functionname: "AllShopCategorys",
      };

    return {
      status: true,
      data: allshop_categorys,
      message: "Shop Categorys data get successfully",
      functionname: "AllShopCategorys",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllShopCategorys",
    };
    return response;
  }
};

export default AllShopCategorys;
