"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllUserCategorysPayload {}

const AllUserCategorys = async (
  payload: AllUserCategorysPayload
): Promise<ApiResponseType<user_category[] | null>> => {
  try {
    const user_categorys = await prisma.user_category.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!user_categorys)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "AllUserCategorys",
      };

    return {
      status: true,
      data: user_categorys,
      message: "User Category data get successfully",
      functionname: "AllUserCategorys",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllUserCategorys",
    };
    return response;
  }
};

export default AllUserCategorys;
