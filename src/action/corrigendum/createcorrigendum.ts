"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { corrigendum } from "@prisma/client";

interface CreateCorrigendumPayload {
  bidId?: number;
  rentId?: number;
  exemptId?: number;
  name: string;
  description: string;
  path: string;
  createdById: number;
}

const CreateCorrigendum = async (
  payload: CreateCorrigendumPayload
): Promise<ApiResponseType<corrigendum | null>> => {
  try {
    const data_to_update: any = {
      name: payload.name,
      description: payload.description,
      path: payload.path,
      createdById: payload.createdById,
    };

    if (payload.exemptId) {
      data_to_update["exemptId"] = parseInt(payload.exemptId.toString() ?? "0");
    }
    if (payload.rentId) {
      data_to_update["rentId"] = parseInt(payload.rentId.toString() ?? "0");
    }
    if (payload.bidId) {
      data_to_update["bidId"] = parseInt(payload.bidId.toString() ?? "0");
    }

    const corrigendum = await prisma.corrigendum.create({
      data: data_to_update,
    });

    if (!corrigendum)
      return {
        status: false,
        data: null,
        message: "Unable to create corrigendum. Please try again.",
        functionname: "CreateCorrigendum",
      };

    return {
      status: true,
      data: corrigendum,
      message: "Corrigendum data get successfully",
      functionname: "CreateCorrigendum",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateCorrigendum",
    };
    return response;
  }
};

export default CreateCorrigendum;
