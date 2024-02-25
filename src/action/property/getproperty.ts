"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Status, property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetPropertyPayload {
  id: number;
}

const GetProperty = async (
  payload: GetPropertyPayload
): Promise<ApiResponseType<property | null>> => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        shop: true,
      },
    });

    if (!property)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetProperty",
      };

    return {
      status: true,
      data: property,
      message: "Property data get successfully",
      functionname: "GetProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetProperty",
    };
    return response;
  }
};

export default GetProperty;
