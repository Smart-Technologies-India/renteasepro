"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid } from "@prisma/client";

interface GetBidsPayload {
  shopid: number;
}

const GetBidsByShop = async (
  payload: GetBidsPayload
): Promise<ApiResponseType<bid[] | null>> => {
  try {
    const bid = await prisma.bid.findMany({
      where: {
        shopId: payload.shopid,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetBidsByShop",
      };

    return {
      status: true,
      data: bid,
      message: "Bid data get successfully",
      functionname: "GetBidsByShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetBidsByShop",
    };
    return response;
  }
};

export default GetBidsByShop;
