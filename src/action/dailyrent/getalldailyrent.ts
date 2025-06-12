"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  user,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetAllDailyRentPayload {}

const GetAllDailyRent = async (
  payload: GetAllDailyRentPayload
): Promise<
  ApiResponseType<Array<
    daily_rent & {
      user: user;
      rent_transact: daily_rent_transact[];
      daily_shop: daily_shop & { property: daily_property };
    }
  > | null>
> => {
  try {
    const rent_respone = await prisma.daily_rent.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: {
          not: "NONE",
        },
      },
      include: {
        rent_transact: true,
        user: true,
        daily_shop: {
          include: {
            property: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetAllDailyRent",
      };

    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
      functionname: "GetAllDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllDailyRent",
    };
    return response;
  }
};

export default GetAllDailyRent;
