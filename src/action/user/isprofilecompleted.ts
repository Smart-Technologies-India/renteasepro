"use server";
interface IsProfileCompletedPayload {
  id: number;
}

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import prisma from "../../../prisma/database";

const IsProfileCompleted = async (
  payload: IsProfileCompletedPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: parseInt(payload.id.toString() ?? "0"), status: "ACTIVE" },
    });

    if (!user)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "IsProfileCompleted",
      };

      // ||
      // user.pan == null ||
      // user.pan == "" ||
      // user.bankName == null ||
      // user.bankName == "" ||
      // user.bankAccountNumber == null ||
      // user.bankAccountNumber == "" ||
      // user.ifscCode == null ||
      // user.ifscCode == ""

    if (
      user.username == null ||
      user.username == "" ||
      user.firstName == null ||
      user.firstName == "" ||
      user.lastName == null ||
      user.lastName == "" ||
      user.contactone == null ||
      user.contactone == "" ||
      user.email == null ||
      user.email == "" ||
      user.aadhar == null ||
      user.aadhar == "" ||
      user.city == null ||
      user.city == "" 
    ) {
      return {
        status: false,
        data: null,
        message: "Please complete your profile first.",
        functionname: "IsProfileCompleted",
      };
    }
    return {
      status: true,
      data: user,
      message: "User data get successfully",
      functionname: "IsProfileCompleted",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "IsProfileCompleted",
    };
    return response;
  }
};

export default IsProfileCompleted;
