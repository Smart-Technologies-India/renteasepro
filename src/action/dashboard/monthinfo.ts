"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface getMonthInfoPayload {}

const getMonthInfo = async (
  payload: getMonthInfoPayload
): Promise<ApiResponseType<{ [key: string]: number } | null>> => {
  try {
    const currentdate = new Date();
    const lastmonthdate = new Date(
      currentdate.getFullYear(),
      currentdate.getMonth() - 1,
      1
    );

    // rent transact table column transaction_date in current month and status paid

    let collectamount = 0;
    const collect = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "PAID",
        transaction_date: {
          gte: new Date(currentdate.getFullYear(), currentdate.getMonth(), 1),
          lt: new Date(
            currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            0
          ),
        },
      },
    });

    for (let i = 0; i < collect.length; i++) {
      collectamount += collect[i].amount;
    }

    let lastmonthcollectamount = 0;
    const lastmonthcollect = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "PAID",
        transaction_date: {
          gte: new Date(
            lastmonthdate.getFullYear(),
            lastmonthdate.getMonth(),
            1
          ),
          lt: new Date(
            lastmonthdate.getFullYear(),
            lastmonthdate.getMonth() + 1,
            0
          ),
        },
      },
    });

    for (let i = 0; i < lastmonthcollect.length; i++) {
      lastmonthcollectamount += lastmonthcollect[i].amount;
    }

    let pendingamount = 0;
    const pending = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        formonth: {
          gte: new Date(currentdate.getFullYear(), currentdate.getMonth(), 1),
          lt: new Date(
            currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            0
          ),
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
        ],
      },
    });

    for (let i = 0; i < pending.length; i++) {
      pendingamount += pending[i].amount;
    }

    let lastmonthpendingamount = 0;
    const lastmonthpending = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        formonth: {
          gte: new Date(
            lastmonthdate.getFullYear(),
            lastmonthdate.getMonth(),
            1
          ),
          lt: new Date(
            lastmonthdate.getFullYear(),
            lastmonthdate.getMonth() + 1,
            0
          ),
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
        ],
      },
    });

    for (let i = 0; i < lastmonthpending.length; i++) {
      lastmonthpendingamount += lastmonthpending[i].amount;
    }

    let totalamount = 0;
    const total = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        formonth: {
          gte: new Date(currentdate.getFullYear(), currentdate.getMonth(), 1),
          lt: new Date(
            currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            0
          ),
        },
      },
    });
    for (let i = 0; i < total.length; i++) {
      totalamount += total[i].amount;
    }

    let lastmonthtotalamount = 0;
    const lastmonthtotal = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        formonth: {
          gte: new Date(
            lastmonthdate.getFullYear(),
            lastmonthdate.getMonth(),
            1
          ),
          lt: new Date(
            lastmonthdate.getFullYear(),
            lastmonthdate.getMonth() + 1,
            0
          ),
        },
      },
    });

    for (let i = 0; i < lastmonthtotal.length; i++) {
      lastmonthtotalamount += lastmonthtotal[i].amount;
    }

    const response = {
      total: totalamount,
      paid: pendingamount,
      collect: collectamount,
      lastmonthtotal: lastmonthtotalamount,
      lastmonthpaid: lastmonthpendingamount,
      lastmonthcollect: lastmonthcollectamount,
    };

    return {
      status: true,
      data: response,
      message: "File data get successfully",
      functionname: "getMonthInfo",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getMonthInfo",
    };
    return response;
  }
};

export default getMonthInfo;
