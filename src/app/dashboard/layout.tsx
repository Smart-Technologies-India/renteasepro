"use client";
import GetUser from "@/action/user/getuser";
import Navbar from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Role, user } from "@prisma/client";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userdata, setUpser] = useState<user>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const init = async () => {
    setLoading(true);
    const id: number = parseInt(getCookie("id") ?? "0");

    const userrespone = await GetUser({ id: id });
    if (userrespone.status) {
      setUpser(userrespone.data!);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f5f6f8] relative">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        role={userdata?.role as Role}
      />
      <div className="relative p-0 md:pl-52">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen}></Navbar>
        {children}
      </div>
    </div>
  );
}
