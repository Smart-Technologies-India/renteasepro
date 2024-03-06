"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { use, useRef } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import Login from "@/action/user/login";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/schema/login";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const loginuser = async () => {
    const result = safeParse(LoginSchema, {
      username: username.current?.value,
      password: password.current?.value,
    });

    if (result.success) {
      const loginrespone: ApiResponseType<user | null> = await Login({
        password: result.output.password,
        username: result.output.username,
      });
      if (loginrespone.status) {
        toast.success(loginrespone.message);
        username.current!.value = "";
        password.current!.value = "";
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
        <div className="flex-1 grid place-items-center">
          <div>
            <h1 className="text-2xl font-semibold mt-6 mb-2 border-b border-gray-300 pb-2 ">
              Login
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-80">
              <Label htmlFor="username">Username : </Label>
              <Input id="username" type="text" ref={username} />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-6">
              <Label htmlFor="password">Password : </Label>
              <Input id="password" type="text" ref={password} />
            </div>
            <Button
              onClick={loginuser}
              className="mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 w-full "
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
