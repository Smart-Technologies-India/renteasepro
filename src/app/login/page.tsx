"use client";

import { Label } from "@/components/ui/label";
import { ApiResponseType } from "@/models/response";
import { user } from "@prisma/client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import Login from "@/action/user/login";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/schema/login";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Fa6RegularEye, Fa6RegularEyeSlash } from "@/components/icons";

export default function LoginPage() {
  const mobile = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const loginuser = async () => {
    setIsLogin(true);
    const result = safeParse(LoginSchema, {
      contactone: mobile.current?.value,
      password: password.current?.value,
    });

    if (result.success) {
      const loginrespone: ApiResponseType<user | null> = await Login({
        password: result.output.password,
        contactone: result.output.contactone,
      });
      if (loginrespone.status) {
        toast.success(loginrespone.message);
        mobile.current!.value = "";
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
      <div className="p-10 rounded-md min-h-screen w-full bg-[#f5f6f8] flex">
        <div className="flex-1 relative bg-[#2350f0] grid place-items-center  rounded-l-md">
          <div></div>
          <p className="text-white text-3xl text-center leading-relaxed">
            Welcome To
            <br />
            Planning and Development
            <br />
            Authority, DNH
          </p>
          <div className="w-80 h-60 relative">
            <Image
              fill={true}
              src="/login.png"
              alt="error"
              className="w-80 object-cover object-center h-80 rounded-sm"
            />
          </div>
          <div></div>
        </div>
        <div className="flex-1 grid place-items-center bg-white  rounded-r-md">
          <div>
            <h1 className="text-2xl font-semibold mt-6 mb-2 border-b border-gray-300 pb-2 ">
              Login
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-80">
              <Label htmlFor="mobile">Mobile : </Label>
              <input
                id="mobile"
                type="text"
                ref={mobile}
                className="border border-gray-300 grow outline-none focus:ring-0 ring-0 focus:outline-none rounded-md py-2 focus-visible:right-0 px-2"
              />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-6">
              <Label htmlFor="password">Password : </Label>
              <div>
                <div className="flex items-center gap-2 px-2 rounded border border-gray-300">
                  <input
                    id="password"
                    type={isShow ? "text" : "password"}
                    ref={password}
                    className="grow border-0 outline-none focus:ring-0 ring-0 focus:border-0 focus:outline-none rounded-md py-2 focus-visible:right-0"
                  />
                  {isShow ? (
                    <Fa6RegularEyeSlash
                      className="cursor-pointer"
                      onClick={() => {
                        setIsShow(false);
                      }}
                    />
                  ) : (
                    <Fa6RegularEye
                      className="cursor-pointer"
                      onClick={() => {
                        setIsShow(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {isLogin ? (
              <Button
                className="mt-4 text-center font-semibold text-white bg-[#2350f0] hover:bg-blue-600 rounded-md block py-2 w-full "
                disabled
              >
                Loading...
              </Button>
            ) : (
              <Button
                onClick={loginuser}
                className="mt-4 text-center font-semibold text-white bg-[#2350f0] hover:bg-blue-600 rounded-md block py-2 w-full "
              >
                Login
              </Button>
            )}

            <div className="w-full mt-6 grid place-items-center">
              <a href="/" className="text-center text-xs text-[#2350f0]">
                Login With OTP
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
