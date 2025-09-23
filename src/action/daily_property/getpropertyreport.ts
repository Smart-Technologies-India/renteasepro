"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  user,
} from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetPropertyReportPayload {
  id: number;
  all: boolean;
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
        OR: [
          {
            status: "DEPOSITDUE",
          },
          {
            status: "UPCOMING",
          },
        ],
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

    if (payload.all) {
      end_date.setDate(today.getDate() + 50);

      // return {
      //   status: true,
      //   data: rent_respone,
      //   message: "All rent data fetched successfully",
      //   functionname: "GetPropertyReport",
      // };
      // Step 2: Create array of dates from today to end_date
      const dateRange: string[] = [];
      const tempDate = new Date(today);

      while (tempDate <= end_date) {
        dateRange.push(tempDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
        tempDate.setDate(tempDate.getDate() + 1);
      }

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
    }

    // Step 2: Create array of dates from today to end_date
    const dateRange: string[] = [];
    const tempDate = new Date(today);

    while (tempDate <= end_date) {
      dateRange.push(tempDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      tempDate.setDate(tempDate.getDate() + 1);
    }

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
