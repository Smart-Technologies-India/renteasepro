"use client";
import getDashboardCount from "@/action/dashboard/count";
import {
  Fa6RegularBuilding,
  Fa6RegularHourglassHalf,
  FluentMdl2Home,
  IcOutlineReceiptLong,
  MaterialSymbolsPersonRounded,
  RiAuctionLine,
  RiMoneyRupeeCircleLine,
} from "@/components/icons";
import { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import ProgressBar from "@ramonak/react-progress-bar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import numberWithIndianFormat from "@/utils/methods";
import getMonthInfo from "@/action/dashboard/monthinfo";
import getGraph from "@/action/dashboard/getgraph";
import { getCookie } from "cookies-next";
import GetUser from "@/action/user/getuser";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { is } from "valibot";

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);
ChartJS.register(...registerables);

const DashboardPage = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  function isPositive(number: number) {
    if (number > 0) {
      return true;
    } else {
      return false;
    }
  }

  const [isLoading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<any>({});
  const [monthinfo, setMonthinfo] = useState<any>({});
  const [graphData, setGraphData] = useState<any[]>([]);

  const currentmonthname = new Date().toLocaleString("default", {
    month: "long",
  });

  const [user, setUser] = useState<user>();

  const getpercentage = (currentamount: number, lastamount: number) => {
    let dev = ((currentamount - lastamount) / lastamount) * 100;
    return Math.round(dev);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const response = await getDashboardCount({});
      if (response.status) {
        setCount(response.data!);
      }
      const monthdatarespone = await getMonthInfo({});
      if (monthdatarespone.status) {
        setMonthinfo(monthdatarespone.data!);
      }

      const graphresponse = await getGraph({});
      if (graphresponse.status) {
        setGraphData(graphresponse.data!);
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

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        barThickness: 10,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        ticks: {
          font: {
            size: 12,
          },
          precision: 0,
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    indexAxis: "x",
    elements: {
      bar: {
        borderWidth: 2,
        categorySpacing: 0,
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#1e293b",
        font: {
          size: 10,
        },
        formatter: function (value: any) {
          return value;
        },
      },

      labels: {
        color: "white",
      },
      title: {
        display: false,
      },
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

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

  const dataset: any = {
    labels: label,
    datasets: [
      {
        label: "Receivable",
        data: graphData.map((item: any) => item.totalamount),
        backgroundColor: "#95acbe",
        borderWidth: 0,
      },
      {
        label: "Received",
        data: graphData.map((item: any) => item.colletedamount),
        backgroundColor: "#31363f",
        borderWidth: 0,
      },
    ],
  };

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
                name="Live Bids"
                count={count.livebid}
                color="bg-orange-500"
                subtitle="Live Bids Count"
              >
                <RiAuctionLine className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Rented shop"
                count={count.rentedshop}
                color="bg-blue-500"
                subtitle="Rented Shop Count"
              >
                <MaterialSymbolsPersonRounded className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Total Receivable"
                count={numberWithIndianFormat(count.totalreceivable)}
                color="bg-teal-500"
                subtitle="Total Receivable Amount"
                isruppy={true}
              >
                <RiMoneyRupeeCircleLine className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Current rent"
                count={numberWithIndianFormat(count.currentrent)}
                color="bg-violet-500"
                subtitle="Pending Rent Count"
                isruppy={true}
              >
                <RiMoneyRupeeCircleLine className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Settled Rent"
                count={numberWithIndianFormat(count.settledpayment)}
                color="bg-pink-500"
                subtitle="Settled Rent Count"
                isruppy={true}
              >
                <IcOutlineReceiptLong className="text-xl text-white" />
              </DashboardCard>
              <DashboardCard
                name="Vacant Shop"
                count={count.vacantshop}
                color="bg-cyan-500"
                subtitle="Vacant Shop Count"
              >
                <Fa6RegularHourglassHalf className="text-xl text-white" />
              </DashboardCard>
            </div>
            <div className="grid grid-cols-6 gap-2 mt-2">
              <div className="bg-white h-80 shadow-sm rounded-md p-4 col-span-4">
                <Bar options={options} data={dataset} />
              </div>
              <div className="bg-white h-80 shadow-sm rounded-md p-4 col-span-2 flex flex-col">
                <h1>Current Month Rent Information</h1>
                <Separator className="shrink-0" />
                <div className="grow"></div>
                <h1 className="text-2xl text-gray-500">
                  {numberWithIndianFormat(monthinfo.total)}
                </h1>
                <div className="flex gap-2 text-gray-500 text-xs">
                  <p>Receivable In {currentmonthname}</p>
                  <div className="grow"></div>
                  <p>
                    {isNaN(
                      getpercentage(monthinfo.total, monthinfo.lastmonthtotal)
                    )
                      ? 0
                      : getpercentage(
                          monthinfo.total,
                          monthinfo.lastmonthtotal
                        )}
                  </p>
                </div>
                <ProgressBar
                  className="my-2"
                  completed={Math.abs(
                    isNaN(
                      getpercentage(monthinfo.total, monthinfo.lastmonthtotal)
                    )
                      ? 0
                      : getpercentage(monthinfo.total, monthinfo.lastmonthtotal)
                  )}
                  bgColor={
                    isPositive(
                      isNaN(
                        getpercentage(monthinfo.total, monthinfo.lastmonthtotal)
                      )
                        ? 0
                        : getpercentage(
                            monthinfo.total,
                            monthinfo.lastmonthtotal
                          )
                    )
                      ? "#22c55e"
                      : "#f43f5e"
                  }
                  baseBgColor="#eeeeee"
                  borderRadius="4px"
                  labelSize="10px"
                  height="8px"
                  isLabelVisible={false}
                />
                <div className="grow"></div>
                <h1 className="text-2xl text-gray-500">
                  {numberWithIndianFormat(monthinfo.collect)}
                </h1>
                <div className="flex gap-2 text-gray-500 text-xs">
                  <p>Received In {currentmonthname}</p>
                  <div className="grow"></div>
                  <p>
                    {isNaN(
                      getpercentage(
                        monthinfo.collect,
                        monthinfo.lastmonthcollect
                      )
                    )
                      ? 0
                      : getpercentage(
                          monthinfo.collect,
                          monthinfo.lastmonthcollect
                        )}
                  </p>
                </div>
                <ProgressBar
                  className="my-2"
                  completed={Math.abs(
                    isNaN(
                      getpercentage(
                        monthinfo.collect,
                        monthinfo.lastmonthcollect
                      )
                    )
                      ? 0
                      : getpercentage(
                          monthinfo.collect,
                          monthinfo.lastmonthcollect
                        )
                  )}
                  bgColor={
                    isPositive(
                      isNaN(
                        getpercentage(
                          monthinfo.collect,
                          monthinfo.lastmonthcollect
                        )
                      )
                        ? 0
                        : getpercentage(
                            monthinfo.collect,
                            monthinfo.lastmonthcollect
                          )
                    )
                      ? "#22c55e"
                      : "#f43f5e"
                  }
                  baseBgColor="#eeeeee"
                  borderRadius="4px"
                  labelSize="10px"
                  height="8px"
                  isLabelVisible={false}
                />
                <div className="grow"></div>

                <h1 className="text-2xl text-gray-500">
                  {numberWithIndianFormat(monthinfo.collect - monthinfo.total)}
                </h1>
                <div className="flex gap-2 text-gray-500 text-xs">
                  <p>Total Payment in period</p>
                  <div className="grow"></div>
                  {/* <p>
                    {getpercentage(
                      monthinfo.collect - monthinfo.total,
                      monthinfo.lastmonthcollect - monthinfo.lastmonthtotal
                    )}
                  </p> */}
                </div>
                {/* <ProgressBar
                  className="my-2"
                  completed={20}
                  bgColor="#f43f5e"
                  baseBgColor="#eeeeee"
                  borderRadius="4px"
                  labelSize="10px"
                  height="8px"
                  isLabelVisible={false}
                /> */}
                <div className="grow"></div>
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
