"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetShopPayload {
  id: number;
}

const GetShop = async (
  payload: GetShopPayload
): Promise<ApiResponseType<shop | null>> => {
  try {
    const shop = await prisma.shop.findFirst({
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
        functionname: "GetShop",
      };

    return {
      status: true,
      data: shop,
      message: "Shop data get successfully",
      functionname: "GetShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetShop",
    };
    return response;
  }
};

export default GetShop;
