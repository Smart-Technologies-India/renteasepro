"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  rent,
  rent_transact,
  shop,
  user,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetPropertyReportPayload {
  id: number;
}

const GetPropertyReport = async (
  payload: GetPropertyReportPayload
): Promise<
  ApiResponseType<Array<
    daily_rent & {
      rent_transact: daily_rent_transact[];
      user: user | null;
      daily_shop: daily_shop & {
        property: daily_property | null;
      };
    }
  > | null>
> => {
  try {
    const start_date = new Date();
    const end_date = new Date(new Date().setDate(new Date().getDate() + 15));
    const rent_respone = await prisma.daily_rent.findMany({
      where: {
        daily_shop: {
          id: parseInt(payload.id.toString() ?? "0"),
        },
        deletedAt: null,
        deletedBy: null,
        prep_day: {
          gte: start_date,
          lte: end_date,
        },
        handover_day: {
          gte: start_date,
          lte: end_date,
        },
        event_from_date: {
          gte: start_date,
        },
        event_to_date: {
          lte: end_date,
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
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetPropertyReport",
      };

    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
      functionname: "GetPropertyReport",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetPropertyReport",
    };
    return response;
  }
};

export default GetPropertyReport;
