"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetShopsByPropertyPayload {
  propertyid: number;
}

const GetShopsByProperty = async (
  payload: GetShopsByPropertyPayload
): Promise<ApiResponseType<shop[] | null>> => {
  try {
    const propery = await prisma.property.findFirst({
      where: {
        id: parseInt(payload.propertyid.toString(), 0),
        deletedAt: null,
        deletedBy: null,
        status: "ACTIVE",
      },
      include: {
        shop: {
          include: {
            shop_category: true,
          },
        },
      },
    });

    if (!propery)
      return {
        status: false,
        data: null,
        message: "No property found. Please try again.",
        functionname: "GetShopsByProperty",
      };

    if (propery.shop.length === 0) {
      return {
        status: false,
        data: null,
        message: "No shops found. Please try again.",
        functionname: "GetShopsByProperty",
      };
    }

    const allshops = propery.shop.filter((item) => {
      return (
        item.deletedAt == null &&
        item.deletedById === null &&
        item.status === "RENTED"
      );
    });

    if (allshops.length === 0)
      return {
        status: false,
        data: null,
        message: "No shops found. Please try again.",
        functionname: "GetShopsByProperty",
      };

    return {
      status: true,
      data: allshops,
      message: "Shops data get successfully",
      functionname: "GetShopsByProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetShopsByProperty",
    };
    return response;
  }
};

export default GetShopsByProperty;
