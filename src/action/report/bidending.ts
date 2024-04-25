"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid } from "@prisma/client";

interface bidEndingPayload {}

const bidEnding = async (
  payload: bidEndingPayload
): Promise<ApiResponseType<bid[] | null>> => {
  try {
    const currentdate = new Date();

    // currentdate - 5 day
    const next5day = new Date(currentdate.setDate(currentdate.getDate() + 5));

    const monthcurrentdate = new Date();

    const getnextmonth = new Date(
      monthcurrentdate.setDate(monthcurrentdate.getDate() + 30)
    );

    // get all the bid which is in between last 5 days and current date
    const bidlast5day = await prisma.bid.findMany({
      where: {
        bidenddate: {
          gte: new Date(),
          lte: next5day,
        },
      },
      include: {
        bid_transact: true,
        shop: {
          include: {
            property: true,
          },
        },
      },
    });

    let bidsdetails = [];
    for (let i = 0; i < bidlast5day.length; i++) {
      let biddetail: any = bidlast5day[i];
      let uniquebidders = bidlast5day[i].bid_transact.filter(
        (v, i, a) => a.findIndex((t) => t.userId === v.userId) === i
      );
      biddetail.bidderscount = uniquebidders.length;

      bidsdetails.push(biddetail);
    }

    return {
      status: true,
      data: bidsdetails,
      message: "Report data get successfully",
      functionname: "bidEnding",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "bidEnding",
    };
    return response;
  }
};

export default bidEnding;
