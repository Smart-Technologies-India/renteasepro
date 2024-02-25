"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DeleteUserCategoryPayload {
  id: number;
  userId: number;
}

const DeleteUserCategory = async (
  payload: DeleteUserCategoryPayload
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
        functionname: "DeleteUserCategory",
      };

    const deleteUserCategory = await prisma.user_category.update({
      where: {
        id: payload.id,
      },
      data: {
        deletedAt: new Date(),
        deletedById: payload.userId,
      },
    });

    if (!deleteUserCategory)
      return {
        status: false,
        data: null,
        message: "User Category not deleted. Please try again.",
        functionname: "DeleteUserCategory",
      };

    return {
      status: true,
      data: user_category,
      message: "User Category deleted successfully",
      functionname: "DeleteUserCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteUserCategory",
    };
    return response;
  }
};

export default DeleteUserCategory;
