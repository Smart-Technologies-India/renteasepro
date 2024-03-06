"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetFromBidIdPayload {
  id: number;
}

const GetFromBidId = async (
  payload: GetFromBidIdPayload
): Promise<ApiResponseType<bid_transact[] | null>> => {
  try {
    const bid_transact = await prisma.bid_transact.findMany({
      where: {
        bidId: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        user: true,
        shop: true,
        bid: true,
      },
    });

    if (!bid_transact)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetFromBidId",
      };

    return {
      status: true,
      data: bid_transact,
      message: "Bid transact data get successfully",
      functionname: "GetFromBidId",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetFromBidId",
    };
    return response;
  }
};

export default GetFromBidId;
