"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { hash } from "bcrypt";
import { Role, user } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreateUserPayload {
  username: string;
  password: string;
  role: Role;
}

const createUser = async (
  payload: CreateUserPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: payload.username, status: "ACTIVE" },
    });

    if (user)
      return {
        status: false,
        data: null,
        message: "Username already exists. Please try another username.",
        functionname: "createUsers",
      };

    const newpassword = await hash(payload.password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: payload.username,
        password: newpassword,
        role: payload.role,
      },
    });

    if (!newUser)
      return {
        status: false,
        data: null,
        message: "User not created",
        functionname: "createUser",
      };

    return {
      status: true,
      data: newUser,
      message: "User register successfully",
      functionname: "createUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "createUser",
    };
    return response;
  }
};

export default createUser;
