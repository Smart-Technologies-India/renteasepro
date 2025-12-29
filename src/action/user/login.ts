"use server";
interface LoginPayload {
  contactone: string;
  password: string;
}

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import prisma from "../../../prisma/database";
import { generateToken } from "@/lib/jwt";

const Login = async (
  payload: LoginPayload
): Promise<ApiResponseType<user | null>> => {
  try {
    const cookiesStore = await cookies();
    const user = await prisma.user.findFirst({
      where: { contactone: payload.contactone, status: "ACTIVE" },
    });

    if (!user)
      return {
        status: false,
        data: null,
        message: "Invalid Credentials. Please try again.",
        functionname: "Login",
      };

    if (!user.password)
      return {
        status: false,
        data: null,
        message: "Invalid Credentials. Please try again.",
        functionname: "Login",
      };

    const password = await compare(payload.password, user.password!);
    if (!password)
      return {
        status: false,
        data: null,
        message: "Invalid Credentials. Please try again.",
        functionname: "Login",
      };

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
      data: user,
      message: "Login successful",
      functionname: "Login",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "Login",
    };
    return response;
  }
};

export default Login;
