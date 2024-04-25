"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid } from "@prisma/client";
import { includes } from "valibot";

interface bidWithNoBidderPayload {}

const bidWithNoBidder = async (
  payload: bidWithNoBidderPayload
): Promise<ApiResponseType<bid[] | null>> => {
  try {
    const bidwithnobidders = await prisma.bid.findMany({
      include: {
        bid_transact: true,
        shop: {
          include: {
            property: true,
          },
        },
      },
    });
    const bidwithnobidder = bidwithnobidders.filter(
      (item) => item.bid_transact.length == 0
    );

    let bidsdetails = [];
    for (let i = 0; i < bidwithnobidder.length; i++) {
      let biddetail: any = bidwithnobidder[i];
      let uniquebidders = bidwithnobidder[i].bid_transact.filter(
        (v, i, a) => a.findIndex((t) => t.userId === v.userId) === i
      );
      biddetail.bidderscount = uniquebidders.length;

      bidsdetails.push(biddetail);
    }

    return {
      status: true,
      data: bidsdetails,
      message: "Report data get successfully",
      functionname: "bidWithNoBidder",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "bidWithNoBidder",
    };
    return response;
  }
};

export default bidWithNoBidder;
