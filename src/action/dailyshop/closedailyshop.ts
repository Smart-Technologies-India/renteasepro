"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CloseDailyShopPayload {
  id: number;
  rentid: number;
  userid: number;
  currentuser: number;
}

const CloseDailyShop = async (
  payload: CloseDailyShopPayload
): Promise<ApiResponseType<shop | null>> => {
  try {
    const shopdata = await prisma.daily_shop.findFirst({
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
        message: "Daily Shop not found. Please try again.",
        functionname: "CloseDailyShop",
      };

    const updateshop = await prisma.daily_shop.update({
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
        message: "Unable to update daily shop. Please try again.",
        functionname: "CloseDailyShop",
      };

    const updaterent = await prisma.daily_rent.update({
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
        message: "Unable to update daily rent. Please try again.",
        functionname: "CloseDailyShop",
      };

    const updaterenttransect = await prisma.daily_rent_transact.updateMany({
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
        message: "Unable to update daily rent transact. Please try again.",
        functionname: "CloseDailyShop",
      };

    return {
      status: true,
      data: null,
      message: "Daily Rent Close successfully",
      functionname: "CloseDailyShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CloseDailyShop",
    };
    return response;
  }
};

export default CloseDailyShop;
