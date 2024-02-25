"use client";

import { Fa6SolidAngleLeft, Fa6SolidAngleRight } from "@/components/icons";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useState } from "react";

const Properties = () => {
  const items = [
    {
      count: "10",
      status: "Unoccupied",
    },
    {
      count: "20",
      status: "Unoccupied",
    },
    {
      count: "30",
      status: "Unoccupied",
    },
    {
      count: "40",
      status: "Unoccupied",
    },
    {
      count: "50",
      status: "Unoccupied",
    },
    {
      count: "60",
      status: "Occupied",
    },
    {
      count: "70",
      status: "Occupied",
    },
    {
      count: "80",
      status: "Occupied",
    },
    {
      count: "90",
      status: "Occupied",
    },
  ];

  // const countaccordingtoscreensize = (): number => {
  //   if (window) {
  //     if (window.innerWidth < 640) {
  //       return 2;
  //     } else if (window.innerWidth < 768) {
  //       return 3;
  //     } else if (window.innerWidth < 1024) {
  //       return 5;
  //     } else {
  //       return 6;
  //     }
  //   } else {
  //     return 6;
  //   }
  // };
  const left = () => {
    if (start > 0) {
      setStart(start - 1);
    }
  };
  const right = () => {
    if (start < items.length - 4) {
      setStart(start + 1);
    }
  };

  useGSAP(() => {});

  const [start, setStart] = useState(0);

  return (
    <div className="p-6 sm:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300 font-semibold">
            Property Details
          </p>
          <p className="px-2 text-sm">Nani Daman Fort</p>
          <p className="px-2 text-sm">Dhamatne</p>
          <p className="px-2 text-sm">Daman</p>
          <p className="px-2 text-sm">396210</p>
          <div className="flex gap-2 p-2 mt-2">
            <div className="grow"></div>
            <Link
              href={"/dashboard/shops/add"}
              className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
            >
              Add Shops
            </Link>
            <Link
              href={"/dashboard/shops/details"}
              className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
            >
              View Shops
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
      <div className="w-full bg-white rounded-sm shadow-sm mt-4">
        <div className="h-40 bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300">Inside Otla</p>

          <div className="flex p-4 gap-4">
            <div className="grid place-items-center ">
              <Fa6SolidAngleLeft className="cursor-pointer" onClick={left} />
            </div>
            <div className="grow flex gap-2 overflow-x-hidden justify-center items-center">
              {items.slice(start, start + 4).map((item, index) => (
                <PropertiesDeatils key={index} {...item} />
              ))}
            </div>

            <div className="grid place-items-center">
              <Fa6SolidAngleRight className="cursor-pointer" onClick={right} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-sm shadow-sm mt-4">
        <div className="h-40 bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300">Outside Otla</p>

          <div className="flex p-4 gap-4">
            <div className="grid place-items-center ">
              <Fa6SolidAngleLeft className="cursor-pointer" onClick={left} />
            </div>
            <div className="grow flex gap-2 overflow-x-hidden justify-center items-center">
              {items.slice(start, start + 4).map((item, index) => (
                <PropertiesDeatils key={index} {...item} />
              ))}
            </div>

            <div className="grid place-items-center">
              <Fa6SolidAngleRight className="cursor-pointer" onClick={right} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-sm shadow-sm mt-4">
        <div className="h-40 bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300">Front Shop</p>

          <div className="flex p-4 gap-4">
            <div className="grid place-items-center ">
              <Fa6SolidAngleLeft className="cursor-pointer" onClick={left} />
            </div>
            <div className="grow flex gap-2 overflow-x-hidden justify-center items-center">
              {items.slice(start, start + 4).map((item, index) => (
                <PropertiesDeatils key={index} {...item} />
              ))}
            </div>

            <div className="grid place-items-center">
              <Fa6SolidAngleRight className="cursor-pointer" onClick={right} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;

interface PropertiesDeatilsProps {
  count: string;
  status: string;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  return (
    <>
      <div className="border-2 p-2 rounded-md grid place-items-center px-4 py-2 min-w-28">
        <p className="text-xs">Shop No:</p>
        <p className="text-lg">{props.count}</p>
        <p className="text-sm">{props.status}</p>
      </div>
    </>
  );
};
