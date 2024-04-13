"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface getDashboardCountPayload {}

const getReportCount = async (
  payload: getDashboardCountPayload
): Promise<ApiResponseType<{ [key: string]: number | any[] } | null>> => {
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

    const bidwithnobidders = await prisma.bid.findMany({
      include: {
        bid_transact: true,
      },
    });
    const bidwithnobiddercount = bidwithnobidders.filter(
      (item) => item.bid_transact.length == 0
    );

    const pendingbidtransact = await prisma.bid_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        OR: [
          {
            status: "PENDING",
          },
          {
            status: "USERNOTINTERESTED",
          },
          {
            status: "INACTIVE",
          },
        ],
      },
      include: {
        bid: true,
      },
    });

    let pendingbidtransactunique: any[] = [];
    for (let i = 0; i < pendingbidtransact.length; i++) {
      if (!pendingbidtransactunique.includes(pendingbidtransact[i].bidId)) {
        pendingbidtransactunique.push(pendingbidtransact[i].bidId);
      }
    }

    const pendingrentshop = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        OR: [
          {
            status: "DUE",
          },
          {
            status: "LATE",
          },
        ],
      },
      include: {
        shop: true,
      },
    });

    //    get all unqiue shop
    let unqiueshops: any[] = [];
    for (let i = 0; i < pendingrentshop.length; i++) {
      if (!unqiueshops.includes(pendingrentshop[i].shopId)) {
        unqiueshops.push(pendingrentshop[i].shopId);
      }
    }

    const pendingmonthrentshop = await prisma.rent_transact.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
        OR: [
          {
            status: "MONTHCROSS",
          },
        ],
      },
      include: {
        shop: true,
      },
    });

    //    get all unqiue shop
    let unqiueshopsmonth: any[] = [];
    for (let i = 0; i < pendingmonthrentshop.length; i++) {
      if (!unqiueshopsmonth.includes(pendingmonthrentshop[i].shopId)) {
        unqiueshopsmonth.push(pendingmonthrentshop[i].shopId);
      }
    }

    const currentdate = new Date();

    // currentdate - 5 day
    const next5day = new Date(currentdate.setDate(currentdate.getDate() + 5));

    const monthcurrentdate = new Date();

    const getnextmonth = new Date(
      monthcurrentdate.setDate(monthcurrentdate.getDate() + 30)
    );

    // get all the bid which is in between last 5 days and current date
    const bidlast5day = await prisma.bid.findMany({
      where: {
        bidenddate: {
          gte: new Date(),
          lte: next5day,
        },
      },
    });

    const rentlastmonth = await prisma.rent.findMany({
      where: {
        rent_end_date: {
          gte: new Date(),
          lte: getnextmonth,
        },
      },
    });

    const response = {
      totalproperty: property.length,
      totalshop: shop.length,
      bidwithnobiddercount: bidwithnobiddercount.length,
      bidwithnoaction: pendingbidtransactunique.length,
      shop_pending_rent: unqiueshops.length,
      shop_monthly_rent: unqiueshopsmonth.length,
      bidlast5day: bidlast5day.length,
      rentlastmonth: rentlastmonth.length,
      goodbidders: [],
      badbidders: [],
    };

    return {
      status: true,
      data: response,
      message: "Report data get successfully",
      functionname: "getReportCount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getReportCount",
    };
    return response;
  }
};

export default getReportCount;
