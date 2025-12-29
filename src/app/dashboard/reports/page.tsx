"use client";
import {
  Fa6RegularBuilding,
  Fa6RegularClock,
  Fa6RegularHourglassHalf,
  FluentMdl2Home,
  RiAuctionLine,
  RiMoneyRupeeCircleLine,
} from "@/components/icons";
import { useEffect, useState } from "react";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import GetUser from "@/action/user/getuser";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";

import getReportCount from "@/action/report/getreportcount";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [userid, setUserid] = useState<number>(0);
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<any>({});
  const [user, setUser] = useState<user>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);

      const response = await getReportCount({});
      if (response.status) {
        setCount(response.data!);
      }

      const userresponse = await GetUser({ id: authResponse.data });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      if (userresponse.data?.role == "USER") {
        router.push("/dashboard/userproperties");
      }
      setLoading(false);
    };
    init();
  }, [userid, router]);

  // get current year
  const currentDate = new Date();

  // get current month and year
  const currentMonth = currentDate.getMonth(); // 0-indexed
  let currentYear = currentDate.getFullYear();

  if (currentMonth < 3) {
    currentYear -= 1; // if current month is Jan, Feb or March, then decrement year by 1
  }

  // generate label using current year; label should start from April and end with March
  const label = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i + 3, 1); // adding 3 to start from April
    const year = currentMonth + i + 1 <= 11 ? currentYear : currentYear + 1; // adjust year if current month + i + 3 crosses December
    return month.toLocaleString("en-US", { month: "short" }) + "-" + year;
  });

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-100">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6">
        {["ADMIN", "DYCOLLECTOR", "ACCOUNTANT", "MANAGER"].includes(
          user?.role ?? "USER"
        ) && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/properties");
                }}
              >
                <DashboardCard
                  name="Total Property"
                  count={count.totalproperty}
                  color="bg-rose-500"
                  subtitle="Total Property Count"
                >
                  <Fa6RegularBuilding className="text-xl text-white" />
                </DashboardCard>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/properties");
                }}
              >
                <DashboardCard
                  name="Total Shop"
                  count={count.totalshop}
                  color="bg-green-500"
                  subtitle="Total Shop Count"
                >
                  <FluentMdl2Home className="text-xl text-white" />
                </DashboardCard>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/reports/bidending");
                }}
              >
                <DashboardCard
                  name="Bid Ending"
                  count={count.bidlast5day}
                  color="bg-orange-500"
                  subtitle="Bid is Ending in 5 days"
                >
                  <Fa6RegularClock className="text-xl text-white" />
                </DashboardCard>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/reports/rentending/");
                }}
              >
                <DashboardCard
                  name="Rent Ending"
                  count={count.rentlastmonth}
                  color="bg-blue-500"
                  subtitle="Rent is Ending in 30 days"
                >
                  <Fa6RegularClock className="text-xl text-white" />
                </DashboardCard>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/reports/actionneeded");
                }}
              >
                <DashboardCard
                  name="Action Needed"
                  count={count.bidwithnoaction}
                  color="bg-teal-500"
                  subtitle="Bid Count"
                >
                  <Fa6RegularHourglassHalf className="text-xl text-white" />
                </DashboardCard>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/reports/bidwithnobidder");
                }}
              >
                <DashboardCard
                  name="Bid with no Bidders"
                  count={count.bidwithnobiddercount}
                  color="bg-violet-500"
                  subtitle="Bid with no Bidders Count"
                >
                  <RiAuctionLine className="text-xl text-white" />
                </DashboardCard>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/reports/pendingshoprent");
                }}
              >
                <DashboardCard
                  name="Pending Shop Rent"
                  count={count.shop_pending_rent}
                  color="bg-pink-500"
                  subtitle="Pending Shop Rent Count"
                >
                  <RiMoneyRupeeCircleLine className="text-xl text-white" />
                </DashboardCard>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push("/dashboard/reports/monthcrossrent");
                }}
              >
                <DashboardCard
                  name="Month Cross Shop Rent"
                  count={count.shop_monthly_rent}
                  color="bg-cyan-500"
                  subtitle="Month Cross Rent Count"
                >
                  <RiMoneyRupeeCircleLine className="text-xl text-white" />
                </DashboardCard>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;

interface DashboardCardProps {
  name: string;
  count: string;
  color: string;
  subtitle: string;
  children?: React.ReactNode;
  isruppy?: boolean;
}

const DashboardCard = (props: DashboardCardProps) => {
  return (
    <div className="bg-white shadow-sm rounded-md">
      <h1 className="text-sm text-gray-500 p-1 px-2">{props.name}</h1>
      <div className="w-full h-[1px] bg-gray-200"></div>
      <div className="flex gap-2 items-center px-2">
        <div className="grid place-items-start my-2">
          {props.isruppy ? (
            <p className="text-xl text-gray-600">&#8377;{props.count}</p>
          ) : (
            <p className="text-xl text-gray-600">{props.count}</p>
          )}
          <span className="text-xs text-gray-400">{props.subtitle}</span>
        </div>
        <div className="grow"></div>
        <div>
          <div
            className={`rounded-full p-2 h-10 w-10 grid place-items-center ${props.color}`}
          >
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
