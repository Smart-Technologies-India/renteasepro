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

export default function Home() {
  const router = useRouter();
  const firstname = useRef<HTMLInputElement>(null);
  const lastname = useRef<HTMLInputElement>(null);

  const [isOtpSent, setIsOtpSent] = useState(false);

  const [otpresponse, setOtpResponse] = useState<user>();

  const mobileNumber = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const sendOtp = async () => {
    const mobile = mobileNumber.current?.value;
    if (!mobile) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    const response = await SendOtp({ contact: mobile });
    if (!response.status) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    setIsOtpSent(true);
    setOtpResponse(response.data!);
  };

  const verifyOtp = async () => {
    const mobile = mobileNumber.current?.value;
    const otp = otpRef.current?.value;
    const firstnameValue = otpresponse?.firstName ?? firstname.current?.value;
    const lastnameValue = otpresponse?.lastName ?? lastname.current?.value;

    if (!mobile) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    if (!otp) {
      toast.error("Please enter a valid otp");
      return;
    }

    if (!firstnameValue) {
      toast.error("Please enter a valid first name");
      return;
    }

    if (!lastnameValue) {
      toast.error("Please enter a valid last name");
      return;
    }

    const response = await LoginOtp({
      contact: mobile,
      otp: otp,
      firstname: firstnameValue,
      lastname: lastnameValue,
    });

    if (!response.status) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="p-10 rounded-md min-h-screen w-full bg-[#f5f6f8] flex">
        <div className="flex-1 w-20 relative">
          <Image
            src="/log_in_bg.png"
            alt="error"
            fill={true}
            className="w-full object-cover object-center h-screen  rounded-l-md"
          />
        </div>
        <div className="flex-1 grid place-items-center bg-white rounded-r-md">
          <div>
            <h1 className="text-2xl font-semibold mt-6 mb-2 border-b border-gray-300 pb-2 ">
              Login
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-80">
              {isOtpSent ? (
                <>
                  {otpresponse?.firstName == null ||
                  otpresponse?.firstName == "" ||
                  otpresponse?.lastName == null ||
                  otpresponse?.lastName == "" ? (
                    <>
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="text"
                        value={otpresponse?.contactone!}
                        ref={mobileNumber}
                        disabled
                        maxLength={10}
                        onChange={handleNumberChange}
                      />
                      <Label htmlFor="firstname">First Name</Label>
                      <Input id="firstname" type="text" ref={firstname} />

                      <Label htmlFor="lastname">Last Name</Label>
                      <Input id="lastname" type="text" ref={lastname} />
                    </>
                  ) : (
                    <>
                      <h1 className="text-left text-xl mb-6">
                        Hello {otpresponse?.firstName} {otpresponse?.lastName}
                      </h1>
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="text"
                        ref={mobileNumber}
                        value={otpresponse?.contactone!}
                        maxLength={10}
                        disabled
                        onChange={handleNumberChange}
                      />
                    </>
                  )}

                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    ref={otpRef}
                    maxLength={4}
                    onChange={handleNumberChange}
                  />
                  <Button
                    onClick={verifyOtp}
                    className="mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 w-full "
                  >
                    Verify OTP
                  </Button>
                </>
              ) : (
                <>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="text"
                    ref={mobileNumber}
                    maxLength={10}
                    onChange={handleNumberChange}
                  />
                  <Button
                    onClick={sendOtp}
                    className="mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 w-full "
                  >
                    Send OTP
                  </Button>
                </>
              )}
            </div>

            {/* <div className="grid max-w-sm items-center gap-1.5 w-80 mt-6">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" type="text" />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
