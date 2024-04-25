"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Status, account_receipt, user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetAccountPayload {
  id: number;
}

const GetAccount = async (
  payload: GetAccountPayload
): Promise<ApiResponseType<account_receipt | null>> => {
  try {
    const account_receipt = await prisma.account_receipt.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        account_category_one: true,
        account_category_two: true,
        account_category_three: true,
      },
    });

    if (!account_receipt)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetAccount",
      };

    return {
      status: true,
      data: account_receipt,
      message: "User Account data get successfully",
      functionname: "GetAccount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAccount",
    };
    return response;
  }
};

export default GetAccount;
