"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent } from "@prisma/client";

interface getRentEndingPayload {}

const getRentEnding = async (
  payload: getRentEndingPayload
): Promise<ApiResponseType<rent[] | null>> => {
  try {
    const currentdate = new Date();

    // currentdate - 5 day
    const next5day = new Date(currentdate.setDate(currentdate.getDate() + 5));

    const monthcurrentdate = new Date();

    const getnextmonth = new Date(
      monthcurrentdate.setDate(monthcurrentdate.getDate() + 30)
    );

    const rentlastmonth = await prisma.rent.findMany({
      where: {
        rent_end_date: {
          gte: new Date(),
          lte: getnextmonth,
        },
      },
      include: {
        shop: {
          include: {
            property: true,
          },
        },
        user: true,
      },
    });

    

    return {
      status: true,
      data: rentlastmonth,
      message: "Report data get successfully",
      functionname: "getRentEnding",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getRentEnding",
    };
    return response;
  }
};

export default getRentEnding;
