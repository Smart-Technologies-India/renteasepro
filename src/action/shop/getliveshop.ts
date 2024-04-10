"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { BidStatus, Floors, ShopStatus, shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface getLiveShopPayload {
  propertyId?: number;
}

const getLiveShop = async (
  payload: getLiveShopPayload
): Promise<ApiResponseType<shop[] | null>> => {
  try {
    const current_date = new Date();
    const livebids = await prisma.bid.findMany({
      where: {
        bid_status: BidStatus.PUBLISHED,

        bidstartdate: {
          lte: current_date,
        },
        bidenddate: {
          gte: current_date,
        },
      },
      include: {
        shop: {
          include: {
            shop_category: true,
          },
        },
      },
    });

    let allshops = [];
    for (let i = 0; i < livebids.length; i++) {
      if (livebids[i].shop) {
        if (payload.propertyId == livebids[i].shop.propertyId) {
          allshops.push(livebids[i].shop);
        }
      }
    }

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
      functionname: "getLiveShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getLiveShop",
    };
    return response;
  }
};

export default getLiveShop;
