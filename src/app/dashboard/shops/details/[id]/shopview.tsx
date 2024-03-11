"use client";

import GetBidByShop from "@/action/bid/getbidbyshop";
import TotalBidders from "@/action/bid/totalbiders";
import IsUserAppliedForBid from "@/action/bid_transact/isuserapplied";
import GetShop from "@/action/shop/getshop";
import GetUser from "@/action/user/getuser";
import {
  AntDesignCheckOutlined,
  Fa6RegularCalendarXmark,
  Fa6RegularHourglassHalf,
  MaterialSymbolsCalendarClockRounded,
} from "@/components/icons";
import { capitalcase } from "@/utils/methods";
import { RentTransactStatus, bid, shop, user } from "@prisma/client";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
interface ShowShopProps {
  id: number;
}

const ShopView = (props: ShowShopProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  interface ItemsType {
    name: string;
    status: RentTransactStatus;
  }

  const items: ItemsType[] = [
    {
      name: "January",
      status: RentTransactStatus.INACTIVE,
    },
    {
      name: "February",
      status: RentTransactStatus.INACTIVE,
    },
    {
      name: "March",
      status: RentTransactStatus.PAID,
    },
    {
      name: "April",
      status: RentTransactStatus.PAID,
    },
    {
      name: "May",
      status: RentTransactStatus.MONTHCROSS,
    },
    {
      name: "June",
      status: RentTransactStatus.MONTHCROSS,
    },
    {
      name: "July",
      status: RentTransactStatus.LATE,
    },
    {
      name: "August",
      status: RentTransactStatus.LATE,
    },
    {
      name: "September",
      status: RentTransactStatus.DUE,
    },
    {
      name: "October",
      status: RentTransactStatus.DUE,
    },
    {
      name: "November",
      status: RentTransactStatus.VERYLATE,
    },
    {
      name: "December",
      status: RentTransactStatus.VERYLATE,
    },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState<shop>();
  const [bid, setBid] = useState<any>();

  const [userApplyed, setUserApplyed] = useState<boolean>(false);

  const [user, setUser] = useState<user>();

  const [isrented, setIsRented] = useState<boolean>(false);

  const [totalBidder, setTotalBidder] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const shopresponse = await GetShop({
        id: parseInt(props.id.toString()),
      });

      if (shopresponse.status) {
        setShop(shopresponse.data!);
      }

      const bidresponse = await GetBidByShop({
        shopid: parseInt(props.id.toString()),
      });

      if (bidresponse.status) {
        setBid(bidresponse.data!);
      }

      const userresponse = await GetUser({ id: userid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const userapplied = await IsUserAppliedForBid({
        userid: userid,
        bidid: bidresponse.data?.id ?? 0,
      });

      if (userapplied.status) {
        setUserApplyed(true);
      }

      const totalbiderresponse = await TotalBidders({
        bidid: bidresponse.data?.id ?? 0,
      });
      if (totalbiderresponse.status) {
        setTotalBidder(totalbiderresponse.data!);
      }

      setIsLoading(false);
    };
    init();
  }, [props.id, userid]);

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

          {user?.role === "ADMIN" && (
            <div className="flex gap-2 p-2 mt-2">
              <div className="grow"></div>

              {bid && (
                <Link
                  href={`/dashboard/shops/shopbidhistory/${props.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
                >
                  Bid History
                </Link>
              )}
              <button className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm bg-transparent">
                Manage Shop
              </button>
              {bid ? (
                <></>
              ) : (
                <Link
                  href={`/dashboard/shops/createbid/${props.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
                >
                  Create Bid
                </Link>
              )}

              <Link
                href={`/dashboard/shops/createrent/${props.id}`}
                className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                Add Rent
              </Link>
            </div>
          )}
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

      {bid && (
        <div className="bg-white rounded-sm shadow-sm pb-4 mt-4">
          <div className="border-b border-gray-300 flex items-center pr-2">
            <p className="text-xl p-2  font-semibold">
              Bid Details -{" "}
              <span className="text-sm">
                [{bid.is_open == true ? "OPEN BID" : "CLOSE BID"}]
              </span>
            </p>
            <div className="grow"></div>

            {bid.is_open == true
              ? user?.role === "USER" && (
                  <Link
                    href={`/dashboard/bids/apply/${bid.id}`}
                    className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
                  >
                    Apply Bid
                  </Link>
                )
              : user?.role === "USER" &&
                !userApplyed && (
                  <Link
                    href={`/dashboard/bids/apply/${bid.id}`}
                    className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
                  >
                    Apply Bid
                  </Link>
                )}

            {user?.role === "USER" && !userApplyed && (
              <Link
                href={`/dashboard/bids/apply/${bid.id}`}
                className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
              >
                Apply Bid
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                href={`/dashboard/bids/biderslist/${bid?.id}`}
                className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                Running Bid History
              </Link>
            )}
          </div>
          <div className="flex">
            <div className="flex-1">
              <p className="px-2 text-sm">Title : {bid.title}</p>
              <p className="px-2 text-sm">
                Bid Start Date : {bid.bidenddate.toDateString()}
              </p>
              <p className="px-2 text-sm">
                Bid End Date : {bid.bidstartdate.toDateString()}
              </p>
              {user?.role != "USER" && (
                <p className="px-2 text-sm">Total Bidders : {totalBidder}</p>
              )}
            </div>
            <div className="flex-1">
              <p className="px-2 text-sm">
                Min Bid Amount : {bid.max_bid_amount}
              </p>
              <p className="px-2 text-sm">Fees Amount : {bid.fees_amount}</p>
              <p className="px-2 text-sm">EMD Amount : {bid.emd_amount}</p>

              {user?.role != "USER" && (
                <p className="px-2 text-sm">BG Amount : {bid.bg_amount}</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ">
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
      </div> */}

      {user?.role === "ADMIN" && (
        <div className="w-full bg-white rounded-sm shadow-sm mt-4">
          <div className="bg-white rounded-sm shadow-sm">
            <p className="text-xl p-2  font-semibold border-b border-gray-300">
              {" "}
              Rent History - 2023
            </p>

            <div className="grow grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 md:grid-cols-4 gap-2 flex-wrap justify-center items-center">
              {items.map((item, index) => (
                <PropertiesDeatils key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopView;

interface PropertiesDeatilsProps {
  name: string;
  status: RentTransactStatus;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  const Component = (): React.ReactNode => {
    switch (props.status) {
      case RentTransactStatus.INACTIVE:
        return (
          <div className="bg-gray-500 bg-opacity-10 h-7 grid place-items-center w-10 border border-gray-500 mt-1 rounded-sm"></div>
        );
      case RentTransactStatus.PAID:
        return (
          <div className="bg-green-500 bg-opacity-10 h-7 grid place-items-center w-10 border border-green-500 mt-1 rounded-sm">
            <AntDesignCheckOutlined className="text-green-500 text-xl" />
          </div>
        );

      case RentTransactStatus.DUE:
        return (
          <div className="bg-yellow-500 bg-opacity-10 h-7 grid place-items-center w-10 border border-yellow-500 mt-1 rounded-sm">
            <MaterialSymbolsCalendarClockRounded className="text-yellow-500 text-xl" />
          </div>
        );
      case RentTransactStatus.LATE:
        return (
          <div className="bg-orange-500 bg-opacity-10 h-7 grid place-items-center w-10 border border-orange-500 mt-1 rounded-sm">
            <Fa6RegularHourglassHalf className="text-orange-500 text-xl" />
          </div>
        );
      case RentTransactStatus.MONTHCROSS:
        return (
          <div className="bg-rose-500 bg-opacity-10 h-7 grid place-items-center w-10 border border-rose-500 mt-1 rounded-sm">
            <Fa6RegularCalendarXmark className="text-rose-500 text-xl" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-500 bg-opacity-10 h-7 grid place-items-center w-10 border border-gray-500 mt-1 rounded-sm"></div>
        );
    }
  };

  return (
    <div
      className={`p-2  flex flex-col  items-center justify-start px-4 py-2 min-w-28`}
    >
      <p className={`text-sm text-black`}>{props.name}</p>
      <Component />
    </div>
  );
};
