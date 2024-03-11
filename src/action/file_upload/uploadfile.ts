"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { file_upload, user_category } from "@prisma/client";
import prisma from "../../../prisma/database";

interface UploadFilePayload {
  userId?: number;
  bidId?: number;
  shopId?: number;
  propertyId?: number;
  rentId?: number;
  bidTransactId?: number;
  name: string;
  path: string;
  createdById: number;
}

const UploadFile = async (
  payload: UploadFilePayload
): Promise<ApiResponseType<file_upload | null>> => {
  try {
    let data_to_insert: any = {
      name: payload.name,
      path: payload.path,
      createdById: payload.createdById,
    };

    if (payload.userId) {
      data_to_insert["userId"] = payload.userId;
    }
    if (payload.bidId) {
      data_to_insert["bidId"] = payload.bidId;
    }
    if (payload.shopId) {
      data_to_insert["shopId"] = payload.shopId;
    }
    if (payload.propertyId) {
      data_to_insert["propertyId"] = payload.propertyId;
    }
    if (payload.rentId) {
      data_to_insert["rentId"] = payload.rentId;
    }
    if (payload.bidTransactId) {
      data_to_insert["bidTransactId"] = payload.bidTransactId;
    }

    const upload_response = await prisma.file_upload.create({
      data: data_to_insert,
    });

    if (!upload_response)
      return {
        status: false,
        data: null,
        message: "User Category not created",
        functionname: "UploadFile",
      };

    return {
      status: true,
      data: upload_response,
      message: "User Category created successfully",
      functionname: "UploadFile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UploadFile",
    };
    return response;
  }
};

export default UploadFile;
