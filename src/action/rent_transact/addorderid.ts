"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface addOrderIdPayload {
  rentid: number[];
  orderid: string;
}

const AddOrderId = async (
  payload: addOrderIdPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const update_response = await prisma.rent_transact.updateMany({
      where: {
        id: {
          in: payload.rentid,
        },
      },
      data: {
        orderid: payload.orderid,
      },
    });

    if (!update_response)
      return {
        status: false,
        data: null,
        message: "Something Want wrong unable to pay rent. Please try again.",
        functionname: "AddOrderId",
      };

    return {
      status: true,
      data: null,
      message: "Rent paid successfully",
      functionname: "AddOrderId",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AddOrderId",
    };
    return response;
  }
};

export default AddOrderId;
