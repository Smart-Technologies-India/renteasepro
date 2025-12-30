"use client";
import GetBidProperty from "@/action/bid/getbidproperty";
import {
  FluentMdl2Search,
  FluentMdl2ViewDashboard,
  RiAuctionLine,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { encryptURLData } from "@/utils/methods";

const BidsRunning = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [properties, setProperties] = useState<any[]>([]);
  const [searchbox, setSeachBox] = useState<boolean>(false);

  const [search, setSearch] = useState<boolean>(false);

  const searchtext = useRef<HTMLInputElement>(null);
  const [searchresult, setSearchresult] = useState<any[]>([]);

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
        <RiAuctionLine className="text-xl" />
        <p className="text-xl text-gray-600">Bids</p>
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

          {searchresult.map((property, index) => (
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
        </>
      ) : (
        <>
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
        </>
      )}
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
      href={`/dashboard/bids/property/${encryptURLData(props.id.toString())}`}
      className="rounded-md my-4 bg-white w-full p-4 flex gap-2 lg:gap-4 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="hidden lg:block">{props.icon}</div>
      <div>
        <p className="text-lg font-semibold">{props.name}</p>
        <p className="text-sm text-gray-500">{props.address}</p>
      </div>
      <div className="grow"></div>
      <div>
        <p className="text-sm font-semibold w-20 text-center">Live Bids</p>
        <p className="text-lg text-gray-500 text-center">{props.livebid}</p>
      </div>
      <div className="bg-gray-300 h-10 w-[1px]" />
      <div>
        <p className="text-sm font-semibold w-16 text-center">Shops</p>
        <p className="text-lg text-gray-500 text-center">{props.totalShop}</p>
      </div>
    </Link>
  );
};
