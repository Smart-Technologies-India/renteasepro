"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Status, user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetUserCategoryPayload {
  id: number;
}

const GetUserCategory = async (
  payload: GetUserCategoryPayload
): Promise<ApiResponseType<user_category | null>> => {
  try {
    const user_category = await prisma.user_category.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!user_category)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetUserCategory",
      };

    return {
      status: true,
      data: user_category,
      message: "User Category data get successfully",
      functionname: "GetUserCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetUserCategory",
    };
    return response;
  }
};

export default GetUserCategory;
