"use client";
import GetBidProperty from "@/action/bid/getbidproperty";
import {
  FluentMdl2Home,
  FluentMdl2Search,
  FluentMdl2ViewDashboard,
} from "@/components/icons";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BidsRunning = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const propertyrunningbid = await GetBidProperty({});
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
        <FluentMdl2Home className="text-xl" />
        <p className="text-xl text-gray-600">Running Bids</p>
        <div className="grow"></div>
      </div>

      <div className="w-80 bg-white border-2 border-gray-300 flex items-center rounded-full px-4 my-6">
        <FluentMdl2Search />
        <input
          className="  py-1 px-2 bg-transparent"
          placeholder="Search Properties"
        />
      </div>

      {properties.length == 0 && (
        <p className="text-sm mt-4 mb-2">No Property With Active Bid.</p>
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

export default BidsRunning;

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
      href={`/dashboard/bids/property/${props.id}`}
      className="rounded-md my-4 bg-white w-full p-4 flex gap-4 items-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      {props.icon}
      <div>
        <p className="text-lg font-semibold">{props.name}</p>
        <p className="text-sm text-gray-500">{props.address}</p>
      </div>
      <div className="grow"></div>
      <div>
        <p className="text-sm font-semibold">Live Bids</p>
        <p className="text-lg text-gray-500 text-center">{props.livebid}</p>
      </div>
      <div className="bg-gray-300 h-10 w-[1px]" />
      <div>
        <p className="text-sm font-semibold">Total Shop</p>
        <p className="text-lg text-gray-500 text-center">{props.totalShop}</p>
      </div>
      <p></p>
    </Link>
  );
};
