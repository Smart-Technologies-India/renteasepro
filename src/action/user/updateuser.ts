"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { user } from "@prisma/client";

interface UpdateUserPayload {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  contactone?: string;
  contacttwo?: string;
  email?: string;
  city?: string;
  address?: string;
  aadhar?: string;
  pan?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
}

const  updateUser = async (
  payload: UpdateUserPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    let data_to_update: any = {};
    if (payload.username) data_to_update.username = payload.username;
    if (payload.firstName) data_to_update.firstName = payload.firstName;
    if (payload.lastName) data_to_update.lastName = payload.lastName;
    if (payload.contactone) data_to_update.contactone = payload.contactone;
    if (payload.contacttwo) data_to_update.contacttwo = payload.contacttwo;
    if (payload.email) data_to_update.email = payload.email;
    if (payload.city) data_to_update.city = payload.city;
    if (payload.address) data_to_update.address = payload.address;
    if (payload.aadhar) data_to_update.aadhar = payload.aadhar;
    if (payload.pan) data_to_update.pan = payload.pan;
    if (payload.bankName) data_to_update.bankName = payload.bankName;
    if (payload.bankAccountNumber)
      data_to_update.bankAccountNumber = payload.bankAccountNumber;
    if (payload.ifscCode) data_to_update.ifscCode = payload.ifscCode;

    const isemailexist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (isemailexist && isemailexist.id !== payload.id) {
      return {
        status: false,
        data: null,
        message: "Email already exist. Please try again.",
        functionname: "updateUser",
      };
    }

    const updateresponse = await prisma.user.update({
      where: {
        id: parseInt(payload.id.toString( ) ?? "0"),
      },
      data: data_to_update,
    });

    if (!updateresponse)
      return {
        status: false,
        data: null,
        message: "User update failed. Please try again.",
        functionname: "updateUser",
      };

    return {
      status: true,
      data: updateresponse,
      message: "User updated successfully",
      functionname: "updateUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "updateUser",
    };
    return response;
  }
};

export default updateUser;
