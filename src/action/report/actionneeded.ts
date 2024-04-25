"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid_transact } from "@prisma/client";

interface ActionNeededPayload {}

const ActionNeeded = async (
  payload: ActionNeededPayload
): Promise<ApiResponseType<bid_transact[] | null>> => {
  try {
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
        user: true,
        shop: {
          include: {
            property: true,
          },
        },
      },
    });

    let pendingmonthrentshopunique: any[] = [];

    let data = pendingbidtransact.map((item) => item.bidId);
    for (let i = 0; i < pendingbidtransact.length; i++) {
      const matchdata = pendingmonthrentshopunique.map((item) => item.bidId);

      if (!matchdata.includes(pendingbidtransact[i].bidId)) {
        let add_data: any = pendingbidtransact[i];
        add_data.count = data.filter(
          (item) => item == pendingbidtransact[i].bidId
        ).length;
        pendingmonthrentshopunique.push(add_data);
      }
    }

    return {
      status: true,
      data: pendingmonthrentshopunique,
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

export default ActionNeeded;
