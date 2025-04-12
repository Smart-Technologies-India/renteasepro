"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { BidStatus } from "@prisma/client";

interface GetLiveBidPayload {}

const GetLiveBid = async (
  payload: GetLiveBidPayload
): Promise<ApiResponseType<any | null>> => {
  const current_date = new Date();
  try {
    const bid = await prisma.bid.findMany({
      where: {
        bid_status: BidStatus.PUBLISHED,
        bidstartdate: {
          lte: current_date,
        },
        bidenddate: {
          gte: current_date,
        },
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Something Went wrong unable to get data.",
        functionname: "GetLiveBid",
      };

    let propertydata = [];

    for (let i = 0; i < bid.length; i++) {
      if (bid[i].shop) {
        propertydata.push(bid[i].shop.property);
      }
    }

    let biddata = bid.map((item: any) => {
      delete item.shop.property;
      return item;
    });

    // // remove the duplicate property
    let uniqueproperty = propertydata.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i
    );

    // remove the duplicate bid
    let uniquebid = biddata.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i
    );

    // // add bid count to property
    uniqueproperty = uniqueproperty.map((item: any) => {
      let count = 0;
      uniquebid.forEach((element: any) => {
        if (element.shop.propertyId === item.id) {
          count++;
        }
      });
      item.bidcount = count;
      return item;
    });

    return {
      status: true,
      data: uniqueproperty,
      message: "Data get successfully",
      functionname: "GetLiveBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetLiveBid",
    };
    return response;
  }
};

export default GetLiveBid;
