"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface isShopRentedPayload {
  id: number;
}

const isShopRented = async (
  payload: isShopRentedPayload
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const rent_respone = await prisma.rent.findFirst({
      where: {
        status: "RUNNING",
        shopId: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "There is no rent created on this shop.",
        functionname: "isShopRented",
      };

    return {
      status: true,
      data: true,
      message: "Shop is rented.",
      functionname: "isShopRented",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "isShopRented",
    };
    return response;
  }
};

export default isShopRented;
