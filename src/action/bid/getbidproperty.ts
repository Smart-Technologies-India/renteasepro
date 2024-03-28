"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";


interface GetBidPropertyPayload {}

const GetBidProperty = async (
  payload: GetBidPropertyPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const bid = await prisma.shop.findMany({
      where: {
        status: "AUCTION",
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        property: true,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Something want wrong unable to get data.",
        functionname: "GetBidProperty",
      };

    let propertydata = bid.map((item: any) => {
      return item.property;
    });

    // remove property from bid
    let biddata = bid.map((item: any) => {
      delete item.property;
      return item;
    });

    // remove the duplicate property
    let uniqueproperty = propertydata.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i
    );

    // remove the duplicate bid
    let uniquebid = biddata.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i
    );

    // add bid count to property

    uniqueproperty = uniqueproperty.map((item: any) => {
      let count = 0;
      uniquebid.forEach((element: any) => {
        if (element.propertyId === item.id) {
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
      functionname: "GetBidProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetBidProperty",
    };
    return response;
  }
};

export default GetBidProperty;
