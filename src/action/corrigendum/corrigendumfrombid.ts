"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { corrigendum } from "@prisma/client";

interface CorrigendumFromBidPayload {
  bidid: number;
}

const CorrigendumFromBid = async (
  payload: CorrigendumFromBidPayload
): Promise<ApiResponseType<corrigendum | null>> => {
  try {
    const corrigendum = await prisma.corrigendum.findFirst({
      where: {
        bidId: payload.bidid,
      },
    });

    if (!corrigendum)
      return {
        status: false,
        data: null,
        message: "Unable to get corrigendum. Please try again.",
        functionname: "CorrigendumFromBid",
      };

    return {
      status: true,
      data: corrigendum,
      message: "Corrigendum data get successfully",
      functionname: "CorrigendumFromBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CorrigendumFromBid",
    };
    return response;
  }
};

export default CorrigendumFromBid;
