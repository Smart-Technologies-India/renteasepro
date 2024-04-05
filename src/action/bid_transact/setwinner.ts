"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";
import { SMSType, sendSMS } from "@/utils/smsmessage";

interface setWinnerPayload {
  id: number;
}

const setWinner = async (
  payload: setWinnerPayload
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
        functionname: "setWinner",
      };

    // const getallbidsforcheck = await prisma.bid_transact.findMany({
    //   where: {
    //     bidId: bid_transact.bidId,
    //     OR: [
    //       {
    //         status: "ACCEPTED",
    //       },
    //       {
    //         status: "PENDING",
    //       },
    //     ],
    //   },
    //   orderBy: {
    //     amount: "desc",
    //   },
    // });

    // if (!getallbidsforcheck)
    //   return {
    //     status: false,
    //     data: null,
    //     message: "No bids found for this bid id.",
    //     functionname: "setWinner",
    //   };

    // if (getallbidsforcheck[0].amount > bid_transact.amount)
    //   return {
    //     status: false,
    //     data: null,
    //     message: "This bid is not the highest bid.",
    //     functionname: "setWinner",
    //   };

    const updateresponse = await prisma.bid_transact.update({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
      data: {
        status: "WINNINGBID",
        iswinningbid: true,
      },
      include: {
        user: true,
        shop: {
          include: {
            property: true,
          },
        },
      },
    });

    const updateother = await prisma.bid_transact.updateMany({
      where: {
        bidId: bid_transact.bidId,
        id: {
          not: parseInt(payload.id.toString() ?? "0"),
        },
      },
      data: {
        status: "REJECTED",
        iswinningbid: false,
      },
    });

    if (!updateresponse || !updateother)
      return {
        status: false,
        data: null,
        message: "Bid transact not updated. Please try again.",
        functionname: "setWinner",
      };

    const messageresponse = await sendSMS({
      type: SMSType.BidAccepted,
      contact: updateresponse.user.contactone!,
      propertyName: updateresponse.shop.property.name,
    });

    if (!messageresponse.status) {
      return {
        status: false,
        data: null,
        message: messageresponse.message,
        functionname: "setWinner",
      };
    }

    return {
      status: true,
      data: bid_transact,
      message: "Bid transact updated successfully.",
      functionname: "setWinner",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "setWinner",
    };
    return response;
  }
};

export default setWinner;
