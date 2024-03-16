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
        bidId: parseInt(payload.id.toString() ?? "0"),
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

    // shorting by highest amount
    const uniqueBids = bid_transact.sort((a, b) => {
      return b.amount - a.amount;
    });

    // removing duplicate user
    const uniqueBidsUser = uniqueBids.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) => t.user.id === thing.user.id && t.shop.id === thing.shop.id
        )
    );

    return {
      status: true,
      data: uniqueBidsUser,
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
