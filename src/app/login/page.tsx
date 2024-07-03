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
import Link from "next/link";
import { handleNumberChange } from "@/utils/methods";
import { Input } from "@/components/ui/input";

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
            <h1 className="text-lg font-semibold mt-2 lg:mt-6 text-center">
              Welcome to PDA,DNH
            </h1>
            <h1 className="text-sm font-normal pb-2 text-center">
              Login to access your Account
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-4">
              <Label htmlFor="mobile" className="text-xs">
                Mobile{" "}
              </Label>

              <input
                id="mobile"
                type="text"
                ref={mobile}
                className="border border-gray-300 grow outline-none focus:ring-0 ring-0 focus:outline-none rounded-md py-2 focus-visible:right-0 px-2 bg-transparent fill-none appearance-none"
              />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-2 lg:mt-6">
              <Label htmlFor="password" className="text-xs">
                Password{" "}
              </Label>
              <div>
                <div className="flex items-center gap-2 px-2 rounded border border-gray-300 bg-[#e8f0fe]">
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

            <div className="flex w-full mt-2 lg:mt-6 items-center gap-4 justify-center">
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
