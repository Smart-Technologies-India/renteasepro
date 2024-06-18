"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { UserDocType, user_doc_upload } from "@prisma/client";
import prisma from "../../../prisma/database";

interface getOtherUploadFilesUserPayload {
  userId: number;
}

const getOtherUploadFilesUser = async (
  payload: getOtherUploadFilesUserPayload
): Promise<ApiResponseType<user_doc_upload[] | null>> => {
  try {
    const upload_response = await prisma.user_doc_upload.findMany({
      where: {
        userId: parseInt(payload.userId.toString() ?? "0"),
        doc_type: UserDocType.OTHER,
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
        functionname: "getOtherUploadFilesUser",
      };

    return {
      status: true,
      data: upload_response,
      message: "User file get successfully.",
      functionname: "getOtherUploadFilesUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "getOtherUploadFilesUser",
    };
    return response;
  }
};

export default getOtherUploadFilesUser;
