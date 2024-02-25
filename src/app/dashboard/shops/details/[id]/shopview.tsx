"use client";

import GetShop from "@/action/shop/getshop";
import { AntDesignCheckOutlined } from "@/components/icons";
import { capitalcase } from "@/utils/methods";
import { shop } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
interface ShowShopProps {
  id: number;
}

const ShopView = (props: ShowShopProps) => {
  const items = [
    {
      name: "January",
      status: true,
    },
    {
      name: "February",
      status: true,
    },
    {
      name: "March",
      status: true,
    },
    {
      name: "April",
      status: true,
    },
    {
      name: "May",
      status: true,
    },
    {
      name: "June",
      status: true,
    },
    {
      name: "July",
      status: true,
    },
    {
      name: "August",
      status: true,
    },
    {
      name: "September",
      status: false,
    },
    {
      name: "October",
      status: false,
    },
    {
      name: "November",
      status: false,
    },
    {
      name: "December",
      status: false,
    },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState<shop>();
  const init = async () => {
    setIsLoading(true);

    const shopresponse = await GetShop({
      id: parseInt(props.id.toString()),
    });

    if (shopresponse.status) {
      setShop(shopresponse.data!);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300 font-semibold">
            Shops Details
          </p>
          <p className="px-2 text-sm">Shop Number : {shop?.shopNumber}</p>
          <p className="px-2 text-sm">Shop Size : {shop?.shopSize}</p>
          <p className="px-2 text-sm">
            Shop Floor : {capitalcase(shop?.floor.toString() ?? "")}
          </p>
          {shop?.meterno && (
            <p className="px-2 text-sm">Meter Number : {shop?.meterno}</p>
          )}
          <div className="flex gap-2 p-2 mt-2">
            <div className="grow"></div>
            <button className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm">
              Manage Shop
            </button>
            <Link
              href={"/dashboard/shops/createbid"}
              className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
            >
              Create Bid
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-sm shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.712992782698!2d73.00302414832767!3d20.270734449556546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cb42b635e293%3A0x3f857d55206a66f5!2sOffice%20Of%20District%20Collector!5e0!3m2!1sen!2sin!4v1708165544653!5m2!1sen!2sin"
            width="400"
            height="300"
            loading="lazy"
            className="border-0 w-full h-full rounded-sm"
          ></iframe>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ">
        <div className="bg-white rounded-sm shadow-sm pb-4">
          <p className="text-xl p-2 border-b border-gray-300 font-semibold">
            Tenant Details
          </p>
          <p className="px-2 text-sm">Pramila Kataria</p>
          <p className="px-2 text-sm">9904194114</p>
          <p className="px-2 text-sm">203000</p>
          <p className="px-2 text-sm">Pending</p>
        </div>
        <div className="bg-white rounded-sm shadow-sm pb-4">
          <div className="border-b border-gray-300 flex items-center pr-2">
            <p className="text-xl p-2  font-semibold">Rent Details</p>
            <div className="grow"></div>
            <Link
              href={"/dashboard/shops/createrent"}
              className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
            >
              Add Rent
            </Link>
          </div>
          <p className="px-2 text-sm">Ashutosh Shandilya</p>
          <p className="px-2 text-sm">6203159107</p>
          <p className="px-2 text-sm">21000</p>
          <p className="px-2 text-sm">Pending</p>
        </div>
      </div>

      <div className="w-full bg-white rounded-sm shadow-sm mt-4">
        <div className="bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300">
            Rent History - 2022
          </p>

          <div className="grow grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 md:grid-cols-4 gap-2 flex-wrap justify-center items-center">
            {items.map((item, index) => (
              <PropertiesDeatils key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopView;

interface PropertiesDeatilsProps {
  name: string;
  status: boolean;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  return (
    <>
      <div
        className={`p-2  flex flex-col  items-center justify-start px-4 py-2 min-w-28`}
      >
        <p className={`text-sm text-black`}>{props.name}</p>
        <div
          className={`text-sm h-7  mx-auto rounded-md mt-2 py-1 grid place-items-center w-10 border ${
            props.status
              ? "border-green-500 bg-green-500 bg-opacity-10"
              : "border-gray-100 bg-gray-100"
          }`}
        >
          {props.status && (
            <AntDesignCheckOutlined className="text-green-500 text-xl" />
          )}
        </div>
      </div>
    </>
  );
};
