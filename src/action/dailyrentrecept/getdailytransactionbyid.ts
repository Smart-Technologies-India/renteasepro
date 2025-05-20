"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  user,
} from "@prisma/client";

interface GetDailyTransactionByIdPayload {
  id: number;
}

const GetDailyTransactionById = async (
  payload: GetDailyTransactionByIdPayload
): Promise<
  ApiResponseType<
    | (daily_rent_transact & {
        user: user;
        daily_rent: daily_rent;
        daily_shop: daily_shop & { property: daily_property };
      })
    | null
  >
> => {
  try {
    const rent_transact_response = await prisma.daily_rent_transact.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        daily_shop: { include: { property: true } },
        daily_rent: true,
        user: true,
      },
    });

    if (!rent_transact_response)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetDailyRentRecept",
      };

    return {
      status: true,
      data: rent_transact_response,
      message: "Rent Transact data get successfully",
      functionname: "GetDailyTransactionById",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyTransactionById",
    };
    return response;
  }
};

export default GetDailyTransactionById;
