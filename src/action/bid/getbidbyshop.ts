"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid } from "@prisma/client";

interface GetBidPayload {
  shopid: number;
}

const GetBidByShop = async (
  payload: GetBidPayload
): Promise<ApiResponseType<bid | null>> => {
  try {
    const bid = await prisma.bid.findFirst({
      where: {
        shopId: payload.shopid,
        status: "ACTIVE",
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetBidByShop",
      };

    return {
      status: true,
      data: bid,
      message: "Bid data get successfully",
      functionname: "GetBidByShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetBidByShop",
    };
    return response;
  }
};

export default GetBidByShop;
