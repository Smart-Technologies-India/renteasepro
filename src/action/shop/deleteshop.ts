"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DeleteShopPayload {
  id: number;
  userId: number;
}

const DeleteShop = async (
  payload: DeleteShopPayload
): Promise<ApiResponseType<shop | null>> => {
  try {
    const shop = await prisma.shop.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!shop)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "DeleteShop",
      };

    const deleteShop = await prisma.shop.update({
      where: {
        id: payload.id,
      },
      data: {
        deletedAt: new Date(),
        deletedById: payload.userId,
      },
    });

    if (!deleteShop)
      return {
        status: false,
        data: null,
        message: "Shop not deleted. Please try again.",
        functionname: "DeleteShop",
      };

    return {
      status: true,
      data: deleteShop,
      message: "Shop deleted successfully",
      functionname: "DeleteShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteShop",
    };
    return response;
  }
};

export default DeleteShop;
