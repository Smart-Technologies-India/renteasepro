"use client";

import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import Login from "@/action/user/login";
import { LoginSchema } from "@/schema/login";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Fa6RegularEye, Fa6RegularEyeSlash } from "@/components/icons";
import Link from "next/link";
import { Input, Button, Typography, Space, InputRef } from "antd";

const { Title, Text } = Typography;

export default function LoginPage() {
  const mobile = useRef<InputRef>(null);
  const password = useRef<InputRef>(null);

  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const loginuser = async () => {
    setIsLogin(true);
    const result = safeParse(LoginSchema, {
      contactone: mobile.current?.input?.value,
      password: password.current?.input?.value,
    });

    if (result.success) {
      const loginrespone: ApiResponseType<user | null> = await Login({
        password: result.output.password,
        contactone: result.output.contactone,
      });
      if (loginrespone.status) {
        toast.success(loginrespone.message);
        if (mobile.current?.input) mobile.current.input.value = "";
        if (password.current?.input) password.current.input.value = "";
        router.push("/dashboard");
      } else {
        toast.error(loginrespone.message);
      }
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
    setIsLogin(false);
  };

  return (
    <>
      <div className="p-4 lg:p-10 rounded-md min-h-screen w-full bg-[#f5f6f8] flex flex-col lg:flex-row">
        <div className="lg:flex-1 pb-4 relative bg-gradient-to-tr from-[#2350f0] to-blue-400  grid place-items-center  rounded-l-md">
          <div></div>
          <div className="w-48 lg:w-[28rem] h-24  lg:h-64 relative bg-white rounded-md mt-10">
            <Image
              fill={true}
              src="/loginbg.png"
              alt="error"
              className=" object-cover object-center rounded-sm drop-shadow-2xl"
            />
          </div>
          <p className="text-white text-lg lg:text-3xl text-center leading-relaxed font-bold">
            Planning and Development
            <br />
            Authority, DNH
          </p>
          <div></div>
        </div>
        <div className="grow lg:flex-1 grid place-items-center bg-white  rounded-r-md relative">
          <div className="absolute bottom-0 left-0 w-full flex justify-between gap-2 lg:gap-4 px-4 lg:px-8  py-2 text-xs">
            <Link href="/tandc" className="text-gray-400 hover:text-gray-700">
              Terms and Conditions
            </Link>
            <Link
              href="/contact_about"
              className="text-gray-400 hover:text-gray-700"
            >
              Contact Us
            </Link>
            <Link
              href="/refund_policy"
              className="text-gray-400 hover:text-gray-700"
            >
              Refund Policy
            </Link>
            <Link
              href="/privacy_policy"
              className="text-gray-400 hover:text-gray-700"
            >
              Privacy Policy
            </Link>
          </div>
          <div>
            <Space orientation="vertical" size="large" className="w-full">
              <div className="text-center">
                <Title level={3} className="!mb-2">
                  Welcome to PDA,DNH
                </Title>
                <Text type="secondary">
                  Login to access your Account
                </Text>
              </div>
              <Space orientation="vertical" size="middle" className="w-80">
                <div>
                  <Text className="text-xs block mb-1">Mobile Number</Text>
                  <Input
                    ref={mobile}
                    type="text"
                    size="large"
                    placeholder="Enter mobile number"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Text className="text-xs block mb-1">Password</Text>
                  <Input.Password
                    ref={password}
                    type="password"
                    size="large"
                    placeholder="Enter password"
                    iconRender={(visible) =>
                      visible ? <Fa6RegularEyeSlash /> : <Fa6RegularEye />
                    }
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={isLogin}
                  onClick={loginuser}
                  className="!bg-[#2350f0] !hover:bg-blue-600 !mt-2"
                >
                  Login
                </Button>
                <div className="text-center mt-2">
                  <Link href="/" className="text-xs text-[#2350f0] hover:text-blue-600">
                    Login With OTP
                  </Link>
                </div>
              </Space>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
