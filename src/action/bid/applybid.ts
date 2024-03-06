"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface ApplyBidPayload {
  bidId: number;
  userId: number;
  shopId: number;
  amount: number;
}

const ApplyBid = async (
  payload: ApplyBidPayload
): Promise<ApiResponseType<bid_transact | null>> => {
  try {
    const bid_transactExist = await prisma.bid_transact.findFirst({
      where: {
        bidId: payload.bidId,
        userId: payload.userId,
        shopId: payload.shopId,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (bid_transactExist)
      return {
        status: false,
        data: null,
        message:
          "You have already applied for this bid. Kindly wait for the result",
        functionname: "ApplyBid",
      };

    const bid_transactresponse = await prisma.bid_transact.create({
      data: {
        userId: payload.userId,
        shopId: payload.shopId,
        bidId: payload.bidId,
        amount: payload.amount,
        createdById: payload.userId,
      },
    });

    if (!bid_transactresponse)
      return {
        status: false,
        data: null,
        message: "User bid transaction failed. Please try again later.",
        functionname: "ApplyBid",
      };

    return {
      status: true,
      data: bid_transactresponse,
      message: "Bid Application successful.",
      functionname: "ApplyBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "ApplyBid",
    };
    return response;
  }
};

export default ApplyBid;
