"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { Role, user } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreateUserMobilePayload {
  username: string;
  contactone: string;
  role: Role;
}

const CreateUserMobile = async (
  payload: CreateUserMobilePayload
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
        functionname: "CreateUserMobile",
      };

    const numberexist = await prisma.user.findFirst({
      where: { contactone: payload.contactone, status: "ACTIVE" },
    });

    if (numberexist)
      return {
        status: false,
        data: null,
        message:
          "Contact number already exists. Please try another contact number.",
        functionname: "CreateUserMobile",
      };

    const newUser = await prisma.user.create({
      data: {
        username: payload.username,
        contactone: payload.contactone,
        role: payload.role,
        firstName: payload.username,
      },
    });

    if (!newUser)
      return {
        status: false,
        data: null,
        message: "User not created",
        functionname: "CreateUserMobile",
      };

    return {
      status: true,
      data: newUser,
      message: "User register successfully",
      functionname: "CreateUserMobile",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateUserMobile",
    };
    return response;
  }
};

export default CreateUserMobile;
