"use server";
interface GetDateTimePayload {}

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";

const GetDateTime = async (
  payload: GetDateTimePayload
): Promise<ApiResponseType<Date | null>> => {
  try {
    const date = new Date();
    return {
      status: true,
      data: date,
      message: "Date time get successfully",
      functionname: "GetDateTime",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDateTime",
    };
    return response;
  }
};

export default GetDateTime;
