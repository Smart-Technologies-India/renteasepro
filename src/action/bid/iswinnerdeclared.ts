"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface IsWinnderDeclaredPayload {
  bidid: number;
}

const IsWinnderDeclared = async (
  payload: IsWinnderDeclaredPayload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const total_biders = await prisma.bid_transact.findMany({
      where: {
        bidId: parseInt(payload.bidid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      distinct: ["userId"],
    });

    if (!total_biders)
      return {
        status: false,
        data: null,
        message: "There is no Bidders. Please try again.",
        functionname: "TotalBidders",
      };

    let isWinnerDeclared = false;

    for (let i = 0; i < total_biders.length; i++) {
      if (total_biders[i].iswinningbid === true) {
        isWinnerDeclared = true;
        break;
      }
    }

    return {
      status: true,
      data: isWinnerDeclared,
      message: "Is Winner Declared data get successfully",
      functionname: "IsWinnderDeclared",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "IsWinnderDeclared",
    };
    return response;
  }
};

export default IsWinnderDeclared;
