"use server";
interface GetNormalUserPayload {}

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import prisma from "../../../prisma/database";

const GetNormalUser = async (
  payload: GetNormalUserPayload
): Promise<ApiResponseType<user[] | null>> => {
  try {
    const user = await prisma.user.findMany({
      where: { status: "ACTIVE", role: "USER" },
    });

    if (!user)
      return {
        status: false,
        data: null,
        message: "No User Exist. Please try again.",
        functionname: "GetNormalUser",
      };

    return {
      status: true,
      data: user,
      message: "User data get successfully",
      functionname: "GetNormalUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetNormalUser",
    };
    return response;
  }
};

export default GetNormalUser;
