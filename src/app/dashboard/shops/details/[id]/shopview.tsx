"use client";

import GetBidByShop from "@/action/bid/getbidbyshop";
import IsWinnderDeclared from "@/action/bid/iswinnerdeclared";
import TotalBidders from "@/action/bid/totalbiders";
import IsUserAppliedForBid from "@/action/bid_transact/isuserapplied";
import GetRent from "@/action/rent/getrent";
import GetUserRent from "@/action/rent_transact/getuserrent";

import isShopRented from "@/action/rent/isrentcreateonshop";
import GetFromShop from "@/action/rent_transact/getfromshop";
import GetShop from "@/action/shop/getshop";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";
import {
  AntDesignCheckOutlined,
  Fa6RegularCalendarXmark,
  Fa6RegularHourglassHalf,
  MaterialSymbolsCalendarClockRounded,
} from "@/components/icons";
import { capitalcase, formatDateTime, formateDate } from "@/utils/methods";
import {
  RentTransactStatus,
  rent,
  rent_transact,
  shop,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ShowShopProps {
  id: number;
}

const ShopView = (props: ShowShopProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();

  interface ItemsType {
    name: string;
    status: RentTransactStatus;
  }

  interface yearsDetails {
    year: number;
    rentdetails: ItemsType[];
  }

  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState<shop>();
  const [bid, setBid] = useState<any>();

  const [userApplyed, setUserApplyed] = useState<boolean>(false);

  const [user, setUser] = useState<user>();

  const [totalBidder, setTotalBidder] = useState<number>(0);

  const [isrented, setIsRented] = useState<boolean>(false);

  const [rentdata, setRentData] = useState<rent>();

  const [rentdetails, setRentDetails] = useState<yearsDetails[]>([]);

  const [isWinnerDeclared, setIsWinnerDeclared] = useState<boolean>(false);

  const [rentTransact, setRentTransact] = useState<rent_transact[]>([]);

  useEffect(() => {
    const setRentMonthDetails = (value: any[]) => {
      const years: number[] = value.map((item) => item.formonth.getFullYear());
      const uniqueyears = years.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      const currentYear = new Date().getFullYear(); // Get the current year

      const monthdetails: yearsDetails[] = uniqueyears.map((year) => {
        const rentdetails = [];
        for (let i = 0; i < 12; i++) {
          const monthDate = new Date(year, i, 1);
          const monthStatus = value.find(
            (item) =>
              item.formonth.getFullYear() === year &&
              item.formonth.getMonth() === i
          );
          const isActive =
            (year === currentYear && i <= new Date().getMonth()) ||
            year < currentYear; // Determine if month should be active or inactive
          rentdetails.push({
            name: monthDate.toLocaleString("default", { month: "long" }),
            status: monthStatus ? monthStatus.status : "INACTIVE", // Set status based on existence in value array
            isActive: isActive,
          });
        }

        return {
          year: year,
          rentdetails: rentdetails,
        };
      });

      setRentDetails(monthdetails);
    };
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

      const isshoprented = await isShopRented({
        id: props.id,
      });

      if (isshoprented.status) {
        setIsRented(isshoprented.data!);
      }

      if (isshoprented.data) {
        const rentresponse = await GetFromShop({
          shopid: props.id,
        });

        if (rentresponse.status) {
          const getrentresponse = await GetRent({
            id: rentresponse.data![0].rentId,
          });

          if (getrentresponse.status) {
            setRentData(getrentresponse.data!);
          }
        }

        const rentTransactresponse = await GetUserRent({
          rentid: rentresponse.data![0].rentId,
        });

        if (rentTransactresponse.status) {
          setRentTransact(rentTransactresponse.data as rent_transact[]);
        }

        if (rentresponse.status) {
          setRentMonthDetails(rentresponse.data ?? []);
        }
      }

      const isWinnerDeclaredResponse = await IsWinnderDeclared({
        bidid: bidresponse.data?.id ?? 0,
      });

      if (isWinnerDeclaredResponse.status) {
        setIsWinnerDeclared(isWinnerDeclaredResponse.data!);
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
    <div className="p-6">
      <div className="flex gap-4 items-center mb-4">
        <BackButton />
        <h1 className="text-[#162f57] text-2xl font-semibold">Shop Details</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="bg-white rounded-sm shadow-sm">
          <p className="text-xl p-2 border-b border-gray-300 font-semibold">
            Details
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
              {isrented && (
                <button
                  onClick={() => {
                    return router.push(`/dashboard/rents/edit/${rentdata?.id}`);
                  }}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm bg-transparent"
                >
                  Manage Shop
                </button>
              )}
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
          <div className="border-b border-gray-300 flex items-center pr-2 gap-2">
            <p className="text-xl p-2  font-semibold">
              Bid Details -
              <span className="text-sm">
                [{bid.is_auction == true ? "Auction Bid" : "Tender Bid"}]
              </span>
            </p>
            <div className="grow"></div>

            {isWinnerDeclared && (
              <h1 className="border-green-500 border-2 rounded text-green-500 bg-green-500 bg-opacity-10  px-2 py-1 text-sm">
                Winner Declared
              </h1>
            )}

            {bid.bidenddate < new Date() ? (
              <h1 className="border-rose-500 border-2 rounded text-rose-500 bg-rose-500 bg-opacity-10  px-2 py-1 text-sm">
                Bid Ended
              </h1>
            ) : isWinnerDeclared ? (
              <></>
            ) : user?.role === "USER" ? (
              bid.is_auction == true ? (
                <Link
                  href={`/dashboard/bids/apply/${bid.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
                >
                  Apply Bid
                </Link>
              ) : userApplyed ? (
                <></>
              ) : (
                <Link
                  href={`/dashboard/bids/apply/${bid.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 py-1 text-sm"
                >
                  Apply Bid
                </Link>
              )
            ) : (
              <></>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Link
                  href={`/dashboard/bids/userbidinfo/${bid?.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  View Bid Details
                </Link>
                <Link
                  href={`/dashboard/bids/biderslist/${bid?.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Running Bid History
                </Link>
              </>
            )}
          </div>
          <div className="flex">
            <div className="flex-1">
              <p className="px-2 text-sm">Title : {bid.title}</p>
              <p className="px-2 text-sm">
                Bid Start Date : {bid.bidstartdate.toDateString()}
              </p>
              <p className="px-2 text-sm">
                Bid End Date : {bid.bidenddate.toDateString()}
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

      {isrented && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ">
          <div className="bg-white rounded-sm shadow-sm pb-4">
            <p className="text-xl p-2 border-b border-gray-300 font-semibold">
              Tenant Details
            </p>
            <p className="px-2 text-sm">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="px-2 text-sm">{user?.contactone}</p>
          </div>
          <div className="bg-white rounded-sm shadow-sm pb-4">
            <div className="border-b border-gray-300 flex items-center pr-2">
              <p className="text-xl p-2  font-semibold">Rent Details</p>
              <div className="grow"></div>
              {user?.role! === "ADMIN" && (
                <Link
                  href={`/dashboard/userrent/history/${rentdata?.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Rent History
                </Link>
              )}
              {user?.role! === "USER" && (
                <Link
                  href={`/dashboard/userrent/details/${rentdata?.id}`}
                  className="text-blue-500 border-blue-500 border-2 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Pay Rent
                </Link>
              )}
            </div>
            <p className="px-2 text-sm">{}</p>
            <p className="px-2 text-sm">
              Start Date & Time :
              {formateDate(new Date(rentdata?.rent_start_date ?? ""))}
            </p>
            <p className="px-2 text-sm">
              End Date & Time :
              {formateDate(new Date(rentdata?.rent_end_date ?? ""))}
            </p>
            <p className="px-2 text-sm">
              Rent Amount : {rentdata?.rent_amount}
            </p>
            <p className="px-2 text-sm">
              Pending Amount :
              {rentTransact.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.amount,
                0
              )}{" "}
              - ({rentTransact.length} Months)
            </p>
          </div>
        </div>
      )}

      {isrented &&
        rentdetails.map((item, index) => (
          <div
            key={index}
            className="w-full bg-white rounded-sm shadow-sm mt-4"
          >
            <div className="bg-white rounded-sm shadow-sm">
              <p className="text-xl p-2  font-semibold border-b border-gray-300">
                Rent History - {item.year}
              </p>

              <div className="grow grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 md:grid-cols-4 gap-2 flex-wrap justify-center items-center">
                {item.rentdetails.map((item, index) => (
                  <PropertiesDeatils key={index} {...item} />
                ))}
              </div>
            </div>
          </div>
        ))}
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
