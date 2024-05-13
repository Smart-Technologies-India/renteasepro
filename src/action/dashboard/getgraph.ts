"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface reponsedata {
  month: Date;
  colletedamount: number;
  totalamount: number;
}

interface getGraphPayload {}

const getGraph = async (
  payload: getGraphPayload
): Promise<ApiResponseType<reponsedata[] | null>> => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    if (currentMonth < 3) {
      currentYear -= 1; // if current month is Jan, Feb or March, then decrement year by 1
    }

    const dates: Date[] = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i + 3, 1);
      //   const year = currentMonth + i + 1 <= 11 ? currentYear : currentYear + 1; // adjust year if current month + i + 3 crosses December
      return new Date(date.setDate(date.getDate() + 1));
    });

    let resultdata: reponsedata[] = [];

    for (let i = 0; i < dates.length; i++) {
      let collectamount = 0;
      const collect = await prisma.rent_transact.findMany({
        where: {
          deletedAt: null,
          deletedBy: null,
          status: "PAID",
          transaction_date: {
            gte: dates[i],
            lt: new Date(dates[i].getFullYear(), dates[i].getMonth() + 1, 0),
          },
        },
      });

      for (let j = 0; j < collect.length; j++) {
        collectamount += collect[j].amount;
      }

      let totalamount = 0;
      const total = await prisma.rent_transact.findMany({
        where: {
          deletedAt: null,
          deletedBy: null,
          formonth: {
            gte: dates[i],
            lt: new Date(dates[i].getFullYear(), dates[i].getMonth() + 1, 0),
          },
          OR: [
            {
              status: "DUE",
            },
            {
              status: "LATE",
            },
            {
              status: "MONTHCROSS",
            },
            {
              status: "PAID",
            },
            {
              status: "INACTIVE",
            },
          ],
        },
      });

      for (let j = 0; j < total.length; j++) {
        totalamount += total[j].amount;
      }

      resultdata.push({
        month: dates[i],
        colletedamount: collectamount,
        totalamount: totalamount,
      });
    }

    return {
      status: true,
      data: resultdata,
      message: "File data get successfully",
      functionname: "getGraph",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getGraph",
    };
    return response;
  }
};

export default getGraph;
