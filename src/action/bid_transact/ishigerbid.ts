"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface isHigherBidPayload {
  id: number;
}

const isHigherBid = async (
  payload: isHigherBidPayload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const bid_transact = await prisma.bid_transact.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
      },
    });

    if (!bid_transact)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "isHigherBid",
      };

    const getallbidsforcheck = await prisma.bid_transact.findMany({
      where: {
        bidId: bid_transact.bidId,
        OR: [
          {
            status: "ACCEPTED",
          },
          {
            status: "PENDING",
          },
        ],
      },
      orderBy: {
        amount: "desc",
      },
    });

    if (!getallbidsforcheck)
      return {
        status: false,
        data: null,
        message: "No bids found for this bid id.",
        functionname: "setWinner",
      };

    if (getallbidsforcheck[0].amount > bid_transact.amount)
      return {
        status: true,
        data: false,
        message: "This bid is not the highest bid.",
        functionname: "setWinner",
      };

    return {
      status: true,
      data: true,
      message: "This bid is the highest bid.",
      functionname: "setWinner",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "isHigherBid",
    };
    return response;
  }
};

export default isHigherBid;
