"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";

interface GetPandingRentShopByUserIdPayload {
  userid: number;
}

const GetPandingRentShopByUserId = async (
  payload: GetPandingRentShopByUserIdPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const rent_transaction = await prisma.rent_transact.findMany({
      where: {
        userId: payload.userid,
        deletedAt: null,
        deletedBy: null,
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
      include: {
        shop: {
          include: {
            property: true,
            rent: {
              include: {
                rent_transact: true,
              },
            },
          },
        },
      },
      distinct: ["shopId", "rentId"],
    });

    if (!rent_transaction)
      return {
        status: false,
        data: null,
        message: "No Rent Data Found for This User. Please try again.",
        functionname: "GetPandingRentShopByUserId",
      };

    return {
      status: true,
      data: rent_transaction,
      message: "Rent data get successfully",
      functionname: "GetPandingRentShopByUserId",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetPandingRentShopByUserId",
    };
    return response;
  }
};

export default GetPandingRentShopByUserId;
