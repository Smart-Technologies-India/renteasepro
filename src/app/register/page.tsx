"use client";

import { ApiResponseType } from "@/models/response";
import { Role, user } from "@prisma/client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import createUser from "@/action/user/createuser";
import Image from "next/image";
import { RegisterUserSchema } from "@/schema/registeruser";
import Link from "next/link";
import { Input, Button, Typography, Space, InputRef } from "antd";

const { Title, Text } = Typography;
export default function Home() {
  const username = useRef<InputRef>(null);
  const password = useRef<InputRef>(null);
  const repassword = useRef<InputRef>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onSubmit = async () => {
    setIsCreating(true);
    const result = safeParse(RegisterUserSchema, {
      username: username.current?.input?.value,
      password: password.current?.input?.value,
      repassword: repassword.current?.input?.value,
      role: "ADMIN",
    });

    if (result.success) {
      const registerrespone: ApiResponseType<user | null> = await createUser({
        password: result.output.password,
        username: result.output.username,
        role: Role.ADMIN,
      });
      if (registerrespone.status) {
        toast.success(registerrespone.message);
        if (username.current?.input) username.current.input.value = "";
        if (password.current?.input) password.current.input.value = "";
        if (repassword.current?.input) repassword.current.input.value = "";
      } else {
        toast.error(registerrespone.message);
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
    setIsCreating(false);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#f5f6f8] flex">
        <div className="flex-1 relative">
          <Image
            fill={true}
            src="/log_in_bg.png"
            alt="error"
            className="w-full object-cover object-center h-screen"
          />
        </div>
        <div className="flex-1 grid place-items-center relative">
          <div className="absolute bottom-0 left-0 w-full flex justify-between gap-4 px-8 py-2 text-xs">
            <Link href="/tandc" className="text-gray-400 hover:text-gray-700">
              Terms and Conditions
            </Link>
            <Link
              href="/contact_about"
              className="text-gray-400 hover:text-gray-700"
            >
              Contact us
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
              <div className="border-b border-gray-300 pb-4">
                <Title level={2} className="!mb-0">
                  Register
                </Title>
              </div>
              <Space orientation="vertical" size="middle" className="w-80">
                <div>
                  <Text className="text-sm block mb-1">Username</Text>
                  <Input
                    ref={username}
                    type="text"
                    size="large"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Text className="text-sm block mb-1">Password</Text>
                  <Input.Password
                    ref={password}
                    type="password"
                    size="large"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Text className="text-sm block mb-1">Re-Password</Text>
                  <Input.Password
                    ref={repassword}
                    type="password"
                    size="large"
                    placeholder="Re-enter password"
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={isCreating}
                  onClick={onSubmit}
                  className="!bg-black !hover:bg-gray-800 !mt-2"
                >
                  Register
                </Button>
              </Space>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
