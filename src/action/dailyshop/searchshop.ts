"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Floors, ShopStatus, shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface searchShopPayload {
  status?: ShopStatus;
  shopCategoryId?: number;
  propertyId?: number;
  floor?: Floors;
  shopNumber?: string;
  shopName?: string;
  meterno?: string;
}

const searchShop = async (
  payload: searchShopPayload
): Promise<ApiResponseType<shop[] | null>> => {
  try {
    let data_to_search: any = {};
    if (payload.status) data_to_search.status = payload.status;
    if (payload.shopCategoryId)
      data_to_search.shopCategoryId = parseInt(
        payload.shopCategoryId.toString() ?? "0"
      );
    if (payload.propertyId)
      data_to_search.propertyId = parseInt(
        payload.propertyId.toString() ?? "0"
      );
    if (payload.floor) data_to_search.floor = payload.floor;
    if (payload.shopNumber) data_to_search.shopNumber = payload.shopNumber;
    if (payload.shopName) data_to_search.shopName = payload.shopName;
    if (payload.meterno) data_to_search.meterno = payload.meterno;

    const allshops = await prisma.shop.findMany({
      where: {
        ...data_to_search,
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
        functionname: "searchShop",
      };

    return {
      status: true,
      data: allshops,
      message: "Shops data get successfully",
      functionname: "searchShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "searchShop",
    };
    return response;
  }
};

export default searchShop;
