"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid_transact } from "@prisma/client";

interface getFromUserPayload {
  bidid: number;
  userid: number;
}

const getFromUser = async (
  payload: getFromUserPayload
): Promise<ApiResponseType<bid_transact | null>> => {
  try {
    const bid_respone = await prisma.bid_transact.findFirst({
      where: {
        status: "PENDING",
        bidId: parseInt(payload.bidid.toString() ?? "0"),
        userId: parseInt(payload.userid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    if (!bid_respone)
      return {
        status: false,
        data: null,
        message: "User has not applied on this bid.",
        functionname: "getFromUser",
      };

    return {
      status: true,
      data: bid_respone,
      message: "User has applied on this bid.",
      functionname: "getFromUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getFromUser",
    };
    return response;
  }
};

export default getFromUser;
