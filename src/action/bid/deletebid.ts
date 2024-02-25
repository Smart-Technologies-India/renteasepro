"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DeleteBidPayload {
  id: number;
  userId: number;
}

const DeleteBid = async (
  payload: DeleteBidPayload
): Promise<ApiResponseType<bid | null>> => {
  try {
    const bid = await prisma.bid.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "DeleteBid",
      };

    const deleteBid = await prisma.bid.update({
      where: {
        id: payload.id,
      },
      data: {
        deletedAt: new Date(),
        deletedById: payload.userId,
      },
    });

    if (!deleteBid)
      return {
        status: false,
        data: null,
        message: "Bid not deleted. Please try again.",
        functionname: "DeleteBid",
      };

    return {
      status: true,
      data: deleteBid,
      message: "Bid deleted successfully",
      functionname: "DeleteBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteBid",
    };
    return response;
  }
};

export default DeleteBid;
