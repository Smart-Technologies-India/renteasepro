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
    const bid: any = await prisma.bid.findFirst({
      where: {
        shopId: parseInt(payload.shopid.toString() ?? "0"),
        status: "ACTIVE",
        deletedAt: null,
        deletedBy: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("bid", payload.shopid);

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetBidByShop",
      };

    const max_bid_amount = await prisma.bid_transact.findFirst({
      where: {
        bidId: bid.id,
        deletedAt: null,
        deletedBy: null,
      },
      orderBy: {
        amount: "desc",
      },
    });

    if (max_bid_amount) {
      bid.max_bid_amount = max_bid_amount.amount;
    } else {
      bid.max_bid_amount = bid.min_bid_amount;
    }

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
