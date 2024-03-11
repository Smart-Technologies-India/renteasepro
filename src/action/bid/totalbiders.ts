"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface TotalBiddersPayload {
  bidid: number;
}

const TotalBidders = async (
  payload: TotalBiddersPayload
): Promise<ApiResponseType<number | null>> => {
  try {
    const total_biders = await prisma.bid_transact.findMany({
      where: {
        bidId: parseInt(payload.bidid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
    });


    if (!total_biders)
      return {
        status: false,
        data: null,
        message: "There is no Biders. Please try again.",
        functionname: "TotalBidders",
      };

    return {
      status: true,
      data: total_biders.length,
      message: "Bid Total Biders data get successfully",
      functionname: "TotalBidders",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "TotalBidders",
    };
    return response;
  }
};

export default TotalBidders;
