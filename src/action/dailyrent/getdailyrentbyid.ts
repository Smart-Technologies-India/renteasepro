"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_property, daily_rent, daily_shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyRentByIdPayload {
  id: number;
}

const GetDailyRentById = async (
  payload: GetDailyRentByIdPayload
): Promise<
  ApiResponseType<
    | (daily_rent & { daily_shop: daily_shop & { property: daily_property } })
    | null
  >
> => {
  try {
    const rent_respone = await prisma.daily_rent.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        daily_shop: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetDailyRent",
      };

    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
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
