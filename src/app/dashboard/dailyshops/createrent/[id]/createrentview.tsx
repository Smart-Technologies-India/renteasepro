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
import { addDays, eachDayOfInterval, format, isAfter, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { useRouter } from "next/navigation";
import { user } from "@prisma/client";
import { default as MulSelect } from "react-select";
import GetNormalUser from "@/action/user/getnormalusers";
import { date, safeParse } from "valibot";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import GetDailyShop from "@/action/dailyshop/getdailyshop";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateDailyRentSchema } from "@/schema/createdailyrent";
import CreateDailyRent from "@/action/dailyrent/createdailyrent";

import { DatePicker, Modal, Space } from "antd";
import GetDailyRent from "@/action/dailyrent/getdailyrent";
import dayjs, { Dayjs } from "dayjs";
import BackButton from "@/components/backbutton";
import DepartmentCreateDailyRent from "@/action/dailyrent/departmentcreatedailyrent";

const { RangePicker } = DatePicker;

interface CreateRentProps {
  shopid: number;
}

const CreateRentPage = (props: CreateRentProps) => {
  const router = useRouter();
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [shopData, setShopData] = useState<any>();

  const property = useRef<HTMLInputElement>(null);
  const shop = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // const [amount, setAmount] = useState<string | null>(null);
  const chargeone = useRef<HTMLInputElement>(null);
  const chargetwo = useRef<HTMLInputElement>(null);
  const chargeThree = useRef<HTMLInputElement>(null);

  const [userid, setUserid] = useState<number>(0);
  const [purpose, setPurpose] = useState<string>("");

  const [users, setUsers] = useState<user[]>([]);
  const [user, setUser] = useState<user | null>(null);

  const [rentdates, setRentdates] = useState<Date[]>([]);

  interface DateFieldType {
    start: Dayjs | null;
    end: Dayjs | null;
  }
  const [datefield, setDatefield] = useState<DateFieldType>({
    start: null,
    end: null,
  });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const shopresponse = await GetDailyShop({
        id: props.shopid,
      });
      if (shopresponse.status) {
        setShopData(shopresponse.data ?? null);
      }
      const normaluserresponse = await GetNormalUser({});

      if (normaluserresponse.status) {
        setUsers(normaluserresponse.data ?? []);
      }

      const rentresponse = await GetDailyRent({ id: props.shopid });

      if (rentresponse.status) {
        let rentdates_temp: Date[] = [];
        rentresponse.data
          ?.filter(
            (rent) =>
              !(
                rent.status == "USERCANCELLED" ||
                rent.status == "CANCELLED" ||
                rent.status == "NONE" ||
                rent.status == "FAILED"
              )
          )
          .forEach((rent) => {
            let start_date = new Date(rent.event_from_date);
            let end_date = new Date(rent.event_to_date);

            let dates = eachDayOfInterval({ start: start_date, end: end_date });

            rentdates_temp.push(...dates);

            if (rent.prep_day) {
              rentdates_temp.push(new Date(rent.prep_day));
            }
            if (rent.handover_day) {
              rentdates_temp.push(new Date(rent.handover_day));
            }
          });

        setRentdates(rentdates_temp);
      }

      setLoading(false);
    };
    init();
  }, [props.shopid]);

  const create = async () => {
    setIsCreating(true);
    const result = safeParse(CreateDailyRentSchema, {
      userId: userid,
      unitId: props.shopid,
      event_amount: (datecount() * shopData?.rate_per_day).toString(),
      prep_day_amount: prepration ? shopData?.rate_prep_day : "0",
      handover_day_amount: handover ? shopData?.rate_handover_day : "0",
      deposit_amount: (shopData?.deposit_per_day).toString(),
      event_from_date: startDate,
      event_to_date: endDate,
      event_reason: purpose,
    });

    if (result.success) {
      // end date should be bigger then start date
      if (
        isAfter(
          new Date(result.output.event_from_date),
          new Date(result.output.event_to_date)
        )
      ) {
        setIsCreating(false);
        return toast.error("End date should be bigger then start date");
      }
      const createrent = await DepartmentCreateDailyRent({
        shopId: props.shopid,
        userId: userid,
        createdById: createuserid,
        event_amount: (datecount() * shopData?.rate_per_day).toString(),
        event_from_date: startDate!.toISOString(),
        event_to_date: endDate!.toISOString(),
        prep_day_amount: prepration ? shopData?.rate_prep_day : "0",
        handover_day_amount: handover ? shopData?.rate_handover_day : "0",
        deposit_amount: (shopData?.deposit_per_day).toString(),
        event_reason: purpose,
        ...(prepration && { prep_day: subDays(startDate!, 1).toISOString() }), // Day before startDate
        ...(handover && { handover_day: addDays(endDate!, 1).toISOString() }),
        // is_approved: true,
        // approvedById: createuserid,
        status: "UPCOMING",
      });

      if (!(createrent.status && createrent.data)) {
        setIsCreating(false);
        return toast.error(createrent.message);
      }

      toast.success("Unit booking request created successfully");
      router.push(`/dashboard/dailyshops/allbookinghistory`);
      setIsCreating(false);
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

  // const [monthAmount, setMonthAmount] = useState<Array<MonthType>>([]);

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

  const [handover, setHandover] = useState<boolean>(false);
  const [prepration, setPrepration] = useState<boolean>(false);

  // days between from date to to date include last date
  const datecount = (): number => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
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
          <div className="flex gap-2">
            <BackButton />
            <p className="text-gray-500 text-xl">New Booking</p>
          </div>

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
              <Label htmlFor="shopNumber">Unit Name</Label>
              <Input
                id="shopNumber"
                type="text"
                className="w-full bg-gray-100"
                disabled
                ref={shop}
                value={shopData?.name}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Rent start to end date <span className="text-rose-500">*</span>
              </Label>
              <RangePicker
                disabledDate={(current) => {
                  return current && current.toDate() < subDays(new Date(), 0);
                }}
                onChange={(e) => {
                  if (e && e.length != 2) return;

                  if (e[0] == null || e[1] == null) return;

                  // rentdates contains the dates which are already booked show error
                  const isDateBooked = (date: Date) => {
                    return rentdates.some(
                      (bookedDate) =>
                        format(bookedDate, "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd")
                    );
                  };

                  if (isDateBooked(e[0].toDate())) {
                    toast.error("Selected date is already booked");
                    // clear date field
                    setDatefield({ start: null, end: null });

                    return;
                  }

                  setStartDate(e[0].toDate());
                  setEndDate(e[1].toDate());
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="user">
                Purpose <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={[
                  "Public gatherings",
                  "Government gatherings",
                  "Seminars",
                  "Engagement / Reception /Sangeet function",
                  "Cultural functions and events",
                  "Official meetings of private companies / organizations",
                  "Theatre / Play shows",
                  "Educational Seminars",
                  "Exhibition cum sale / Market mela",
                  "Birthday/Baby shower functions",
                  "Havan / Pooja / Katha functions",
                  "Catering services (Breakfast / Lunch / High tea / Dinner)",
                ].map((val: string) => ({
                  value: val,
                  label: val,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setPurpose(val.value.toString());
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">
                Rate/Day for Private/General public (in Rs.){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="amount"
                type="text"
                className="w-full bg-gray-100"
                // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                //   const onlyNumbersRegex = /^[0-9]*$/;

                //   const { value } = event.target;
                //   if (onlyNumbersRegex.test(value)) {
                //     // setAmount(event.target.value.slice(0, -1));
                //     setAmount(value);
                //   }
                // }}
                disabled
                value={shopData?.rate_per_day}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargethree">
                Deposit/Day (Refundable) in Rs.{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargethree"
                type="text"
                className="w-full bg-gray-100"
                // onChange={handleNumberChange}
                ref={chargeThree}
                disabled={true}
                value={
                  shopData?.deposit_per_day ? shopData?.deposit_per_day : "0"
                }
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargeone">
                Rate/Day for pre preparation (i.e. 30% fees of the event date){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargeone"
                type="text"
                className="w-full bg-gray-100"
                // onChange={handleNumberChange}
                disabled={true}
                ref={chargeone}
                value={shopData?.rate_prep_day}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargetwo">
                Rate/Day for venue handover (i.e. 30% fees of the event date){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargetwo"
                type="text"
                className="w-full bg-gray-100"
                // onChange={handleNumberChange}
                ref={chargetwo}
                disabled={true}
                value={shopData?.rate_handover_day}
              />
            </div>
          </div>
          <div className="flex justify-between gap-6">
            <div className="flex mt-4  gap-6   flex-1">
              <div className="items-top flex space-x-2 ">
                <Checkbox
                  id="prepration"
                  checked={prepration}
                  onCheckedChange={(e: boolean) => {
                    setPrepration(e);
                  }}
                />
                <div className="grid gap-1.5 leading-none place-items-center">
                  <label
                    htmlFor="prepration"
                    className="text-sm font-medium leading-none"
                  >
                    Do you want one day prepration?
                  </label>
                </div>
              </div>
              {/* <div className="grow"></div> */}

              <p className="text-sm">
                Prepration Day Charge :{" "}
                {prepration ? shopData?.rate_prep_day : "0"}
              </p>
            </div>
            <div className="flex mt-4 gap-6   flex-1">
              <div className="items-top flex space-x-2 ">
                <Checkbox
                  id="handover"
                  checked={handover}
                  onCheckedChange={(e: boolean) => {
                    setHandover(e);
                  }}
                />
                <div className="grid gap-1.5 leading-none place-items-center">
                  <label
                    htmlFor="handover"
                    className="text-sm font-medium leading-none"
                  >
                    Do you want one day for handover?
                  </label>
                </div>
              </div>
              {/* <div className="grow"></div> */}
              <p className="text-sm">
                Handover Charge : {handover ? shopData?.rate_handover_day : "0"}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="user">
                User <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={users.map((u: user) => ({
                  value: u.contactone,
                  label: u.contactone,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  const userdata = users.find(
                    (u: user) => u.contactone === val.value
                  );
                  if (userdata) {
                    setUserid(userdata.id);
                    setUser(userdata);
                  }
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              {/* <Label htmlFor="user">
                Purpose <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={[
                  "Public gatherings",
                  "Government gatherings",
                  "Seminars",
                  "Engagement / Reception /Sangeet function",
                  "Cultural functions and events",
                  "Official meetings of private companies / organizations",
                  "Theatre / Play shows",
                  "Educational Seminars",
                  "Exhibition cum sale / Market mela",
                  "Birthday/Baby shower functions",
                  "Havan / Pooja / Katha functions",
                  "Catering services (Breakfast / Lunch / High tea / Dinner)",
                ].map((val: string) => ({
                  value: val,
                  label: val,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setPurpose(val.value.toString());
                }}
              /> */}
            </div>
          </div>
          {user && (
            <div className="grid items-center gap-1.5 w-full mt-4 bg-gray-100 p-2 rounded-md">
              <Label htmlFor="user">
                User Details <span className="text-rose-500">*</span>
              </Label>
              <div className="">
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Contact: {user.contactone}</p>
                <p>Email: {user.email}</p>
              </div>
            </div>
          )}

          <div className=" w-full mt-4 bg-gray-100 p-2 rounded-md">
            <Label htmlFor="user">
              Payment Details <span className="text-rose-500">*</span>
            </Label>

            <div className="flex w-full">
              <p>Price</p>
              <div className="grow"></div>
              <p>{datecount() * shopData?.rate_per_day}</p>
            </div>
            <div className="flex w-full">
              <p>Pre-Preparation Charge</p>
              <div className="grow"></div>
              <p> {prepration ? shopData?.rate_prep_day : "0"}</p>
            </div>
            <div className="flex w-full">
              <p>Venue Handover Charge</p>
              <div className="grow"></div>
              <p>{handover ? shopData?.rate_handover_day : "0"}</p>
            </div>
            {/* <div className="flex w-full">
              <p>Deposit</p>
              <div className="grow"></div>
              <p>
                {* shopData?.deposit_per_day}
              </p>
            </div> */}
            <div className="w-full h-[1px] bg-gray-500"></div>
            <div className="flex w-full">
              <p>Total</p>
              <div className="grow"></div>
              <p>
                {datecount() * shopData?.rate_per_day +
                  (prepration ? parseInt(shopData?.rate_prep_day) : 0) +
                  (handover ? parseInt(shopData?.rate_handover_day) : 0)}
              </p>
            </div>
          </div>

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
      </div>
    </>
  );
};
export default CreateRentPage;
