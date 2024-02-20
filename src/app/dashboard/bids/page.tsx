import {
  FluentMdl2Home,
  FluentMdl2Search,
  FluentMdl2ViewDashboard,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, Tab, Input } from "@nextui-org/react";
import Link from "next/link";

const properties = () => {
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
      <div className="mt-4 flex">
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
      </div>
      <div className="w-80 bg-white border-2 border-gray-300 flex items-center rounded-full px-4 my-6">
        <FluentMdl2Search />
        <input
          className="  py-1 px-2 bg-transparent"
          placeholder="Search Properties"
        />
      </div>
      <CardDetails
        name="Nani Daman Fort"
        address="Dhamatne"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={10}
      />
      <CardDetails
        name="Sulpadh"
        address="Nani Daman Fort"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={20}
      />
      <CardDetails
        name="Valsad"
        address="Nani Daman Fort"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={30}
      />
      <CardDetails
        name="Valsad"
        address="Nani Daman Fort"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={30}
      />
      <CardDetails
        name="Valsad"
        address="Nani Daman Fort"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={30}
      />
      <CardDetails
        name="Valsad"
        address="Nani Daman Fort"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={30}
      />
      <CardDetails
        name="Valsad"
        address="Nani Daman Fort"
        icon={
          <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
        }
        totalShop={30}
      />
    </div>
  );
};

export default properties;

interface CardDetailsProps {
  icon: React.ReactNode;
  name: string;
  address: string;
  totalShop: number;
}

const CardDetails = (props: CardDetailsProps) => {
  return (
    <Link
      href={"/dashboard/properties/details"}
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
        <p className="text-lg text-gray-500 text-center">
          {props.totalShop / 2}
        </p>
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
