"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllBidTransactPayload {}

const AllBidTransact = async (
  payload: AllBidTransactPayload
): Promise<ApiResponseType<bid_transact[] | null>> => {
  try {
    const allbidstransact = await prisma.bid_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        user: true,
        shop: true,
        bid: true,
      },
    });

    if (!allbidstransact)
      return {
        status: false,
        data: null,
        message: "No bids found. Please try again.",
        functionname: "AllBidTransact",
      };

    return {
      status: true,
      data: allbidstransact,
      message: "Bid data get successfully",
      functionname: "AllBidTransact",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllBidTransact",
    };
    return response;
  }
};

export default AllBidTransact;
