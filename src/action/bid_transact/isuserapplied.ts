"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface IsUserAppliedForBidPayload {
  userid: number;
  bidid: number;
}

const IsUserAppliedForBid = async (
  payload: IsUserAppliedForBidPayload
): Promise<ApiResponseType<bid_transact | null>> => {
  try {
    const bid_transact = await prisma.bid_transact.findFirst({
      where: {
        userId: payload.userid,
        bidId: payload.bidid,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!bid_transact)
      return {
        status: false,
        data: null,
        message: "User is not applied for this bid.",
        functionname: "DeleteProperty",
      };

    return {
      status: true,
      data: bid_transact,
      message: "User is applied for this bid.",
      functionname: "IsUserAppliedForBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "IsUserAppliedForBid",
    };
    return response;
  }
};

export default IsUserAppliedForBid;
