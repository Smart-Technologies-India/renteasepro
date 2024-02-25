"use client";
import AllPropertys from "@/action/property/allproperty";
import {
  FluentMdl2Home,
  FluentMdl2Search,
  FluentMdl2ViewDashboard,
} from "@/components/icons";
import { property } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Properties = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<property[]>([]);
  const init = async () => {
    setIsLoading(true);
    const propertyresponse = await AllPropertys({});
    if (propertyresponse.status) {
      setProperties(propertyresponse.data ?? []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6 sm:p-10">
      <div className="flex gap-4 items-center">
        <FluentMdl2Home className="text-xl" />
        <p className="text-xl text-gray-600">Your Properties</p>
        <div className="grow"></div>
        <Link
          href={"/dashboard/properties/add"}
          className="bg-blue-500 text-white rounded-md py-2 px-4"
        >
          Add New Property
        </Link>
      </div>
      {/* <div className="mt-4 flex">
        <p className="border-b-2 border-blue-500 px-4 py-2 text-sm font-medium">
          All
        </p>
        <p className="border-b-2 border-gray-300 px-4  py-2 text-sm font-medium">
          Rent Overdue
        </p>
        <p className="border-b-2 border-gray-300 px-4  py-2 text-sm font-medium">
          Rent Due Soon
        </p>
        <p className="border-b-2 border-gray-300 px-4  py-2 text-sm font-medium">
          Rent Due Later
        </p>
        <p className="border-b-2 border-gray-300 px-4  py-2 text-sm font-medium">
          Vacant
        </p>
        <p className="border-b-2 border-gray-300 px-4  py-2 text-sm font-medium">
          Multi-Unit
        </p>
        <p className="border-b-2 border-gray-300 px-4 grow"></p>
      </div> */}
      <div className="w-80 bg-white border-2 border-gray-300 flex items-center rounded-full px-4 my-4">
        <FluentMdl2Search />
        <input
          className="  py-1 px-2 bg-transparent"
          placeholder="Search Properties"
        />
      </div>

      {properties.length == 0 && (
        <p className="text-sm mt-4 mb-2">No Property created yet.</p>
      )}

      {properties.map((property, index) => (
        <CardDetails
          key={index}
          id={property.id}
          name={property.name}
          address={property.locality}
          icon={
            <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
          }
          totalShop={property.total_shops}
        />
      ))}
    </div>
  );
};

export default Properties;

interface CardDetailsProps {
  id: number;
  icon: React.ReactNode;
  name: string;
  address: string;
  totalShop: number;
}

const CardDetails = (props: CardDetailsProps) => {
  return (
    <Link
      href={`/dashboard/properties/details/${props.id}`}
      className="rounded-md my-4 bg-white w-full p-4 flex gap-4 items-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      {props.icon}
      <div>
        <p className="text-lg font-semibold">{props.name}</p>
        <p className="text-sm text-gray-500">{props.address}</p>
      </div>
      <div className="grow"></div>
      <div>
        <p className="text-sm font-semibold">Total Shop</p>
        <p className="text-lg text-gray-500 text-center">{props.totalShop}</p>
      </div>
      <p></p>
    </Link>
  );
};
