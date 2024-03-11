"use client";
import GetUser from "@/action/user/getuser";
import { IcBaselineAccountCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserBidsRunning = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<user>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userrespone = await GetUser({
        id: userid,
      });
      if (userrespone.status) {
        setUser(userrespone.data!);
      }

      setLoading(false);
    };

    init();
  }, [userid]);


  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6 sm:p-10">
      <div className="flex gap-2 items-center">
        <IcBaselineAccountCircle className="text-3xl" />
        <p className="text-xl text-gray-600">User Profile</p>
        <div className="grow"></div>
        <Link
          href={"/dashboard/userprofile/edit"}
          className="rounded-md text-white py-1 px-4 bg-black"
        >
          Edit Profile
        </Link>
      </div>
      <div className="bg-white p-4 rounded-md shadow-md mt-6">
        <p className="text-gray-500 text-center">User Basic Information</p>
        <Separator />
        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Username</h1>
            <p className="text-xl">{user?.username}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Email:</h1>
            <p className="text-xl">- {user?.email}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">First Name</h1>
            <p className="text-xl">{user?.firstName}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Last Name:</h1>
            <p className="text-xl">- {user?.lastName}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Contact One</h1>
            <p className="text-xl">{user?.contactone}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Contact Two</h1>
            <p className="text-xl">- {user?.lastName}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Aadhar</h1>
            <p className="text-xl">{user?.aadhar}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Pan</h1>
            <p className="text-xl">- {user?.pan}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Address</h1>
            <p className="text-xl">{user?.address}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">City</h1>
            <p className="text-xl">- {user?.city}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Bank Name</h1>
            <p className="text-xl">{user?.bankName}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Bank Amount Number</h1>
            <p className="text-xl">- {user?.bankAccountNumber}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Ifsc Code</h1>
            <p className="text-xl">- {user?.ifscCode}</p>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default UserBidsRunning;
