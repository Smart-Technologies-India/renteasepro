"use client";
import GetBidProperty from "@/action/bid/getbidproperty";
import GetLiveBid from "@/action/bid/getlivebid";
import IsProfileCompleted from "@/action/user/isprofilecompleted";
import {
  FluentMdl2Home,
  FluentMdl2Search,
  FluentMdl2ViewDashboard,
  MdiReceiptTextClock,
  RiAuctionLine,
} from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { toast } from "react-toastify";
import { encryptURLData } from "@/utils/methods";

const UserBidsRunning = () => {
  const [userid, setUserid] = useState<number>(0);
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push('/login');
      }
      setUserid(authResponse.data);

      const isprofilecompleted = await IsProfileCompleted({
        id: authResponse.data,
      });

      if (!isprofilecompleted.status) {
        return router.push("/dashboard/userprofile/edit");
      }

      const propertyrunningbid = await GetLiveBid({});
      if (propertyrunningbid.status) {
        setProperties(propertyrunningbid.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center">
        <RiAuctionLine className="text-xl" />
        <p className="text-xl text-gray-600">Live Bids</p>
        <div className="grow"></div>

        <div className="w-80 bg-white border-2 border-gray-300 flex items-center rounded-full px-4">
          <FluentMdl2Search />
          <input
            className="  py-1 px-2 bg-transparent"
            placeholder="Search Properties"
          />
        </div>
      </div>

      {properties.length == 0 && (
        <p className="text-sm mt-4 mb-2">No Bid history found.</p>
      )}

      {properties.map((property: any, index) => (
        <CardDetails
          key={index}
          id={property.id}
          name={property.name}
          address={property.locality}
          icon={
            <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
          }
          totalShop={property.total_shops}
          livebid={property.bidcount}
        />
      ))}
    </div>
  );
};

export default UserBidsRunning;

interface CardDetailsProps {
  id: number;
  icon: React.ReactNode;
  name: string;
  address: string;
  totalShop: number;
  livebid: number;
}

const CardDetails = (props: CardDetailsProps) => {
  return (
    <Link
      href={`/dashboard/userbids/property/${encryptURLData(props.id.toString())}`}
      className="rounded-md my-4 bg-white w-full p-4 flex gap-1 lg:gap-4 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="hidden lg:block">{props.icon}</div>
      <div>
        <p className="text-lg font-semibold">{props.name}</p>
        <p className="text-sm text-gray-500">{props.address}</p>
      </div>
      <div className="lg:grow"></div>
      <div>
        <p className="text-sm font-semibold text-center w-16">Live Bids</p>
        <p className="text-lg text-gray-500 text-center">{props.livebid}</p>
      </div>
      <div className="bg-gray-300 h-10 w-[1px]" />
      <div>
        <p className="text-sm font-semibold text-center w-20">Total Shop</p>
        <p className="text-lg text-gray-500 text-center">{props.totalShop}</p>
      </div>
    </Link>
  );
};
