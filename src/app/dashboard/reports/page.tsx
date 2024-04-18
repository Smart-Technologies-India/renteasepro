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
import { getCookie } from "cookies-next";
import GetUser from "@/action/user/getuser";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getReportCount from "@/action/report/getreportcount";

const DashboardPage = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<any>({});
  const [user, setUser] = useState<user>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const response = await getReportCount({});
      if (response.status) {
        setCount(response.data!);
      }

      const userresponse = await GetUser({ id: userid });
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
        {user?.role == "ADMIN" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <DashboardCard
                name="Total Property"
                count={count.totalproperty}
                color="bg-rose-500"
                subtitle="Total Property Count"
              >
                <Fa6RegularBuilding className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Total Shop"
                count={count.totalshop}
                color="bg-green-500"
                subtitle="Total Shop Count"
              >
                <FluentMdl2Home className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Bid Ending"
                count={count.bidlast5day}
                color="bg-orange-500"
                subtitle="Bid is Ending in 5 days"
              >
                <Fa6RegularClock className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Rent Ending"
                count={count.rentlastmonth}
                color="bg-blue-500"
                subtitle="Rent is Ending in 30 days"
              >
                <Fa6RegularClock className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Action Needed"
                count={count.bidwithnoaction}
                color="bg-teal-500"
                subtitle="Bid Count"
              >
                <Fa6RegularHourglassHalf className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Bid with no Bidders"
                count={count.bidwithnobiddercount}
                color="bg-violet-500"
                subtitle="Bid with no Bidders Count"
              >
                <RiAuctionLine className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Pending Shop Rent"
                count={count.shop_pending_rent}
                color="bg-pink-500"
                subtitle="Pending Shop Rent Count"
              >
                <RiMoneyRupeeCircleLine className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Month Cross Shop Rent"
                count={count.shop_monthly_rent}
                color="bg-cyan-500"
                subtitle="Month Cross Rent Count"
              >
                <RiMoneyRupeeCircleLine className="text-xl text-white" />
              </DashboardCard>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="bg-white min-h-96 shadow-sm rounded-md p-4">
                <h3 className="text-sm">Good Bidders</h3>
                <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
                <Table className="relative">
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="w-[100px] p-1 h-8">Id</TableHead>
                      <TableHead className="p-1 w-40 h-8">
                        Bidder Name
                      </TableHead>
                      <TableHead className="p-1 w-40 h-8">
                        Contact Number
                      </TableHead>
                      <TableHead className="w-28 text-right bg p-1 h-8">
                        Count
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-white min-h-96 shadow-sm rounded-md p-4">
                <h3 className="text-sm">Bad Bidders</h3>
                <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
                <Table className="relative">
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="w-[100px] p-1 h-8">Id</TableHead>
                      <TableHead className="p-1 w-40 h-8">
                        Bidder Name
                      </TableHead>
                      <TableHead className="p-1 w-40 h-8">
                        Contact Number
                      </TableHead>
                      <TableHead className="w-28 text-right bg p-1 h-8">
                        Count
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    <TableRow>
                      <TableCell className="font-medium p-1">1</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1">name</TableCell>
                      <TableCell className="p-1 text-right">4</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div> */}
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
