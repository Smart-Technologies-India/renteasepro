"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface GetRentPropertyPayload {}

const GetRentProperty = async (
  payload: GetRentPropertyPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const rent = await prisma.shop.findMany({
      where: {
        status: "RENTED",
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        property: true,
      },
    });

    if (!rent)
      return {
        status: false,
        data: null,
        message: "Something want wrong unable to get data.",
        functionname: "GetRentProperty",
      };

    let propertydata = rent.map((item: any) => {
      return item.property;
    });

    // remove property from rent
    let rentdata = rent.map((item: any) => {
      delete item.property;
      return item;
    });

    // remove the duplicate property
    let uniqueproperty = propertydata.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i
    );

    // remove the duplicate rent
    let uniquerent = rentdata.filter(
      (v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i
    );

    // add rent count to property

    uniqueproperty = uniqueproperty.map((item: any) => {
      let count = 0;
      uniquerent.forEach((element: any) => {
        if (element.propertyId === item.id) {
          count++;
        }
      });
      item.rentcount = count;
      return item;
    });

    return {
      status: true,
      data: uniqueproperty,
      message: "Data get successfully",
      functionname: "GetRentProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRentProperty",
    };
    return response;
  }
};

export default GetRentProperty;
