"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { BidStatus, bid } from "@prisma/client";
import prisma from "../../../prisma/database";

interface UpdateBidStatusPayload {
  id: number;
  status: BidStatus;
}

const UpdateBidStatus = async (
  payload: UpdateBidStatusPayload
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
        functionname: "UpdateBidStatus",
      };

    const updateBid = await prisma.bid.update({
      where: {
        id: payload.id,
      },
      data: {
        bid_status: payload.status,
      },
    });

    if (!updateBid)
      return {
        status: false,
        data: null,
        message: "Bid update failed. Please try again.",
        functionname: "UpdateBidStatus",
      };

    return {
      status: true,
      data: updateBid,
      message: "Bid updated successfully",
      functionname: "UpdateBidStatus",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateBidStatus",
    };
    return response;
  }
};

export default UpdateBidStatus;
