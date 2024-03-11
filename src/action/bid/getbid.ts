"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetBidPayload {
  id: number;
}

const GetBid = async (
  payload: GetBidPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    let bid: any = await prisma.bid.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        bid_transact: true,
        shop: { include: { property: true } },
        exempt: true,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetBid",
      };

    const max_bid_amount = await prisma.bid_transact.findFirst({
      where: {
        bidId: payload.id,
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
      functionname: "GetBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetBid",
    };
    return response;
  }
};

export default GetBid;
