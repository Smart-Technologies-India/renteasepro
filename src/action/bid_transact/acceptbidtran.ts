"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AcceptBidTranPayload {
  id: number;
  reason: string;
}

const AcceptBidTran = async (
  payload: AcceptBidTranPayload
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
        functionname: "AcceptBidTran",
      };

    const updateresponse = await prisma.bid_transact.update({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
      data: {
        status: "ACCEPTED",
        biddocreason: payload.reason,
        bidrejected: false,
      },
    });

    if (!updateresponse)
      return {
        status: false,
        data: null,
        message: "Bid transact not updated. Please try again.",
        functionname: "AcceptBidTran",
      };

    return {
      status: true,
      data: bid_transact,
      message: "Bid transact updated successfully.",
      functionname: "AcceptBidTran",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AcceptBidTran",
    };
    return response;
  }
};

export default AcceptBidTran;
