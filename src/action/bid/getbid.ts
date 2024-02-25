"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Status, bid } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetBidPayload {
  id: number;
}

const GetBid = async (
  payload: GetBidPayload
): Promise<ApiResponseType<bid | null>> => {
  try {
    const bid = await prisma.bid.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetBid",
      };

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
