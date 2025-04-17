"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  property,
  shop,
  shop_category,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyRentByIdPayload {
  id: number;
}

const GetDailyRentById = async (
  payload: GetDailyRentByIdPayload
): Promise<
  ApiResponseType<
    | (daily_rent & {
        daily_shop: daily_shop & {
          property: daily_property;
          shop_category: shop_category;
          daily_rent_transact: daily_rent_transact[];
        };
      })
    | null
  >
> => {
  try {
    const shop = await prisma.daily_rent.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        daily_shop: {
          include: {
            property: true,
            shop_category: true,
            daily_rent_transact: {
              where: {
                rentId: parseInt(payload.id.toString() ?? "0"),
              },
            },
          },
        },
      },
    });

    if (!shop)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetDailyRentById",
      };

    return {
      status: true,
      data: shop,
      message: "Shop data get successfully",
      functionname: "GetDailyRentById",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyRentById",
    };
    return response;
  }
};

export default GetDailyRentById;
