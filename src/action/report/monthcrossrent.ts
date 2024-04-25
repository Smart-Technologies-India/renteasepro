"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface monthCrossRentPayload {}

const monthCrossRent = async (
  payload: monthCrossRentPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
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
        rent: true,
        shop: {
          include: {
            property: true,
          },
        },
        user: true,
      },
    });

    // uniqe pending month rent shop with count
    let pendingmonthrentshopunique: any[] = [];

    let data = pendingmonthrentshop.map((item) => item.rentId);
    for (let i = 0; i < pendingmonthrentshop.length; i++) {
      const matchdata = pendingmonthrentshopunique.map((item) => item.rentId);

      if (!matchdata.includes(pendingmonthrentshop[i].rentId)) {
        let add_data: any = pendingmonthrentshop[i];
        add_data.count = data.filter(
          (item) => item == pendingmonthrentshop[i].rentId
        ).length;
        pendingmonthrentshopunique.push(add_data);
      }
    }


    return {
      status: true,
      data: pendingmonthrentshopunique,
      message: "Report data get successfully",
      functionname: "monthCrossRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "monthCrossRent",
    };
    return response;
  }
};

export default monthCrossRent;
