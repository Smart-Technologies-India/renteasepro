"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetShopFromPropertyPayload {
  propertyid: number;
}

const GetShopFromProperty = async (
  payload: GetShopFromPropertyPayload
): Promise<ApiResponseType<shop[] | null>> => {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        propertyId: parseInt(payload.propertyid.toString()),
      },
      include: {
        shop_category: true,
      },
    });

    if (!shops)
      return {
        status: false,
        data: null,
        message: "No Shop Found. Please try again.",
        functionname: "GetShopFromProperty",
      };

      

    return {
      status: true,
      data: shops,
      message: "Shops data get successfully",
      functionname: "GetShopFromProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetShopFromProperty",
    };
    return response;
  }
};

export default GetShopFromProperty;
