"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreateUserCategoryPayload {
  name: string;
  createdById: number;
}

const CreateUserCategory = async (
  payload: CreateUserCategoryPayload
): Promise<ApiResponseType<user_category | null>> => {
  try {
    const isuser_categoryExist = await prisma.user_category.findFirst({
      where: {
        name: payload.name,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (isuser_categoryExist)
      return {
        status: false,
        data: null,
        message: "User Category already exist",
        functionname: "CreateUserCategory",
      };

    const user_category = await prisma.user_category.create({
      data: {
        name: payload.name,
        createdById: payload.createdById,
      },
    });

    if (!user_category)
      return {
        status: false,
        data: null,
        message: "User Category not created",
        functionname: "CreateUserCategory",
      };

    return {
      status: true,
      data: user_category,
      message: "User Category created successfully",
      functionname: "CreateUserCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateUserCategory",
    };
    return response;
  }
};

export default CreateUserCategory;
