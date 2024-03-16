"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { UserDocType, user_doc_upload } from "@prisma/client";
import prisma from "../../../prisma/database";

interface UploadFileUserPayload {
  userId: number;
  doc_type: UserDocType;
  name: string;
  path: string;
  createdById: number;
}

const UploadFileUser = async (
  payload: UploadFileUserPayload
): Promise<ApiResponseType<user_doc_upload | null>> => {
  try {
    const upload_response = await prisma.user_doc_upload.create({
      data: {
        userId: payload.userId,
        doc_type: payload.doc_type,
        name: payload.name,
        path: payload.path,
        createdById: payload.createdById,
      },
    });

    if (!upload_response)
      return {
        status: false,
        data: null,
        message: "User file upload failed.",
        functionname: "UploadFileUser",
      };

    return {
      status: true,
      data: upload_response,
      message: "User file successfully uploaded.",
      functionname: "UploadFileUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UploadFileUser",
    };
    return response;
  }
};

export default UploadFileUser;
