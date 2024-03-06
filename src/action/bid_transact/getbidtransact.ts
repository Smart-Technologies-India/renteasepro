"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetBidTranPayload {
  id: number;
}

const GetBidTran = async (
  payload: GetBidTranPayload
): Promise<ApiResponseType<bid_transact | null>> => {
  try {
    const bid_transact = await prisma.bid_transact.findFirst({
      where: {
        id: payload.id,
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
        functionname: "GetBidTran",
      };

    return {
      status: true,
      data: bid_transact,
      message: "Bid transact data get successfully",
      functionname: "GetBidTran",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetBidTran",
    };
    return response;
  }
};

export default GetBidTran;
