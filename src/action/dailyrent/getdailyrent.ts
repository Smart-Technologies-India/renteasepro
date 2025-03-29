"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  daily_rent,
  daily_rent_transact,
  rent,
  rent_transact,
  shop,
  user,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetDailyRentPayload {
  id: number;
}

const GetDailyRent = async (
  payload: GetDailyRentPayload
): Promise<
  ApiResponseType<Array<
    daily_rent & { user: user; rent_transact: daily_rent_transact[] }
  > | null>
> => {
  try {
    const rent_respone = await prisma.daily_rent.findMany({
      where: {
        shopId: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        rent_transact: true,
        user: true,
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
      functionname: "GetDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyRent",
    };
    return response;
  }
};

export default GetDailyRent;
