"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface getDashboardCountPayload {}

const getDashboardCount = async (
  payload: getDashboardCountPayload
): Promise<ApiResponseType<{ [key: string]: number } | null>> => {
  try {
    const property = await prisma.property.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });
    const shop = await prisma.shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    const bid = await prisma.bid.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "ACTIVE",
      },
    });

    const rentedshop = await prisma.shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "RENTED",
      },
    });

    const vacantshop = await prisma.shop.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "VACANT",
      },
    });

    let settledpaymentamout = 0;

    const settledpayment = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "PAID",
      },
    });
    for (let i = 0; i < settledpayment.length; i++) {
      settledpaymentamout += settledpayment[i].amount;
    }

    let currentrentamount = 0;
    const currentrent = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        status: "DUE",
      },
    });
    for (let i = 0; i < currentrent.length; i++) {
      currentrentamount += currentrent[i].amount;
    }

    let totalreceivableamount = 0;
    const totalreceivable = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        OR: [
          {
            status: "LATE",
          },
          {
            status: "MONTHCROSS",
          },
          {
            status: "DUE",
          },
        ],
      },
    });

    for (let i = 0; i < totalreceivable.length; i++) {
      totalreceivableamount += totalreceivable[i].amount;
    }

    const response = {
      totalproperty: property.length,
      totalshop: shop.length,
      livebid: bid.length,
      rentedshop: rentedshop.length,
      totalreceivable: totalreceivableamount,
      currentrent: currentrentamount,
      settledpayment: settledpaymentamout,
      vacantshop: vacantshop.length,
    };

    return {
      status: true,
      data: response,
      message: "File data get successfully",
      functionname: "DashBoardCount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getDashboardCount",
    };
    return response;
  }
};

export default getDashboardCount;
