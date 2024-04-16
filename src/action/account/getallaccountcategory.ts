"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { account_category, user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllAccountCategorysPayload {}

const AllAccountCategorys = async (
  payload: AllAccountCategorysPayload
): Promise<ApiResponseType<account_category[] | null>> => {
  try {
    const account_categorys = await prisma.account_category.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!account_categorys)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "AllAccountCategorys",
      };

    return {
      status: true,
      data: account_categorys,
      message: "Account Category data get successfully",
      functionname: "AllAccountCategorys",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllAccountCategorys",
    };
    return response;
  }
};

export default AllAccountCategorys;
