"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponseType } from "@/models/response";
import { CreateUserSchema } from "@/schema/createuser";
import { Image } from "@nextui-org/react";
import { Role, user } from "@prisma/client";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import createUser from "@/action/user/createuser";
import { Button } from "@/components/ui/button";
export default function Home() {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const repassword = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const result = safeParse(CreateUserSchema, {
      username: username.current?.value,
      password: password.current?.value,
      repassword: repassword.current?.value,
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
        username.current!.value = "";
        password.current!.value = "";
        repassword.current!.value = "";
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
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#f5f6f8] flex">
        <div className="flex-1">
          <Image
            removeWrapper
            src="/log_in_bg.png"
            alt="error"
            className="w-full object-cover object-center h-screen"
          />
        </div>
        <div className="flex-1 grid place-items-center">
          <div>
            <h1 className="text-2xl font-semibold mt-6 mb-2 border-b border-gray-300 pb-2 ">
              Register
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-80">
              <Label htmlFor="username">Username : </Label>
              <Input id="username" type="text" ref={username} />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-6">
              <Label htmlFor="password">Password : </Label>
              <Input id="password" type="text" ref={password} />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-6">
              <Label htmlFor="repassword">Re-Password : </Label>
              <Input id="repassword" type="text" ref={repassword} />
            </div>
            <Button
              onClick={onSubmit}
              className="mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 "
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
