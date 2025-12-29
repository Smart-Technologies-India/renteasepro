"use client";
import GetUser from "@/action/user/getuser";
import Navbar from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { useEffect, useState } from "react";
import { Role, user } from "@prisma/client";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userdata, setUpser] = useState<user>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // Get authenticated user ID from server
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error("Please login to continue");
        router.push("/login");
        return;
      }
      
      const authenticatedUserId = authResponse.data;

      const userrespone = await GetUser({ id: authenticatedUserId });
      if (userrespone.status) {
        setUpser(userrespone.data!);
      }
      setLoading(false);
    };
    init();
  }, [router]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#f5f6f8] relative">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        role={userdata?.role as Role}
      />
      <div className="relative p-0 md:pl-52 h-full">
        <Navbar
          role={userdata?.role as Role}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          name={userdata?.username ?? ""}
        ></Navbar>
        <div className="h-16"></div>
        {children}
      </div>
    </div>
  );
}
