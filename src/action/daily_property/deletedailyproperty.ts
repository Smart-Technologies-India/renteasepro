"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface DeleteDailyPropertyPayload {
  id: number;
  userid: number;
}

const DeleteDailyProperty = async (
  payload: DeleteDailyPropertyPayload
): Promise<ApiResponseType<property | null>> => {
  try {
    const property = await prisma.daily_property.findFirst({
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
        functionname: "DeleteDailyProperty",
      };

    const deletedProperty = await prisma.daily_property.update({
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
      message: "Daily Property deleted successfully",
      functionname: "DeleteDailyProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "DeleteDailyProperty",
    };
    return response;
  }
};

export default DeleteDailyProperty;
