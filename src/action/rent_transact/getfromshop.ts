"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface GetFromShopPayload {
  shopid: number;
}

const GetFromShop = async (
  payload: GetFromShopPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const rent_transact_response = await prisma.rent_transact.findMany({
      where: {
        OR: [
          {
            status: "DUE",
          },
          {
            status: "MONTHCROSS",
          },
          {
            status: "LATE",
          },
          {
            status: "PAID",
          },
          {
            status: "INACTIVE",
          },
        ],
        shopId: parseInt(payload.shopid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
        rent: true,
        user: true,
      },
    });

    if (!rent_transact_response)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetFromShop",
      };

    return {
      status: true,
      data: rent_transact_response,
      message: "Rent Transact data get successfully",
      functionname: "GetFromShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetFromShop",
    };
    return response;
  }
};

export default GetFromShop;
