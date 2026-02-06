"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import {
  daily_property,
  daily_rent,
  daily_shop,
  property,
  rent,
  user,
} from "@prisma/client";

interface GetUserBookingHistoryPayload {
  userid: number;
}

const GetUserBookingHistory = async (
  payload: GetUserBookingHistoryPayload
): Promise<
  ApiResponseType<Array<
    daily_rent & {
      daily_shop: daily_shop & { property: daily_property };
      user: user;
    }
  > | null>
> => {
  try {
    const booking_response = await prisma.daily_rent.findMany({
      where: {
        userId: payload.userid,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        user: true,
        daily_shop: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!booking_response)
      return {
        status: false,
        data: null,
        message: "No booking data found for this user. Please try again.",
        functionname: "GetUserBookingHistory",
      };

    return {
      status: true,
      data: booking_response,
      message: "Booking data get successfully",
      functionname: "GetUserBookingHistory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetUserBookingHistory",
    };
    return response;
  }
};

export default GetUserBookingHistory;
