"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_rent, daily_shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AccpectDailyRentPayload {
  id: number;
  userid: number;
}

const AccpectDailyRent = async (
  payload: AccpectDailyRentPayload
): Promise<
  ApiResponseType<(daily_rent & { daily_shop: daily_shop }) | null>
> => {
  try {
    const rent_respone = await prisma.daily_rent.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        daily_shop: true,
      },
    });

    if (!rent_respone) {
      return {
        status: false,
        data: null,
        message: "Daily Rent not found. Please try again.",
        functionname: "AccpectDailyRent",
      };
    }

    const update_daily_rent = await prisma.daily_rent.update({
      where: {
        id: payload.id,
      },
      data: {
        approvedById: payload.userid,
        approved_date: new Date(),
        is_approved: true,
      },
      include: {
        daily_shop: true,
      },
    });

    if (!update_daily_rent) {
      return {
        status: false,
        data: null,
        message: "Daily Rent not updated. Please try again.",
        functionname: "AccpectDailyRent",
      };
    }

    return {
      status: true,
      data: rent_respone,
      message: "Daily Rent Accepted successfully",
      functionname: "AccpectDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AccpectDailyRent",
    };
    return response;
  }
};

export default AccpectDailyRent;
