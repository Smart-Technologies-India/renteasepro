"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid, bid_transact } from "@prisma/client";

interface GetUserBidsPayload {
  userid: number;
}

const GetUserBid = async (
  payload: GetUserBidsPayload
): Promise<ApiResponseType<bid_transact[] | null>> => {
  try {
    const bid_transacts = await prisma.bid_transact.findMany({
      where: {
        userId: payload.userid,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
        bid: true,
      },
    });

    if (!bid_transacts)
      return {
        status: false,
        data: null,
        message: "Bid Transacts. Please try again.",
        functionname: "GetUserBid",
      };

    return {
      status: true,
      data: bid_transacts,
      message: "Bid transacts data get successfully",
      functionname: "GetUserBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetUserBid",
    };
    return response;
  }
};

export default GetUserBid;
