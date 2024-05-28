"use client";

import GetRentProperty from "@/action/rent/getrentproperty";
import {
  FluentMdl2Home,
  FluentMdl2Search,
  FluentMdl2ViewDashboard,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { property } from "@prisma/client";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const RentRunning = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const [isLoading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<boolean>(false);
  const [searchbox, setSeachBox] = useState<boolean>(false);

  const [properties, setProperties] = useState<any[]>([]);

  const searchtext = useRef<HTMLInputElement>(null);
  const [searchresult, setSearchresult] = useState<property[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const propertyrunningrent = await GetRentProperty({});
      if (propertyrunningrent.status) {
        setProperties(propertyrunningrent.data ?? []);
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
        <p className="text-xl text-gray-600">Your Properties</p>
        <div className="grow"></div>
        <Button
          onClick={() => {
            setSeachBox(!searchbox);
          }}
          className="bg-blue-500 text-white rounded-md py-2 px-3 hover:bg-blue-600"
        >
          <FluentMdl2Search />
        </Button>
      </div>

      <div className={`flex gap-4 items-center ${searchbox ? "" : "hidden"}`}>
        <div className="w-80 bg-white border-2 border-gray-300 flex items-center rounded-full px-4 my-4">
          <FluentMdl2Search />
          <Input
            className="bg-transparent focus:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 ring-offset-0 ring-0 focus:ring-0 py-1 px-2 border-none outline-none focus:outline-none focus:border-none w-full"
            placeholder="Search Properties"
            ref={searchtext}
            onChange={() => {
              if (searchtext.current) {
                if (searchtext.current.value.length > 0) {
                  setSearch(true);
                  setSearchresult(
                    properties.filter((property) =>
                      property.name
                        .toLowerCase()
                        .includes(searchtext.current?.value.toLowerCase() ?? "")
                    )
                  );
                } else {
                  setSearch(false);
                }
              }
            }}
          />
        </div>
        <div className="grow"></div>
        {search && (
          <>
            <Button
              className="bg-white hover:bg-white text-gray-500"
              onClick={() => {
                setSearch(false);
                if (searchtext.current) {
                  searchtext.current.value = "";
                }
              }}
            >
              Clear Filter
            </Button>
            <div
              className="bg-white hover:bg-white text-gray-500 rounded-md h-10 px-4 grid place-items-center"
              onClick={() => {
                setSearch(false);
                if (searchtext.current) {
                  searchtext.current.value = "";
                }
              }}
            >
              Found {searchresult.length} Result
            </div>
          </>
        )}
      </div>

      {search == true ? (
        <>
          {searchresult.length == 0 && (
            <p className="text-sm mt-4 mb-2">No search result found.</p>
          )}

          {searchresult.map((property: any, index) => (
            <CardDetails
              key={index}
              id={property.id}
              name={property.name}
              address={property.locality}
              icon={
                <FluentMdl2ViewDashboard className="text-rose-500 text-2xl w-6" />
              }
              totalShop={property.total_shops}
              liverent={property.rentcount}
            />
          ))}
        </>
      ) : (
        <>
          {properties.length == 0 && (
            <p className="text-sm mt-4 mb-2">No Property with active rent.</p>
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
              liverent={property.rentcount}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default RentRunning;

interface CardDetailsProps {
  id: number;
  icon: React.ReactNode;
  name: string;
  address: string;
  totalShop: number;
  liverent: number;
}

const CardDetails = (props: CardDetailsProps) => {
  return (
    <Link
      href={`/dashboard/rents/property/${props.id}`}
      className="rounded-md my-4 bg-white w-full p-4 flex gap-4 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {props.icon}
      <div>
        <p className="text-lg font-semibold">{props.name}</p>
        <p className="text-sm text-gray-500">{props.address}</p>
      </div>
      <div className="grow"></div>
      <div>
        <p className="text-sm font-semibold">Occupied</p>
        <p className="text-lg text-gray-500 text-center">{props.liverent}</p>
      </div>
      <div className="bg-gray-300 h-10 w-[1px]" />
      <div>
        <p className="text-sm font-semibold">Unoccupied</p>
        <p className="text-lg text-gray-500 text-center">
          {props.totalShop - props.liverent}
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
