"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { corrigendum } from "@prisma/client";

interface GetCorrigendumPayload {
  id: number;
}

const GetCorrigendum = async (
  payload: GetCorrigendumPayload
): Promise<ApiResponseType<corrigendum | null>> => {
  try {
    
    const corrigendum = await prisma.corrigendum.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!corrigendum)
      return {
        status: false,
        data: null,
        message: "Unable to get corrigendum. Please try again.",
        functionname: "GetCorrigendum",
      };

    return {
      status: true,
      data: corrigendum,
      message: "Corrigendum data get successfully",
      functionname: "GetCorrigendum",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetCorrigendum",
    };
    return response;
  }
};

export default GetCorrigendum;
