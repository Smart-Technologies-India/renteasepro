"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface pendingShopRentPayload {}

const pendingShopRent = async (
  payload: pendingShopRentPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
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
        rent: true,
        shop: {
          include: {
            property: true,
          },
        },
        user: true,
      },
    });

    let pendingmonthrentshopunique: any[] = [];

    let data = pendingrentshop.map((item) => item.rentId);
    for (let i = 0; i < pendingrentshop.length; i++) {
      const matchdata = pendingmonthrentshopunique.map((item) => item.rentId);

      if (!matchdata.includes(pendingrentshop[i].rentId)) {
        let add_data: any = pendingrentshop[i];
        add_data.count = data.filter(
          (item) => item == pendingrentshop[i].rentId
        ).length;
        pendingmonthrentshopunique.push(add_data);
      }
    }

    return {
      status: true,
      data: pendingmonthrentshopunique,
      message: "Report data get successfully",
      functionname: "pendingShopRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "pendingShopRent",
    };
    return response;
  }
};

export default pendingShopRent;
