"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { useParams, useRouter } from "next/navigation";
import { user } from "@prisma/client";
import GetShop from "@/action/shop/getshop";
import { handleNumberChange, encryptURLData } from "@/utils/methods";
import { default as MulSelect } from "react-select";
import GetNormalUser from "@/action/user/getnormalusers";
import { safeParse } from "valibot";
import { CreateRentSchema } from "@/schema/createrent";
import { toast } from "react-toastify";
import CreateRent from "@/action/rent/createrent";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { decryptURLData } from "@/utils/methods";

const CreateRentPage = () => {
  const router = useRouter();
  const param = useParams();
  const [createduserid, setCreateUserid] = useState<number>(0);
  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);
  const shopid: number = id;

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [shopData, setShopData] = useState<any>();

  const property = useRef<HTMLInputElement>(null);
  const shop = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // const amount = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const chargeone = useRef<HTMLInputElement>(null);
  const chargetwo = useRef<HTMLInputElement>(null);
  const chargeThree = useRef<HTMLInputElement>(null);

  const [duedate, setDueDate] = useState<number>(0);
  const [userid, setUserid] = useState<number>(0);

  const [user, setUsers] = useState<user[]>([]);

  const [startDPop, setStartDPop] = useState<boolean>(false);
  const [endDPop, setEndDPop] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setCreateUserid(authResponse.data);
      const shopresponse = await GetShop({
        id: shopid,
      });

      if (shopresponse.status) {
        setShopData(shopresponse.data ?? null);
      }

      const normaluserresponse = await GetNormalUser({});
      if (normaluserresponse.status) {
        setUsers(normaluserresponse.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, [shopid]);

  const create = async () => {
    setIsCreating(true);
    const result = safeParse(CreateRentSchema, {
      rent_amount: parseInt(amount ?? "0"),
      rent_start_date: startDate,
      rent_end_date: endDate,
      due_date: duedate,
      userId: userid,
    });

    if (result.success) {
      const createrent = await CreateRent({
        shopId: shopid,
        userId: userid,
        createdById: createduserid,
        rent_amount: parseInt(amount ?? "0"),
        rent_start_date: format(startDate!, "yyyy-MM-dd"),
        rent_end_date: format(endDate!, "yyyy-MM-dd"),
        due_date: duedate,
        chargeone: chargeone.current?.value
          ? parseInt(chargeone.current?.value)
          : undefined,
        chargetwo: chargetwo.current?.value
          ? parseInt(chargetwo.current?.value)
          : undefined,
        chargethree: chargeThree.current?.value
          ? parseInt(chargeThree.current?.value)
          : undefined,
        monthamount: monthAmount,
      });

      if (!(createrent.status && createrent.data))
        return toast.error(createrent.message);

      toast.success("Shop rent created successfully");
      router.push(`/dashboard/shops/collectrent/${encryptURLData(createrent.data.id.toString())}`);
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
    setIsCreating(false);
  };

  interface MonthType {
    isDisable: boolean;
    amount: string;
    month: string;
  }

  const [monthAmount, setMonthAmount] = useState<Array<MonthType>>([]);

  function getMonthsInRange(
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
  ): number[] {
    const months: number[] = [];

    // Calculate the total number of months between start and end
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

    for (let i = 0; i <= totalMonths; i++) {
      const currentMonth = (startMonth + i) % 12; // Keep months in the 0-11 range
      months.push(currentMonth);
    }

    return months;
  }

  useEffect(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (amount && amount != "0" && amount != "" && startDate && endDate) {
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();

      setMonthAmount(
        monthNames.map((month, index) => {
          const RangeValue = getMonthsInRange(
            startYear,
            startMonth,
            endYear,
            endMonth
          );

          return {
            month: month,
            amount: RangeValue.includes(index) ? amount : "0",
            isDisable: !RangeValue.includes(index),
          };
        })
      );
    }
  }, [amount, startDate, endDate]);

  const handleAmountChange = (index: number, value: string) => {
    const onlyNumbersRegex = /^[0-9]*$/;
    if (onlyNumbersRegex.test(value)) {
      setMonthAmount((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, amount: value } : item
        )
      );
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500 text-xl">Add rent for Shop</p>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="propertes">Property</Label>
              <Input
                id="propertes"
                type="text"
                className="w-full bg-gray-100"
                disabled
                value={shopData?.property?.name}
                ref={property}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shopNumber">Shop Number</Label>
              <Input
                id="shopNumber"
                type="text"
                className="w-full bg-gray-100"
                disabled
                ref={shop}
                value={shopData?.shopNumber}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Rent Start Date <span className="text-rose-500">*</span>
              </Label>
              <Popover open={startDPop} onOpenChange={setStartDPop}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      startDate ?? "text-muted-foreground"
                    }`}
                  >
                    <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Select start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(e) => {
                      setStartDate(e);
                      setStartDPop(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Rent End Date <span className="text-rose-500">*</span>
              </Label>
              <Popover open={endDPop} onOpenChange={setEndDPop}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      endDate ?? "text-muted-foreground"
                    }`}
                  >
                    <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(e) => {
                      setEndDate(e);
                      setEndDPop(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">
                Amount <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="amount"
                type="text"
                className="w-full bg-gray-100"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const onlyNumbersRegex = /^[0-9]*$/;

                  const { value } = event.target;
                  if (onlyNumbersRegex.test(value)) {
                    // setAmount(event.target.value.slice(0, -1));
                    setAmount(value);
                  }
                }}
                value={amount ?? ""}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargeone">
                Late Fees <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargeone"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={chargeone}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargetwo">
                Interest <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargetwo"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={chargetwo}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargethree">
                Penalty <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargethree"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={chargeThree}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="user">
                User <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={user.map((u: user) => ({
                  value: u.contactone,
                  label: u.contactone,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  const userdata = user.find(
                    (u: user) => u.contactone === val.value
                  );
                  if (userdata) {
                    setUserid(userdata.id);
                  }
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="duedate">
                Due Date <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={Array.from({ length: 31 }, (_, i) => ({
                  value: i + 1,
                  label: i + 1,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setDueDate(parseInt(val.value.toString()));
                }}
              />
            </div>
          </div>
          {monthAmount.length == 0 ? (
            <></>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4 gird ">
              {monthAmount.map((val: MonthType, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-md p-2 flex gap-1 items-center border"
                >
                  <p className="w-28">{val.month}</p>
                  <Input
                    type="text"
                    className="w-full bg-gray-white h-8"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleAmountChange(index, event.target.value)
                    }
                    value={val.amount}
                    disabled={val.isDisable}
                  />
                </div>
              ))}
            </div>
          )}

          {isCreating ? (
            <Button
              disabled
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d]"
            >
              Creating Rent...
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d]"
              onClick={create}
            >
              Submit
            </Button>
          )}
        </div>

        {/* <div className="bg-white rounded-sm shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4 gird ">
          {monthNames.map((month: string, index: number) => (
            <div
              key={index}
              className="bg-gray-100 rounded-md p-2 flex gap-1 items-center border"
            >
              <p className="w-28">{month}</p>
              <Input
                type="text"
                className="w-full bg-gray-white h-8"
                onChange={handleNumberChange}
              />
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};
export default CreateRentPage;
