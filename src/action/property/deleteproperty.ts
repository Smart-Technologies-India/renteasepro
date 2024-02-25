"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DeletePropertyPayload {
  id: number;
  userid: number;
}

const DeleteProperty = async (
  payload: DeletePropertyPayload
): Promise<ApiResponseType<property | null>> => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!property)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "DeleteProperty",
      };

    const deletedProperty = await prisma.property.update({
      where: {
        id: payload.id,
      },
      data: {
        deletedAt: new Date(),
        deletedById: payload.userid,
      },
    });

    return {
      status: true,
      data: deletedProperty,
      message: "Property deleted successfully",
      functionname: "DeleteProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteProperty",
    };
    return response;
  }
};

export default DeleteProperty;
