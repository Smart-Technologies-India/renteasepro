"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetAllUserPayload {}
const GetAllUser = async (
  payload: GetAllUserPayload
): Promise<ApiResponseType<user[] | null>> => {
  try {
    const allusers = await prisma.user.findMany({
      where: { status: "ACTIVE" },
    });

    if (!allusers)
      return {
        status: false,
        data: null,
        message: "No users found. Please try again.",
        functionname: "GetAllUser",
      };

    return {
      status: true,
      data: allusers,
      message: "Users data get successfully",
      functionname: "GetAllUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllUser",
    };
    return response;
  }
};

export default GetAllUser;
