"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { account_category } from "@prisma/client";

interface CreateAcountCategoryPayload {
  name: string;
  createdById: number;
}

const CreateAccountCategory = async (
  payload: CreateAcountCategoryPayload
): Promise<ApiResponseType<account_category | null>> => {
  try {
    const isaccount_categoryExist = await prisma.account_category.findFirst({
      where: {
        name: payload.name,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (isaccount_categoryExist)
      return {
        status: false,
        data: null,
        message: "Account Category already exist",
        functionname: "CreateAccountCategory",
      };

    const account_category = await prisma.account_category.create({
      data: {
        name: payload.name,
        createdById: payload.createdById,
      },
    });

    if (!account_category)
      return {
        status: false,
        data: null,
        message: "Account Category not created",
        functionname: "CreateAccountCategory",
      };

    return {
      status: true,
      data: account_category,
      message: "Account Category created successfully",
      functionname: "CreateAccountCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateAccountCategory",
    };
    return response;
  }
};

export default CreateAccountCategory;
