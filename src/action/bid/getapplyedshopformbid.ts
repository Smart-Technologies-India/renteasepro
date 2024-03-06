"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface GetApplyedShopFromBidPayload {
  userid: number;
}

const GetApplyedShopFromBid = async (
  payload: GetApplyedShopFromBidPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const bid_transaction = await prisma.bid_transact.findMany({
      include: {
        shop: { include: { property: true } },
      },
    });

    if (!bid_transaction)
      return {
        status: false,
        data: null,
        message: "No Bid transaction exist for this user id. Please try again.",
        functionname: "GetApplyedShopFromBid",
      };

    return {
      status: true,
      data: bid_transaction,
      message: "Bid transaction get successfully",
      functionname: "GetApplyedShopFromBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetApplyedShopFromBid",
    };
    return response;
  }
};

export default GetApplyedShopFromBid;
