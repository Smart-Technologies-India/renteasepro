"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { ShopStatus, shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetShopsByStatusPayload {
  status: ShopStatus;
}

const getShopsByStatus = async (
  payload: GetShopsByStatusPayload
): Promise<ApiResponseType<shop[] | null>> => {
  try {
    const allshops = await prisma.shop.findMany({
      where: {
        status: payload.status,
        deletedAt: null,
        deletedBy: null,
      },

      include: {
        shop_category: true,
      },
    });

    if (!allshops)
      return {
        status: false,
        data: null,
        message: "No shops found. Please try again.",
        functionname: "getShopsByStatus",
      };

    return {
      status: true,
      data: allshops,
      message: "Shops data get successfully",
      functionname: "getShopsByStatus",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getShopsByStatus",
    };
    return response;
  }
};

export default getShopsByStatus;
