"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

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
              Login
            </h1>
            <div className="grid max-w-sm items-center gap-1.5 w-80">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" type="text" />
            </div>
            <div className="grid max-w-sm items-center gap-1.5 w-80 mt-6">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" type="text" />
            </div>
            <Link
              href={"/dashboard"}
              className="mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 "
            >
              Send OTP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
