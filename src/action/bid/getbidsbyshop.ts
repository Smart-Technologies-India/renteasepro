"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid } from "@prisma/client";

interface GetBidsPayload {
  shopid: number;
}

const GetBidsByShop = async (
  payload: GetBidsPayload
): Promise<ApiResponseType<bid[] | null>> => {
  try {
    const bid = await prisma.bid.findMany({
      where: {
        shopId: payload.shopid,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        bid_transact: {
          where: {
            deletedAt: null,
            deletedBy: null,
          },
        },
        shop: true,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetBidsByShop",
      };

    let bidsdetails = [];
    for (let i = 0; i < bid.length; i++) {
      let biddetail: any = bid[i];
      let uniquebidders = bid[i].bid_transact.filter(
        (v, i, a) => a.findIndex((t) => t.userId === v.userId) === i
      );
      biddetail.bidderscount = uniquebidders.length;

      bidsdetails.push(biddetail);
    }

    return {
      status: true,
      data: bidsdetails,
      message: "Bid data get successfully",
      functionname: "GetBidsByShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetBidsByShop",
    };
    return response;
  }
};

export default GetBidsByShop;
