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

interface GetDailyRentDateChangeReceptPayload {
  rentid: number;
  userid: number;
  transactionid: string;
}

const GetDailyRentDateChangeRecept = async (
  payload: GetDailyRentDateChangeReceptPayload,
): Promise<
  ApiResponseType<Array<
    daily_rent_transact & {
      user: user;
      daily_rent: daily_rent;
      daily_shop: daily_shop & { property: daily_property };
    }
  > | null>
> => {
  try {
    const is_date_change = await prisma.daily_rent_transact.findMany({
      where: {
        status: "PAID",
        rentId: parseInt(payload.rentid.toString() ?? "0"),
        userId: parseInt(payload.userid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      orderBy: {
        transaction_date: "asc",
      },
    });

    if (is_date_change.length < 3) {
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetDailyRentDateChangeRecept",
      };
    }

    const rent_transact_response = await prisma.daily_rent_transact.findMany({
      where: {
        status: "PAID",
        rentId: parseInt(payload.rentid.toString() ?? "0"),
        userId: parseInt(payload.userid.toString() ?? "0"),
        id: parseInt(payload.transactionid.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        daily_shop: { include: { property: true } },
        daily_rent: true,
        user: true,
      },
    });

    if (!rent_transact_response || rent_transact_response.length === 0)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetDailyRentDateChangeRecept",
      };

    if (is_date_change[2].id != rent_transact_response[0].id) {
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetDailyRentDateChangeRecept",
      };
    }

    return {
      status: true,
      data: rent_transact_response,
      message: "Rent Transact data get successfully",
      functionname: "GetDailyRentDateChangeRecept",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyRentDateChangeRecept",
    };
    return response;
  }
};

export default GetDailyRentDateChangeRecept;
