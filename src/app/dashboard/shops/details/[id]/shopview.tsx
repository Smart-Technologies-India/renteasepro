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

import { capitalcase, formatDateTime, formateDate } from "@/utils/methods";
import {
  BidStatus,
  RentTransactStatus,
  rent_transact,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AntDesignCheckOutlined,
  CarbonSoftwareResourceResource,
  CarbonWarningSquare,
  Fa6RegularCalendarXmark,
  Fa6RegularHourglassHalf,
  MaterialSymbolsCalendarClockRounded,
  MaterialSymbolsDoNotDisturbOnOutline,
} from "@/components/icons";

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
  const [shop, setShop] = useState<any>();
  const [bid, setBid] = useState<any>();

  const [userApplyed, setUserApplyed] = useState<boolean>(false);

  const [user, setUser] = useState<user>();

  const [totalBidder, setTotalBidder] = useState<number>(0);

  const [isrented, setIsRented] = useState<boolean>(false);

  const [rentdata, setRentData] = useState<any>();

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
            status: monthStatus ? monthStatus.status : "NONE",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="flex gap-2 border-b border-gray-300 py-2 px-4">
            <BackButton />
            <p className="text-xl  font-semibold">Shop Details</p>
            <div className="grow"></div>
            {["ADMIN", "MANAGER", "ACCOUNTANT"].includes(user?.role!) && (
              <>
                {bid ? (
                  <>
                    {bid.bid_status == BidStatus.EXPIRED ? (
                      <>
                        <Link
                          href={`/dashboard/shops/createbid/${props.id}`}
                          className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                        >
                          Create Bid
                        </Link>
                      </>
                    ) : (
                      <>
                        {bid && (
                          <Link
                            href={`/dashboard/shops/shopbidhistory/${props.id}`}
                            className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                          >
                            Bid History
                          </Link>
                        )}
                        {isrented && (
                          <button
                            onClick={() => {
                              return router.push(
                                `/dashboard/rents/edit/${rentdata?.id}`
                              );
                            }}
                            className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                          >
                            Manage Shop
                          </button>
                        )}
                        {bid ? (
                          <></>
                        ) : (
                          <Link
                            href={`/dashboard/shops/createbid/${props.id}`}
                            className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                          >
                            Create Bid
                          </Link>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/shops/createbid/${props.id}`}
                      className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                    >
                      Create Bid
                    </Link>
                  </>
                )}

                {!isrented && (
                  <Link
                    href={`/dashboard/shops/createrent/${props.id}`}
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  >
                    Add Rent
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="px-4 py-2 grid grid-cols-2 gap-4 mt-2">
            <p className="text-xs leading-3">
              Propery Name <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.property.name}
              </span>
            </p>
            <p className="text-xs leading-3">
              Shop Category Name <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.shop_category.name}
              </span>
            </p>

            <p className="text-xs leading-3">
              Shop Number <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.shopNumber}
              </span>
            </p>
            <p className="text-xs leading-3">
              Shop Size <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.shopSize}
              </span>
            </p>

            <p className="text-xs leading-3">
              Shop Floor <br />
              <span className="text-sm text-gray-500 font-medium">
                {capitalcase(shop?.floor.toString() ?? "")}
              </span>
            </p>

            <p className="text-xs leading-3">
              Meter Number <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.meterno ?? "N/A"}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-sm shadow-sm">
          <iframe
            // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.712992782698!2d73.00302414832767!3d20.270734449556546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cb42b635e293%3A0x3f857d55206a66f5!2sOffice%20Of%20District%20Collector!5e0!3m2!1sen!2sin!4v1708165544653!5m2!1sen!2sin"
            src={`https://maps.google.com/maps?q=${shop.property?.latitude},${shop.property?.longitude}&output=embed`}
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
            <p className="text-xl p-2  font-semibold">Bid Details</p>
            <div className="grow"></div>

            {bid.bidstartdate > new Date() ? (
              <></>
            ) : bid.bidenddate < new Date() ? (
              <></>
            ) : isWinnerDeclared ? (
              <></>
            ) : user?.role === "USER" ? (
              bid.is_auction == true ? (
                <Link
                  href={`/dashboard/bids/apply/${bid.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Apply Bid
                </Link>
              ) : userApplyed ? (
                <></>
              ) : (
                <Link
                  href={`/dashboard/bids/apply/${bid.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Apply Bid
                </Link>
              )
            ) : (
              <></>
            )}

            {["ADMIN", "MANAGER", "ACCOUNTANT"].includes(user?.role!) && (
              <>
                <Link
                  href={`/dashboard/bids/userbidinfo/${bid?.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  View Bid Details
                </Link>
                <Link
                  href={`/dashboard/bids/biderslist/${bid?.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Running Bid History
                </Link>
              </>
            )}
          </div>
          <div className="px-4 pt-2 grid grid-cols-4 gap-4 mt-2">
            <p className="text-xs leading-3">
              Title <br />
              <span className="text-sm text-gray-500 font-medium">
                {shop?.property.name}
              </span>
            </p>
            <p className="text-xs leading-3">
              Bid Start Date <br />
              <span className="text-sm text-gray-500 font-medium">
                {formatDateTime(new Date(bid.bidstartdate))}
              </span>
            </p>

            <p className="text-xs leading-3">
              Bid End Date <br />
              <span className="text-sm text-gray-500 font-medium">
                {formatDateTime(new Date(bid.bidenddate))}
              </span>
            </p>

            {user?.role != "USER" && (
              <p className="text-xs leading-3">
                Total Bidders <br />
                <span className="text-sm text-gray-500 font-medium">
                  {totalBidder}
                </span>
              </p>
            )}

            <p className="text-xs leading-3">
              Min Bid Amount <br />
              <span className="text-sm text-gray-500 font-medium">
                &#8377;{bid.max_bid_amount}
              </span>
            </p>

            <p className="text-xs leading-3">
              Fees Amount <br />
              <span className="text-sm text-gray-500 font-medium">
                &#8377;{bid.fees_amount}
              </span>
            </p>

            <p className="text-xs leading-3">
              EMD Amount <br />
              <span className="text-sm text-gray-500 font-medium">
                &#8377;{bid.emd_amount}
              </span>
            </p>

            <p className="text-xs leading-3">
              BG Amount <br />
              <span className="text-sm text-gray-500 font-medium">
                &#8377;{bid.bg_amount}
              </span>
            </p>

            <p className="text-xs leading-3">
              Bid Type <br />
              <span className="text-sm text-gray-500 font-medium">
                {bid.is_auction == true ? "Auction Bid" : "Tender Bid"}
              </span>
            </p>

            {user?.role != "USER" && (
              <p className="text-xs leading-3">
                Bid Status <br />
                <span className="text-sm text-gray-500 font-medium">
                  {bid.bid_status}
                </span>
              </p>
            )}
            {user?.role != "USER" && (
              <p className="text-xs leading-3">
                Winner Status <br />
                <span className="text-sm text-gray-500 font-medium">
                  {isWinnerDeclared ? "Declared" : "Not Declared"}
                </span>
              </p>
            )}
            {user?.role != "USER" && (
              <p className="text-xs leading-3">
                Bid Ended <br />
                <span className="text-sm text-gray-500 font-medium">
                  {bid.bidenddate < new Date() ? "Ended" : "Running"}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {isrented && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ">
          <div className="bg-white rounded-sm shadow-sm pb-4">
            <p className="text-xl p-2 border-b border-gray-300 font-semibold">
              Tenant Details
            </p>

            <div className="px-4 py-2 grid grid-cols-2 gap-4 mt-2">
              <p className="text-xs leading-3">
                Tenant Name <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rentdata!.user.firstName} {rentdata!.user?.lastName}
                </span>
              </p>
              <p className="text-xs leading-3">
                Tenant Number <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rentdata!.user?.contactone}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm pb-4">
            <div className="border-b border-gray-300 flex items-center pr-2">
              <p className="text-xl p-2  font-semibold">Rent Details</p>
              <div className="grow"></div>
              {["ADMIN", "MANAGER", "ACCOUNTANT"].includes(user?.role!) && (
                <Link
                  href={`/dashboard/userrent/history/${rentdata?.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Rent History
                </Link>
              )}
              {user?.role! === "USER" && (
                <Link
                  href={`/dashboard/userrent/details/${rentdata?.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  Pay Rent
                </Link>
              )}
            </div>
            <div className="px-4 py-2 grid grid-cols-2 gap-4 mt-2">
              <p className="text-xs leading-3">
                Start Date & Time <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rentdata?.rent_start_date ?? ""))}
                </span>
              </p>
              <p className="text-xs leading-3">
                End Date & Time <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rentdata?.rent_end_date ?? ""))}
                </span>
              </p>
              <p className="text-xs leading-3">
                Rent Amount <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rentdata?.rent_amount}
                </span>
              </p>
              <p className="text-xs leading-3">
                Pending Amount <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rentTransact.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.amount,
                    0
                  )}
                  - ({rentTransact.length} Months)
                </span>
              </p>
            </div>
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

              <div className="grow grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 md:grid-cols-4 gap-2 flex-wrap justify-center items-center p-2">
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
  const textname = (): string => {
    switch (props.status) {
      case RentTransactStatus.INACTIVE:
        return "No Due";

      case RentTransactStatus.PAID:
        return "Paid";

      case RentTransactStatus.DUE:
        return "Due";

      case RentTransactStatus.LATE:
        return "Late";

      case RentTransactStatus.MONTHCROSS:
        return "Month Cross";

      default:
        return "Vacant";
    }
  };

  const Component = (): React.ReactNode => {
    switch (props.status) {
      case RentTransactStatus.INACTIVE:
        return (
          <div className="bg-indigo-200 grid place-items-center border border-gray-200 rounded-full w-8 h-8">
            <CarbonWarningSquare className="text-indigo-500 text-lg" />
          </div>
        );

      case RentTransactStatus.PAID:
        return (
          <div className="bg-green-200 grid place-items-center border border-gray-200 rounded-full w-8 h-8">
            <AntDesignCheckOutlined className="text-green-500 text-lg" />
          </div>
        );

      case RentTransactStatus.DUE:
        return (
          <div className="bg-yellow-200 grid place-items-center border border-gray-200 rounded-full w-8 h-8">
            <MaterialSymbolsCalendarClockRounded className="text-yellow-500 text-lg" />
          </div>
        );
      case RentTransactStatus.LATE:
        return (
          <div className="bg-orange-200 grid place-items-center border border-orange-400 rounded-full w-8 h-8">
            <Fa6RegularHourglassHalf className="text-orange-500 text-lg" />
          </div>
        );

      case RentTransactStatus.MONTHCROSS:
        return (
          <div className="bg-rose-200 grid place-items-center border border-gray-200 rounded-full w-8 h-8">
            <Fa6RegularCalendarXmark className="text-rose-500 text-lg" />
          </div>
        );

      default:
        return (
          <div className="bg-rose-200 grid place-items-center border border-gray-200 rounded-full w-8 h-8">
            <MaterialSymbolsDoNotDisturbOnOutline className="text-rose-500 text-lg" />
          </div>
        );
    }
  };

  return (
    <div
      className={`p-1 flex items-center justify-start min-w-28 bg-[#F5F5F5] rounded-md gap-2`}
    >
      <Component />
      <div>
        <p className={`text-xs text-black`}>{props.name}</p>
        <p className={`text-xs text-gray-500`}>{textname()}</p>
      </div>
    </div>
  );
};
