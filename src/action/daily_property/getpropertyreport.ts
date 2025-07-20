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
  console.log("GetPropertyReport called with payload:", payload);
  try {
    // const start_date = new Date();
    // const end_date = new Date(new Date().setDate(new Date().getDate() + 15));
    // const rent_respone = await prisma.daily_rent.findMany({
    //   where: {
    //     daily_shop: {
    //       id: parseInt(payload.id.toString() ?? "0"),
    //     },
    //     deletedAt: null,
    //     deletedBy: null,
    //     ...(start_date && end_date
    //       ? {
    //           OR: [
    //             {
    //               prep_day: {
    //                 gte: start_date,
    //                 lte: end_date,
    //               },
    //             },
    //             {
    //               handover_day: {
    //                 gte: start_date,
    //                 lte: end_date,
    //               },
    //             },
    //           ],
    //         }
    //       : {}),
    //     event_from_date: {
    //       gte: start_date,
    //     },
    //     event_to_date: {
    //       lte: end_date,
    //     },
    //   },
    //   include: {
    //     rent_transact: true,
    //     user: true,
    //     daily_shop: {
    //       include: {
    //         property: true,
    //       },
    //     },
    //   },
    // });
    // console.log(rent_respone);

    // if (!rent_respone)
    //   return {
    //     status: false,
    //     data: null,
    //     message: "Invalid id. Please try again.",
    //     functionname: "GetPropertyReport",
    //   };

    // return {
    //   status: true,
    //   data: rent_respone,
    //   message: "Rent data get successfully",
    //   functionname: "GetPropertyReport",
    // };
    const today = new Date();
    const end_date = new Date(today);
    end_date.setDate(today.getDate() + 15);

    const rent_respone = await prisma.daily_rent.findMany({
      where: {
        daily_shop: {
          property: {
            id: parseInt(payload.id.toString() ?? "0"),
          },
        },
        deletedAt: null,
        deletedBy: null,
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

    if (!rent_respone || rent_respone.length === 0) {
      return {
        status: false,
        data: null,
        message: "No rent data found for the specified property.",
        functionname: "GetPropertyReport",
      };
    }

    // Step 2: Create array of dates from today to end_date
    const dateRange: string[] = [];
    const tempDate = new Date(today);

    console.log(tempDate, end_date);
    while (tempDate <= end_date) {
      dateRange.push(tempDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      tempDate.setDate(tempDate.getDate() + 1);
    }
    console.log("Date Range:", dateRange);

    // Step 3: Filter records where any date field matches the range
    const matchedResults = rent_respone.filter((rent) => {
      const checkDates = [
        rent.prep_day,
        rent.handover_day,
        rent.event_from_date,
        rent.event_to_date,
      ];

      return checkDates.some((date) => {
        if (!date) return false;
        const d = new Date(date).toISOString().split("T")[0];
        return dateRange.includes(d);
      });
    });

    // Step 4: Return results
    if (!matchedResults || matchedResults.length === 0) {
      return {
        status: false,
        data: null,
        message: "No matching rent data found.",
        functionname: "GetPropertyReport",
      };
    }

    return {
      status: true,
      data: matchedResults,
      message: "Rent data fetched successfully",
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
