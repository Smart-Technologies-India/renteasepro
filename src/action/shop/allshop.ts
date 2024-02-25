"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllShopsPayload {}

const AllShops = async (
  payload: AllShopsPayload
): Promise<ApiResponseType<shop[] | null>> => {
  try {
    const allshops = await prisma.shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop_category: true,
      },
    });

    if (!allshops)
      return {
        status: false,
        data: null,
        message: "No shops found. Please try again.",
        functionname: "AllShops",
      };

    return {
      status: true,
      data: allshops,
      message: "Shops data get successfully",
      functionname: "AllShops",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllShops",
    };
    return response;
  }
};

export default AllShops;
