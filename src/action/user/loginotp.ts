"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { cookies } from "next/headers";
import prisma from "../../../prisma/database";
import { generateToken } from "@/lib/jwt";

interface LoginOtpPayload {
  contact: string;
  otp: string;
  firstname: string;
  lastname: string;
}

const LoginOtp = async (
  payload: LoginOtpPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const cookiesStore = await cookies();
    const user = await prisma.user.findFirst({
      where: { contactone: payload.contact, status: "ACTIVE" },
    });

    if (!user)
      return {
        status: false,
        data: null,
        message: "Wrong Mobile Number. Please try again.",
        functionname: "Login",
      };

    if (user.otp !== payload.otp) {
      return {
        status: false,
        data: null,
        message: "Invalid OTP. Please try again.",
        functionname: "LoginOtp",
      };
    }

    const user_resut = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: payload.firstname,
        firstName: payload.firstname,
        lastName: payload.lastname,
      },
    });

    if (!user_resut) {
      return {
        status: false,
        data: null,
        message: "Unable to update user. Please try again.",
        functionname: "LoginOtp",
      };
    }

    // Generate secure JWT token
    const token = generateToken({
      userId: user.id,
      contactone: user.contactone ?? "",
      role: user.role,
    });

    // Set httpOnly secure cookie
    cookiesStore.set("auth_token", token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      status: true,
      data: user_resut,
      message: "Login successful",
      functionname: "LoginOtp",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "LoginOtp",
    };
    return response;
  }
};

export default LoginOtp;
