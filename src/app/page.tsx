"use client";

import LoginOtp from "@/action/user/loginotp";
import SendOtp from "@/action/user/sendotp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleNumberChange } from "@/utils/methods";
import { user } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const firstname = useRef<HTMLInputElement>(null);
  const lastname = useRef<HTMLInputElement>(null);

  const [isOtpSent, setIsOtpSent] = useState(false);

  const [otpresponse, setOtpResponse] = useState<user>();

  const mobileNumber = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const sendOtp = async () => {
    setIsLogin(true);
    const mobile = mobileNumber.current?.value;
    if (!mobile) {
      toast.error("Please enter a valid mobile number");
      setIsLogin(false);
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Mobile number should be 10 digits long");
      setIsLogin(false);
      return;
    }
    const response = await SendOtp({ contact: mobile });
    if (!response.status) {
      toast.error(response.message);
      setIsLogin(false);
      return;
    }

    toast.success(response.message);
    setIsOtpSent(true);
    setOtpResponse(response.data!);
    setIsLogin(false);
  };

  const verifyOtp = async () => {
    setIsLogin(true);
    const mobile = mobileNumber.current?.value;
    const otp = otpRef.current?.value;
    const firstnameValue = otpresponse?.firstName ?? firstname.current?.value;
    const lastnameValue = otpresponse?.lastName ?? lastname.current?.value;

    if (!mobile) {
      toast.error("Please enter a valid mobile number");
      setIsLogin(false);
      return;
    }

    if (!otp) {
      toast.error("Please enter a valid otp");
      setIsLogin(false);
      return;
    }

    if (!firstnameValue) {
      toast.error("Please enter a valid first name");
      return setIsLogin(false);
    }

    if (!lastnameValue) {
      toast.error("Please enter a valid last name");
      return setIsLogin(false);
    }

    const response = await LoginOtp({
      contact: mobile,
      otp: otp,
      firstname: firstnameValue,
      lastname: lastnameValue,
    });

    if (!response.status) {
      toast.error(response.message);
      return setIsLogin(false);
    }

    toast.success(response.message);
    router.push("/dashboard");
    setIsLogin(false);
  };

  return (
    <>
      <div className="p-4 lg:p-10 rounded-md min-h-screen w-full bg-[#f5f6f8] flex flex-col lg:flex-row">
        <div className="flex-1 relative bg-gradient-to-tr from-[#2350f0] to-blue-400  grid place-items-center  rounded-l-md">
          <div></div>
          <div className="w-48 lg:w-[28rem] h-28  lg:h-64 relative bg-white rounded-md mt-10">
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
          {/* <div className="w-40 h-40 relative">
            <Image
              fill={true}
              src="/login.png"
              alt="error"
              className=" object-cover object-center rounded-sm drop-shadow-2xl"
            />
          </div> */}
          <div></div>
        </div>
        <div className="flex-1 grid place-items-center bg-white rounded-r-md relative">
          <div className="absolute bottom-0 left-0 w-full flex justify-between gap-2 lg:gap-4 px-4 lg:px-8 py-2 text-xs">
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
            <h1 className="text-lg font-semibold mt-6 text-center">
              Welcome to PDA,DNH
            </h1>
            <h1 className="text-sm font-normal pb-2 text-center">
              Login to access your Account
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-60 lg:w-80 mt-4">
              {isOtpSent ? (
                <>
                  {otpresponse?.firstName == null ||
                  otpresponse?.firstName == "" ||
                  otpresponse?.lastName == null ||
                  otpresponse?.lastName == "" ? (
                    <>
                      <Label htmlFor="mobile" className="text-xs">
                        Mobile Number
                      </Label>
                      <Input
                        id="mobile"
                        type="text"
                        value={otpresponse?.contactone!}
                        ref={mobileNumber}
                        disabled
                        maxLength={10}
                        className="w-full"
                        onChange={handleNumberChange}
                      />
                      <Label htmlFor="firstname" className="text-xs">
                        First Name
                      </Label>
                      <Input id="firstname" type="text" ref={firstname} />

                      <Label htmlFor="lastname" className="text-xs">
                        Last Name
                      </Label>
                      <Input id="lastname" type="text" ref={lastname} />
                    </>
                  ) : (
                    <>
                      <h1 className="text-left text-xl mb-6">
                        Hello {otpresponse?.firstName} {otpresponse?.lastName}
                      </h1>
                      <Label htmlFor="mobile" className="text-xs">
                        Mobile Number
                      </Label>
                      <div className="flex">
                        <Input
                          id="mobile"
                          type="text"
                          ref={mobileNumber}
                          value={otpresponse?.contactone!}
                          maxLength={10}
                          disabled
                          onChange={handleNumberChange}
                        />
                      </div>
                    </>
                  )}

                  <Label htmlFor="otp" className="text-xs">
                    OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    ref={otpRef}
                    maxLength={4}
                    onChange={handleNumberChange}
                  />
                  {isLogin ? (
                    <Button className="mt-4 text-center font-semibold text-white bg-[#2350f0] hover:bg-blue-600 rounded-md block py-2 w-full ">
                      Loading...
                    </Button>
                  ) : (
                    <Button
                      onClick={verifyOtp}
                      className="mt-4 text-center font-semibold text-white bg-[#2350f0] hover:bg-blue-600 rounded-md block py-2 w-full "
                    >
                      Verify OTP
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Label htmlFor="mobile" className="text-xs">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="text"
                    ref={mobileNumber}
                    maxLength={10}
                    onChange={handleNumberChange}
                  />
                  {isLogin ? (
                    <Button
                      disabled
                      className="mt-4 text-center font-semibold text-white bg-[#2350f0] hover:bg-blue-600 rounded-md block py-2 w-full "
                    >
                      Loading...
                    </Button>
                  ) : (
                    <Button
                      onClick={sendOtp}
                      className="mt-4 text-center font-semibold text-white bg-[#2350f0] hover:bg-blue-600 rounded-md block py-2 w-full "
                    >
                      Send OTP
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
