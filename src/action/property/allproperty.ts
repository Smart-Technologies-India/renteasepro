"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllPropertysPayload {}

const AllPropertys = async (
  payload: AllPropertysPayload
): Promise<ApiResponseType<property[] | null>> => {
  try {
    const allpropertys = await prisma.property.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!allpropertys)
      return {
        status: false,
        data: null,
        message: "No propertys found. Please try again.",
        functionname: "AllPropertys",
      };

    return {
      status: true,
      data: allpropertys,
      message: "Propertys data get successfully",
      functionname: "AllPropertys",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllPropertys",
    };
    return response;
  }
};

export default AllPropertys;
