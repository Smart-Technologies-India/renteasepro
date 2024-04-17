"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";
import { SMSType, sendSMS } from "@/utils/smsmessage";

interface RejectBidTranPayload {
  id: number;
  reason: string;
}

const RejectBidTran = async (
  payload: RejectBidTranPayload
): Promise<ApiResponseType<bid_transact | null>> => {
  try {
    const bid_transact = await prisma.bid_transact.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: {
          include: {
            property: true,
          },
        },
        user: true,
      },
    });

    if (!bid_transact)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "RejectBidTran",
      };

    const updateresponse = await prisma.bid_transact.update({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
      data: {
        status: "REJECTED",
        bidrejected: true,
        rejectedreason: payload.reason,
      },
    });

    if (!updateresponse)
      return {
        status: false,
        data: null,
        message: "Bid transact not updated. Please try again.",
        functionname: "RejectBidTran",
      };

    const messageresponse = await sendSMS({
      type: SMSType.BidRejected,
      contact: bid_transact.user.contactone!,
      propertyName: bid_transact.shop.property.name,
    });

    if (!messageresponse.status) {
      return {
        status: false,
        data: null,
        message: messageresponse.message,
        functionname: "RejectBidTran",
      };
    }

    return {
      status: true,
      data: bid_transact,
      message: "Bid transact updated successfully.",
      functionname: "RejectBidTran",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "RejectBidTran",
    };
    return response;
  }
};

export default RejectBidTran;
