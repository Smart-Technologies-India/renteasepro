"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface GetUserRendedShopPayload {
  userid: number;
}

const GetUserRendedShop = async (
  payload: GetUserRendedShopPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const rent_transaction = await prisma.rent_transact.findMany({
      where: {
        userId: payload.userid,
      },
      include: {
        shop: { include: { property: true } },
      },
      distinct: ["shopId", "rentId"],
    });

    if (!rent_transaction)
      return {
        status: false,
        data: null,
        message: "No Bid transaction exist for this user id. Please try again.",
        functionname: "GetUserRendedShop",
      };

    return {
      status: true,
      data: rent_transaction,
      message: "Bid transaction get successfully",
      functionname: "GetUserRendedShop",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetUserRendedShop",
    };
    return response;
  }
};

export default GetUserRendedShop;
