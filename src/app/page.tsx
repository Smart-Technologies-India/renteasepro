"use client";

import LoginOtp from "@/action/user/loginotp";
import SendOtp from "@/action/user/sendotp";
import { handleNumberChange } from "@/utils/methods";
import { user } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Input, Button, Typography, Card, Space, InputRef } from "antd";

const { Title, Text } = Typography;

export default function Home() {
  const router = useRouter();
  const firstname = useRef<InputRef>(null);
  const lastname = useRef<InputRef>(null);

  const [isOtpSent, setIsOtpSent] = useState(false);

  const [otpresponse, setOtpResponse] = useState<user>();

  const mobileNumber = useRef<InputRef>(null);
  const otpRef = useRef<InputRef>(null);

  const [isLogin, setIsLogin] = useState<boolean>(false);

  const sendOtp = async () => {
    setIsLogin(true);
    const mobile = mobileNumber.current?.input?.value;
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
    const mobile = otpresponse?.contactone || mobileNumber.current?.input?.value;
    const otp = otpRef.current?.input?.value;
    const firstnameValue = otpresponse?.firstName ?? firstname.current?.input?.value;
    const lastnameValue = otpresponse?.lastName ?? lastname.current?.input?.value;
    console.log({ mobile, otp, firstnameValue, lastnameValue });

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
        <div className="lg:flex-1 pb-4 lg:pb-0 relative bg-gradient-to-tr from-[#2350f0] to-blue-400  grid place-items-center  rounded-l-md">
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
        <div className="grow lg:flex-1 grid place-items-center bg-white rounded-r-md relative">
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
            <Space orientation="vertical" size="large" className="w-full">
              <div className="text-center">
                <Title level={3} className="!mb-2">
                  Welcome to PDA,DNH
                </Title>
                <Text type="secondary">
                  Login to access your Account
                </Text>
              </div>
              <Space orientation="vertical" size="middle" className="w-60 lg:w-80">
                {isOtpSent ? (
                  <>
                    {otpresponse?.firstName == null ||
                    otpresponse?.firstName == "" ||
                    otpresponse?.lastName == null ||
                    otpresponse?.lastName == "" ? (
                      <>
                        <div>
                          <Text className="text-xs block mb-1">
                            Mobile Number
                          </Text>
                          <Input
                            type="text"
                            value={otpresponse?.contactone!}
                            disabled
                            maxLength={10}
                            size="large"
                            placeholder="Enter mobile number"
                          />
                        </div>
                        <div>
                          <Text className="text-xs block mb-1">
                            First Name
                          </Text>
                          <Input
                            ref={firstname}
                            type="text"
                            size="large"
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Text className="text-xs block mb-1">
                            Last Name
                          </Text>
                          <Input
                            ref={lastname}
                            type="text"
                            size="large"
                            placeholder="Enter last name"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <Title level={4} className="!mb-4">
                          Hello {otpresponse?.firstName} {otpresponse?.lastName}
                        </Title>
                        <div>
                          <Text className="text-xs block mb-1">
                            Mobile Number
                          </Text>
                          <Input
                            type="text"
                            value={otpresponse?.contactone!}
                            maxLength={10}
                            disabled
                            size="large"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Text className="text-xs block mb-1">OTP</Text>
                      <Input
                        ref={otpRef}
                        type="text"
                        maxLength={4}
                        size="large"
                        placeholder="Enter OTP"
                        
                        onChange={(e) => {
                          const value = e.target.value;
                          if (otpRef.current?.input) {
                            otpRef.current.input.value = value.replace(/\D/g, "");
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      block
                      loading={isLogin}
                      onClick={verifyOtp}
                      className="!bg-[#2350f0] !hover:bg-blue-600 !mt-2"
                    >
                      Verify OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Text className="text-xs block mb-1">
                        Mobile Number
                      </Text>
                      <Input
                        ref={mobileNumber}
                        type="text"
                        maxLength={10}
                        size="large"
                        placeholder="Enter mobile number"
                        onChange={(e) => {
                          const value = e.target.value;

                          if (mobileNumber.current?.input) {
                            mobileNumber.current.input.value = value.replace(/\D/g, "");
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      block
                      loading={isLogin}
                      onClick={sendOtp}
                      className="!bg-[#2350f0] !hover:bg-blue-600 !mt-2"
                    >
                      Send OTP
                    </Button>
                  </>
                )}
              </Space>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
