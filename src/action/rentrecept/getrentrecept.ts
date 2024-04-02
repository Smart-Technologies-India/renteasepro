"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface GetRentReceptPayload {
  rentid: number;
  userid: number;
  transactionid: string;
}

const GetRentRecept = async (
  payload: GetRentReceptPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const rent_transact_response = await prisma.rent_transact.findMany({
      where: {
        status: "PAID",
        rentId: parseInt(payload.rentid.toString() ?? "0"),
        userId: parseInt(payload.userid.toString() ?? "0"),
        transactionid: payload.transactionid.toString() ?? "0",
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: { include: { property: true } },
        rent: true,
        user: true,
      },
    });

    if (!rent_transact_response)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "GetRentRecept",
      };

    return {
      status: true,
      data: rent_transact_response,
      message: "Rent Transact data get successfully",
      functionname: "GetRentRecept",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetRentRecept",
    };
    return response;
  }
};

export default GetRentRecept;
