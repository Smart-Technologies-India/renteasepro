"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_rent, daily_shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface RejectDailyRentPayload {
  id: number;
  userid: number;
}

const RejectDailyRent = async (
  payload: RejectDailyRentPayload
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
        functionname: "RejectDailyRent",
      };
    }

    const update_daily_rent = await prisma.daily_rent.update({
      where: {
        id: payload.id,
      },
      data: {
        canceldById: payload.userid,
        is_cancel: true,
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
        functionname: "RejectDailyRent",
      };
    }

    return {
      status: true,
      data: rent_respone,
      message: "Daily Rent Rejected successfully",
      functionname: "RejectDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "RejectDailyRent",
    };
    return response;
  }
};

export default RejectDailyRent;
