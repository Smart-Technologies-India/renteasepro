"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid_payment } from "@prisma/client";

interface GetFromUserBidPayload {
  userid: number;
  bidid: number;
}

const GetFromUserBid = async (
  payload: GetFromUserBidPayload
): Promise<ApiResponseType<bid_payment | null>> => {
  try {
    let bidpayment = await prisma.bid_payment.findFirst({
      where: {
        bidId: parseInt(payload.bidid.toString() ?? "0"),
        userId: parseInt(payload.userid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
      },
    });

    if (!bidpayment)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetFromUserBid",
      };

    return {
      status: true,
      data: bidpayment,
      message: "Bid payment data get successfully",
      functionname: "GetFromUserBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetFromUserBid",
    };
    return response;
  }
};

export default GetFromUserBid;
