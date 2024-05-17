"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { account_receipt } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllAccountPayload {}

const AllAccount = async (
  payload: AllAccountPayload
): Promise<ApiResponseType<account_receipt[] | null>> => {
  try {
    const account_receipts = await prisma.account_receipt.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        account_category_one: true,
        account_category_three: true,
        account_category_two: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!account_receipts)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "AllAccount",
      };

    return {
      status: true,
      data: account_receipts,
      message: "Account receipts data get successfully",
      functionname: "AllAccount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllAccount",
    };
    return response;
  }
};

export default AllAccount;
