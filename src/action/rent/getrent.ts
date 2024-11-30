"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { rent, rent_transact, shop, user } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetRentPayload {
  id: number;
}

const GetRent = async (
  payload: GetRentPayload
): Promise<
  ApiResponseType<
    (rent & { shop: shop; user: user; rent_transact: rent_transact[] }) | null
  >
> => {
  try {
    const rent_respone = await prisma.rent.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
        user: true,
        rent_transact: true,
      },
    });

    if (!rent_respone)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetRent",
      };

    return {
      status: true,
      data: rent_respone,
      message: "Rent data get successfully",
      functionname: "GetRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRent",
    };
    return response;
  }
};

export default GetRent;
