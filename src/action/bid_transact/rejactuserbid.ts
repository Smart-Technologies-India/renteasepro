"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface RejectUserBidPayload {
  id: number;
  reason: string;
}

const RejectUserBid = async (
  payload: RejectUserBidPayload
): Promise<ApiResponseType<bid_transact | null>> => {
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
        functionname: "RejectBidTran",
      };

    const updateresponse = await prisma.bid_transact.update({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
      data: {
        status: "USERNOTINTERESTED",
        userremarks: payload.reason,
      },
    });

    if (!updateresponse)
      return {
        status: false,
        data: null,
        message: "Bid transact not updated. Please try again.",
        functionname: "RejectUserBid",
      };

    return {
      status: true,
      data: bid_transact,
      message: "Bid transact updated successfully.",
      functionname: "RejectUserBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "RejectUserBid",
    };
    return response;
  }
};

export default RejectUserBid;
