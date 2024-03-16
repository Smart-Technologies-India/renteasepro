"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface PayRentPayload {
  rentid: number[];
}

const PayRent = async (
  payload: PayRentPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const update_response = await prisma.rent_transact.updateMany({
      where: {
        id: {
          in: payload.rentid,
        },
      },
      data: {
        status: "PAID",
        transaction_date: new Date(),
        paymentmode: "CASH",
      },
    });

    if (!update_response)
      return {
        status: false,
        data: null,
        message: "Something Want wrong unable to pay rent. Please try again.",
        functionname: "PayRent",
      };

    return {
      status: true,
      data: null,
      message: "Rent paid successfully",
      functionname: "PayRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "PayRent",
    };
    return response;
  }
};

export default PayRent;
