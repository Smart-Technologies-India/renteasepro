"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CloseShopPayload {
  id: number;
  rentid: number;
  userid: number;
  currentuser: number;
}

const CloseShop = async (
  payload: CloseShopPayload
): Promise<ApiResponseType<shop | null>> => {
  try {
    const shopdata = await prisma.shop.findFirst({
      where: {
        id: parseInt(payload.id.toString()),
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!shopdata)
      return {
        status: false,
        data: null,
        message: "Shop not found. Please try again.",
        functionname: "CloseShop",
      };

    const updateshop = await prisma.shop.update({
      where: {
        id: shopdata.id,
      },
      data: {
        status: "VACANT",
      },
    });

    if (!updateshop)
      return {
        status: false,
        data: null,
        message: "Unable to update shop. Please try again.",
        functionname: "CloseShop",
      };

    const updaterent = await prisma.rent.update({
      where: {
        id: parseInt(payload.rentid.toString()),
      },
      data: {
        status: "COMPLETED",
      },
    });

    if (!updaterent)
      return {
        status: false,
        data: null,
        message: "Unable to update rent. Please try again.",
        functionname: "CloseShop",
      };

    const updaterenttransect = await prisma.rent_transact.updateMany({
      where: {
        userId: parseInt(payload.userid.toString()),
        rentId: parseInt(payload.rentid.toString()),
        shopId: parseInt(payload.id.toString()),
        OR: [
          {
            status: "DUE",
          },
          {
            status: "INACTIVE",
          },
        ],
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedById: payload.currentuser,
      },
    });

    if (!updaterenttransect)
      return {
        status: false,
        data: null,
        message: "Unable to update rent transact. Please try again.",
        functionname: "CloseShop",
      };

    return {
      status: true,
      data: null,
      message: "Rent Close successfully",
      functionname: "CloseShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CloseShop",
    };
    return response;
  }
};

export default CloseShop;
