"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllBidPayload {}

const AllBids = async (
  payload: AllBidPayload
): Promise<ApiResponseType<bid[] | null>> => {
  try {
    const allbids = await prisma.bid.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!allbids)
      return {
        status: false,
        data: null,
        message: "No bids found. Please try again.",
        functionname: "AllBids",
      };

    return {
      status: true,
      data: allbids,
      message: "Bid data get successfully",
      functionname: "AllBids",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllBids",
    };
    return response;
  }
};

export default AllBids;
