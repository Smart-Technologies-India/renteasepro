"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { UserDocType, user_doc_upload } from "@prisma/client";
import prisma from "../../../prisma/database";

interface getUploadFileUserPayload {
  userId: number;
  doc_type: UserDocType;
}

const getUploadFileUser = async (
  payload: getUploadFileUserPayload
): Promise<ApiResponseType<user_doc_upload | null>> => {
  try {
    const upload_response = await prisma.user_doc_upload.findFirst({
      where: {
        userId: parseInt(payload.userId.toString() ?? "0"),
        doc_type: payload.doc_type,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!upload_response)
      return {
        status: false,
        data: null,
        message: "Dosen't get file.",
        functionname: "getUploadFileUser",
      };

    return {
      status: true,
      data: upload_response,
      message: "User file get successfully.",
      functionname: "getUploadFileUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getUploadFileUser",
    };
    return response;
  }
};

export default getUploadFileUser;
