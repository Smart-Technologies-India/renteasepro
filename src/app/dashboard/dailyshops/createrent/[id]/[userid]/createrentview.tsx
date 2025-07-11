/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { daily_rent_description, user } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { default as MulSelect } from "react-select";
import GetDailyShop from "@/action/dailyshop/getdailyshop";
import CreateDailyRent from "@/action/dailyrent/createdailyrent";
import { CreateDailyRentSchema } from "@/schema/createdailyrent";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker, Modal } from "antd";
import GetDailyRent from "@/action/dailyrent/getdailyrent";
import { customAlphabet } from "nanoid";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";
import GetDailyRentDescription from "@/action/dailyrentdescription/getdailyrentdescription";
const { RangePicker } = DatePicker;

interface CreateRentProps {
  unitid: number;
  userid: number;
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

  const [purpose, setPurpose] = useState<string>("");

  const [user, setUser] = useState<user | null>(null);

  const [rentdates, setRentdates] = useState<Date[]>([]);

  const gst_no = useRef<HTMLInputElement>(null);
  const company_name = useRef<HTMLInputElement>(null);

  const [rentDescription, setRentDescription] = useState<
    daily_rent_description[]
  >([]);

  const [dailyRentDescription, setDailyRentDescription] =
    useState<daily_rent_description | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const purpose = await GetDailyRentDescription({
        id: props.unitid,
      });

      if (purpose.status && purpose.data) {
        setRentDescription(purpose.data);
      } else {
        toast.error(purpose.message);
        router.back();
        return;
      }

      const userresponse = await GetUser({ id: createuserid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const shopresponse = await GetDailyShop({
        id: props.unitid,
      });
      if (shopresponse.status) {
        setShopData(shopresponse.data ?? null);
      }

      const rentresponse = await GetDailyRent({ id: props.unitid });

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
  }, []);

  const create = () => {
    const result = safeParse(CreateDailyRentSchema, {
      userId: props.userid,
      unitId: props.unitid,
      event_amount: (
        datecount() * parseInt(dailyRentDescription?.event_amount || "0")
      ).toString(),
      prep_day_amount: prepration
        ? parseInt(dailyRentDescription?.prep_day_amount || "0").toFixed(0)
        : "0",
      handover_day_amount: handover
        ? parseInt(dailyRentDescription?.handover_day_amount || "0").toFixed(0)
        : "0",
      deposit_amount: (dailyRentDescription?.deposit_amount || "0").toString(),
      event_from_date: startDate,
      event_to_date: endDate,
      event_reason: purpose,
    });

    if (result.success) {
      if (
        isAfter(
          new Date(result.output.event_from_date),
          new Date(result.output.event_to_date)
        )
      ) {
        setIsCreating(false);
        return toast.error("End date should be bigger then start date");
      }

      if (shopData.id == 4) {
        setOpen1(true);
      } else if (shopData.id == 3) {
        setOpen2(true);
      } else if (shopData.id == 13) {
        setOpen3(true);
      } else {
        setOpen4(true);
      }
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
  };

  //  This code is for takes to payment gateway
  const submit = async () => {
    setIsCreating(true);
    const result = safeParse(CreateDailyRentSchema, {
      userId: props.userid,
      unitId: props.unitid,
      event_amount: (
        datecount() * parseInt(dailyRentDescription?.event_amount || "0")
      ).toString(),
      prep_day_amount: prepration
        ? parseInt(dailyRentDescription?.prep_day_amount || "0").toFixed(0)
        : "0",
      handover_day_amount: handover
        ? parseInt(dailyRentDescription?.handover_day_amount || "0").toFixed(0)
        : "0",
      deposit_amount: (dailyRentDescription?.deposit_amount || "0").toString(),
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
      const createrent = await CreateDailyRent({
        shopId: props.unitid,
        userId: props.userid,
        createdById: createuserid,
        event_from_date: startDate!.toLocaleString(),
        event_to_date: endDate!.toLocaleString(),
        event_amount: (
          datecount() * parseInt(dailyRentDescription?.event_amount || "0")
        ).toString(),
        prep_day_amount: prepration
          ? parseInt(dailyRentDescription?.prep_day_amount || "0").toFixed(0)
          : "0",
        handover_day_amount: handover
          ? parseInt(dailyRentDescription?.handover_day_amount || "0").toFixed(
              0
            )
          : "0",
        deposit_amount: (
          dailyRentDescription?.deposit_amount || "0"
        ).toString(),
        event_reason: purpose,
        ...(prepration && {
          prep_day: subDays(startDate!, 1).toLocaleString(),
        }), // Day before startDate
        ...(handover && {
          handover_day: addDays(endDate!, 1).toLocaleString(),
        }),
        status: "FAILED",
        company_name: company_name.current?.value,
        gst_no: gst_no.current?.value,
      });

      if (!(createrent.status && createrent.data)) {
        setIsCreating(false);
        return toast.error(createrent.message);
      }

      toast.success("Unit booking request created successfully");

      const nanoid = customAlphabet("1234567890abcdef", 10);

      const uniqueid = nanoid();

      const amount =
        datecount() * parseInt(dailyRentDescription?.event_amount || "0") +
        (prepration
          ? parseInt(dailyRentDescription?.prep_day_amount || "0")
          : 0) +
        (handover
          ? parseInt(dailyRentDescription?.handover_day_amount || "0")
          : 0);

      router.back();
      window.open(
        `/payamount?xlmnx=${amount}&ynboy=${uniqueid}&zgvfz=${createrent.data.id}_0_0_dailyrent&name=${user?.firstName}-${user?.lastName}&email=${user?.email}&mobile=${user?.contactone}`
      );
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

  // const submit = async () => {
  //   setIsCreating(true);
  //   const result = safeParse(CreateDailyRentSchema, {
  //     userId: props.userid,
  //     unitId: props.unitid,
  //     event_amount: (
  //       datecount() * parseInt(dailyRentDescription?.event_amount || "0")
  //     ).toString(),
  //     prep_day_amount: prepration
  //       ? parseInt(dailyRentDescription?.prep_day_amount || "0").toFixed(0)
  //       : "0",
  //     handover_day_amount: handover
  //       ? parseInt(dailyRentDescription?.handover_day_amount || "0").toFixed(0)
  //       : "0",
  //     deposit_amount: (dailyRentDescription?.deposit_amount || "0").toString(),
  //     event_from_date: startDate,
  //     event_to_date: endDate,
  //     event_reason: purpose,
  //   });

  //   if (result.success) {
  //     // end date should be bigger then start date
  //     if (
  //       isAfter(
  //         new Date(result.output.event_from_date),
  //         new Date(result.output.event_to_date)
  //       )
  //     ) {
  //       setIsCreating(false);
  //       return toast.error("End date should be bigger then start date");
  //     }
  //     const createrent = await CreateDailyRent({
  //       shopId: props.unitid,
  //       userId: props.userid,
  //       createdById: createuserid,
  //       event_from_date: startDate!.toISOString(),
  //       event_to_date: endDate!.toISOString(),
  //       event_amount: (
  //         datecount() * parseInt(dailyRentDescription?.event_amount || "0")
  //       ).toString(),
  //       prep_day_amount: prepration
  //         ? parseInt(dailyRentDescription?.prep_day_amount || "0").toFixed(0)
  //         : "0",
  //       handover_day_amount: handover
  //         ? parseInt(dailyRentDescription?.handover_day_amount || "0").toFixed(
  //             0
  //           )
  //         : "0",
  //       deposit_amount: (
  //         dailyRentDescription?.deposit_amount || "0"
  //       ).toString(),
  //       event_reason: purpose,
  //       ...(prepration && { prep_day: subDays(startDate!, 1).toISOString() }), // Day before startDate
  //       ...(handover && { handover_day: addDays(endDate!, 1).toISOString() }),
  //       status: "FAILED",
  //       company_name: company_name.current?.value,
  //       gst_no: gst_no.current?.value,
  //     });

  //     if (!(createrent.status && createrent.data)) {
  //       setIsCreating(false);
  //       return toast.error(createrent.message);
  //     }

  //     toast.success("Unit booking request created successfully");

  //     const nanoid = customAlphabet("1234567890abcdef", 10);

  //     const uniqueid = nanoid();

  //     const paymentresponse = await TestPayment({
  //       rentid: createrent.data.id,
  //       orderid: uniqueid,
  //     });

  //     if (!paymentresponse.status) {
  //       setIsCreating(false);
  //       return toast.error(paymentresponse.message);
  //     } else {
  //       toast.success("Payment initiated successfully");
  //       router.back();
  //     }
  //   } else {
  //     let errorMessage = "";
  //     if (result.issues[0].input) {
  //       errorMessage = result.issues[0].message;
  //     } else {
  //       errorMessage = result.issues[0].path![0].key + " is required";
  //     }
  //     toast.error(errorMessage);
  //   }
  //   setIsCreating(false);
  // };

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
  const [monthBox, setMonthBox] = useState<boolean>(false);

  const [open1, setOpen1] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const [open3, setOpen3] = useState<boolean>(false);
  const [open4, setOpen4] = useState<boolean>(false);

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
              <div className="flex gap-2">
                <Label>
                  Booking start to end date
                  <span className="text-rose-500">*</span>
                </Label>
                <div className="grow"></div>
                <button
                  className="text-sm rounded-md border border-blue-500 px-2 py-1 bg-blue-500 text-white"
                  onClick={() => {
                    setMonthBox(true);
                  }}
                >
                  View Dates
                </button>
              </div>
              <Modal
                title="Available Dates"
                open={monthBox}
                width={1000}
                onCancel={() => {
                  setMonthBox(false);
                }}
                footer={null}
              >
                <CalendarMonths avaliableDays={rentdates} />
              </Modal>
              <RangePicker
                disabledDate={(current) => {
                  return current && current.toDate() < subDays(new Date(), 0);
                }}
                onChange={(e) => {
                  if (e.length != 2) return;

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
                // options={[
                //   "Public gatherings",
                //   "Government gatherings",
                //   "Seminars",
                //   "Engagement / Reception /Sangeet function",
                //   "Cultural functions and events",
                //   "Official meetings of private companies / organizations",
                //   "Theatre / Play shows",
                //   "Educational Seminars",
                //   "Exhibition cum sale / Market mela",
                //   "Birthday/Baby shower functions",
                //   "Havan / Pooja / Katha functions",
                //   "Catering services (Breakfast / Lunch / High tea / Dinner)",
                // ].map((val: string) => ({
                //   value: val,
                //   label: val,
                // }))}
                options={rentDescription.map((val: daily_rent_description) => ({
                  value: val.purpose,
                  label: val.purpose,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setPurpose(val.value.toString());
                  const rentDesc = rentDescription.find(
                    (desc) => desc.purpose === val.value
                  );
                  if (rentDesc) {
                    setDailyRentDescription(rentDesc);
                  }
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
                value={dailyRentDescription?.event_amount || "0"}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargethree">
                Deposit/Day in Rs.(Refundable), to be paid in the form of DD
                within 7 days after successful booking{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="chargethree"
                type="text"
                className="w-full bg-gray-100"
                // onChange={handleNumberChange}
                ref={chargeThree}
                disabled={true}
                value={dailyRentDescription?.deposit_amount || "0"}
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
                value={dailyRentDescription?.prep_day_amount || "0"}
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
                value={dailyRentDescription?.handover_day_amount || "0"}
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

              <p className="text-sm">
                Prepration Day Charge :{" "}
                {prepration
                  ? parseInt(dailyRentDescription?.prep_day_amount || "0")
                  : "0"}
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
                Handover Charge :
                {handover ? dailyRentDescription?.handover_day_amount : "0"}
              </p>
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
          <h1 className="text-gray-500 text-xl mt-4 mb-2">
            GST Details{" "}
            <span className="text-rose-500 text-sm">
              (Only businesses registered within the jurisdiction of Dadra and
              Nagar Haveli are eligible to claim Goods and Services Tax (GST)
              benefits under the applicable provisions of the GST Act.)
            </span>
          </h1>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="gst_no">GST No</Label>
              <Input
                id="gst_no"
                type="text"
                className="w-full bg-white"
                // value={shopData?.property?.name}
                ref={gst_no}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                type="text"
                className="w-full bg-white"
                ref={company_name}
                // value={shopData?.name}
              />
            </div>
          </div>

          <div className=" w-full mt-4 bg-gray-100 p-2 rounded-md">
            <Label htmlFor="user">
              Payment Details <span className="text-rose-500">*</span>
            </Label>

            <div className="flex w-full">
              <p>Price</p>
              <div className="grow"></div>
              <p>
                {datecount() *
                  parseInt(dailyRentDescription?.event_amount || "0")}
              </p>
            </div>
            <div className="flex w-full">
              <p>Pre-Preparation Charge</p>
              <div className="grow"></div>
              <p>
                {prepration
                  ? parseInt(dailyRentDescription?.prep_day_amount || "0")
                  : "0"}
              </p>
            </div>
            <div className="flex w-full">
              <p>Venue-Handover Charge</p>
              <div className="grow"></div>
              <p>
                {handover
                  ? parseInt(dailyRentDescription?.handover_day_amount || "0")
                  : "0"}
              </p>
            </div>
            {/* <div className="flex w-full">
              <p>Deposit</p>
              <div className="grow"></div>
              <p>
                {shopData?.deposit_per_day}
              </p>
            </div> */}
            <div className="w-full h-[1px] bg-gray-500"></div>
            <div className="flex w-full">
              <p>Total</p>
              <div className="grow"></div>
              <p>
                {datecount() *
                  parseInt(dailyRentDescription?.event_amount || "0") +
                  (prepration
                    ? parseInt(dailyRentDescription?.prep_day_amount || "0")
                    : 0) +
                  (handover
                    ? parseInt(dailyRentDescription?.handover_day_amount || "0")
                    : 0)}
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
      <Modal
        title="Terms & Condition"
        centered
        open={open1}
        onCancel={() => setOpen1(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-gray-800">
          1. The permission of videography / Photography shall be granted only
          on the given date while utilizing the space of Open-Air Amphitheatre
          area along with Pavilion area at Dr. APJ Abdul Kalam College Campus,
          Dokmardi, Silvassa, DNH.
        </p>

        <p className="text-sm text-rose-500 font-normal my-2">
          2. The applicant has to pay an amount of Rs. 10,000/- (Refundable) in
          the form of Demand Draft in the favour Dadra and Nagar Haveli Planning
          & Development Authority as Security Deposit before your function /
          event date physically in the office of DNHPDA, Silvassa and failing to
          do so shall be understood that the said booking is cancelled. The
          Security Deposit shall be refundable if the allotted space is found in
          neat and tidy condition by the competent authority.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3.The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. You shall ensure that there shall not be any damages to the assets
          such as viewers chairs at Pavilion area, seating steps at Open Air
          Amphitheatre area along with Pavilion area at Dr. APJ Abdul Kalam
          College Campus, Dokmardi, Silvassa, DNH.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, a penalty shall
          be levied amounting to Rs. 5000/- and the security deposit submitted
          to the department shall be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. You shall ensure to maintain the floor and premises of the Open-Air
          Amphitheatre along with Pavilion area at Dr. APJ Abdul Kalam College
          Campus, Dokmardi, Silvassa, DNH, clean by avoiding littering of food
          materials over the floors by sufficient provision of waste bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. You shall make and use the lighting arrangements, Audio systems,
          projectors, HVAC systems in the premises during the function only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. Applicant shall not occupy and hinder the common areas such as
          entry / exit points, corridors / passage, common road and foot paths
          etc. If the applicant does so, a penalty amounting to Rs. 5000/- shall
          be levied and the security deposit submitted to the department shall
          be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. You shall not stick any adhesive based posters in the entire
          premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Smoking, drinking of alcohol, chewing of tobacco and
          non-vegetarian food is strictly prohibited in the entire premises and
          if found, you shall have to pay a penalty amount of Rs. 5000/- and
          also the Security Deposit submitted to the department shall be
          forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. If the applicant has to change their booking date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. If the applicant has to cancel their booking date / allotted date,
          50% cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to cancel their booking date / allotted date
          before 1 week of their function / event date, in that case 100%
          cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. You shall be responsible to hand over the entire premises in neat
          and clean condition after completion of your function. If cleanliness
          of the used premises is not found satisfactory, the department shall
          impose a penalty and shall also forfeit the Security Deposit without
          any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
        <p className="text-sm text-gray-500 font-normal my-2">
          17. The DNHPDA reserves the right to cancel the allotment of space at
          Open Air Amphitheatre along with Pavilion area at Dr. APJ Abdul Kalam
          College Campus, Dokmardi, Silvassa, DNH in case of any government
          functions without assigning any reason thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          18. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>

        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={submit}
          >
            Accept & Submit
          </button>
        </div>
      </Modal>
      <Modal
        title="Terms & Condition"
        centered
        open={open2}
        onCancel={() => setOpen2(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-gray-800">
          1. The permission of videography / Photography shall be granted only
          on the given date while utilizing the space of Open-Air Amphitheatre
          area along with Pavilion area at Dr. APJ Abdul Kalam College Campus,
          Dokmardi, Silvassa, DNH.
        </p>

        <p className="text-sm text-rose-800 font-normal my-2">
          2. The applicant has to pay an amount of Rs. 10,000/- (Refundable) in
          the form of Demand Draft in the favour Dadra and Nagar Haveli Planning
          & Development Authority as Security Deposit before your function /
          event date physically in the office of DNHPDA, Silvassa and failing to
          do so shall be understood that the said booking is cancelled. The
          Security Deposit shall be refundable if the allotted space is found in
          neat and tidy condition by the competent authority.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3.The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. You shall ensure that there shall not be any damages to the assets
          such as viewers chairs at Pavilion area, seating steps at Open Air
          Amphitheatre area along with Pavilion area at Dr. APJ Abdul Kalam
          College Campus, Dokmardi, Silvassa, DNH.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, a penalty shall
          be levied amounting to Rs. 5000/- and the security deposit submitted
          to the department shall be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. You shall ensure to maintain the floor, carpet area and premises of
          the Auditorium Hall at Dr. APJ Abdul Kalam College Campus, Dokmardi,
          Silvassa, DNH.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. Havan, Pooja, Katha, burning of crackers etc. shall not be allowed
          and is strictly prohibited in Auditorium Hall.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. You shall use the lighting arrangements, Audio systems, projectors
          HVAC systems, light and audio mixers available in the premises during
          the function only and if any damages or alterations are found in the
          aforementioned items, you shall be liable to pay the repair or
          replacement amount for the same.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. You shall not stick any adhesive based posters in the entire
          premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Eating and drinking is strictly prohibited inside the Auditorium
          Hall at Dr. APJ Abdul Kalam College Campus, Dokmardi, Silvassa, DNH
          and if found, you shall have to pay a penalty amount of Rs. 5000/- to
          the concerned department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. Applicant shall not occupy and hinder the common areas such as
          entry / exit points, corridors / passage, common road and foot paths
          etc. If the applicant does so, a penalty amounting to Rs. 5000/- shall
          be levied and the security deposit submitted to the department shall
          be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. Smoking, drinking of alcohol, chewing of tobacco and
          non-vegetarian food is strictly prohibited in the entire premises and
          if found, you shall have to pay a penalty amount of Rs. 5000/- and
          also the Security Deposit submitted to the department shall be
          forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to change their booking date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. If the applicant has to cancel their booking date / allotted date,
          50% cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. If the applicant has to cancel their booking date / allotted date
          before 1 week of their function / event date, in that case 100%
          cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          17. You shall be responsible to hand over the entire premises in neat
          and clean condition after completion of your function. If cleanliness
          of the used premises is not found satisfactory, the department shall
          impose a penalty and shall also forfeit the Security Deposit without
          any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          18. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
        <p className="text-sm text-rose-500 font-normal my-2">
          19. The DNHPDA reserves the right to cancel the allotment of space at
          Open Air Amphitheatre along with Pavilion area at Dr. APJ Abdul Kalam
          College Campus, Dokmardi, Silvassa, DNH in case of any government
          functions without assigning any reason thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          20. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>

        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={submit}
          >
            Accept & Submit
          </button>
        </div>
      </Modal>
      <Modal
        title="Terms & Condition"
        centered
        open={open3}
        onCancel={() => setOpen3(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-gray-800">
          1. The permission of videography / Photography shall be granted only
          on the given date while utilizing the space of Open-Air Amphitheatre
          area along with Pavilion area at Dr. APJ Abdul Kalam College Campus,
          Dokmardi, Silvassa, DNH.
        </p>

        <p className="text-sm text-rose-500 font-normal my-2">
          2. The applicant has to pay an amount of Rs. 10,000/- (Refundable) in
          the form of Demand Draft in the favour Dadra and Nagar Haveli Planning
          & Development Authority as Security Deposit before your function /
          event date physically in the office of DNHPDA, Silvassa and failing to
          do so shall be understood that the said booking is cancelled. The
          Security Deposit shall be refundable if the allotted space is found in
          neat and tidy condition by the competent authority.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3.The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, a penalty shall
          be levied amounting to Rs. 5000/- and the security deposit submitted
          to the department shall be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. You shall ensure to maintain the floor, carpet area and premises of
          the Exhibition Hall at Dr. APJ Abdul Kalam College Campus, Dokmardi,
          Silvassa, DNH, clean by avoiding littering of food materials over the
          floors, by sufficient provision of waste bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. You shall arrange the audio systems, projectors and its accessories
          at your own cost for Exhibition Hall at Dr. APJ Abdul Kalam College
          Campus, Dokmardi, Silvassa, DNH.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. You shall not stick any adhesive based posters in the entire
          premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. You shall ensure that there shall not be any damages to the various
          assets such as fans, lights, etc. of Exhibition Hall at Dr. APJ Abdul
          Kalam College Campus, Dokmardi, Silvassa, DNH.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. Havan, Pooja, Katha, burning of crackers etc. shall not be allowed
          and is strictly prohibited in Auditorium Hall.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Applicant shall not occupy and hinder the common areas such as
          entry / exit points, corridors / passage, common road and foot paths
          etc. If the applicant does so, a penalty amounting to Rs. 5000/- shall
          be levied and the security deposit submitted to the department shall
          be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. Smoking, drinking of alcohol, chewing of tobacco and
          non-vegetarian food is strictly prohibited in the entire premises and
          if found, you shall have to pay a penalty amount of Rs. 5000/- and
          also the Security Deposit submitted to the department shall be
          forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. If the applicant has to change their booking date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to cancel their booking date / allotted date,
          50% cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. If the applicant has to cancel their booking date / allotted date
          before 1 week of their function / event date, in that case 100%
          cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. You shall be responsible to hand over the entire premises in neat
          and clean condition after completion of your function. If cleanliness
          of the used premises is not found satisfactory, the department shall
          impose a penalty and shall also forfeit the Security Deposit without
          any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          17. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
        <p className="text-sm text-rose-500 font-normal my-2">
          18. The DNHPDA reserves the right to cancel the allotment of space at
          Open Air Amphitheatre along with Pavilion area at Dr. APJ Abdul Kalam
          College Campus, Dokmardi, Silvassa, DNH in case of any government
          functions without assigning any reason thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          19. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>

        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={submit}
          >
            Accept & Submit
          </button>
        </div>
      </Modal>
      <Modal
        title="Terms & Condition"
        centered
        open={open4}
        onCancel={() => setOpen4(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-gray-800">
          1. The permission of videography / Photography shall be granted only
          on the given date while utilizing the allotted space at Kala Kendra,
          Silvassa, DNH.
        </p>

        <p className="text-sm text-rose-500 font-normal my-2">
          2. The applicant has to pay an amount of Rs. 10,000/- (Refundable) in
          the form of Demand Draft in the favour Dadra and Nagar Haveli Planning
          & Development Authority as Security Deposit before your function /
          event date physically in the office of DNHPDA, Silvassa and failing to
          do so shall be understood that the said booking is cancelled. The
          Security Deposit shall be refundable if the allotted space is found in
          neat and tidy condition by the competent authority.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3.The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. The applicant shall ensure that there shall not be any damages to
          the assets such as Auditorium and Banquet Hall / Exhibition Hall
          space, Acoustic wall panels, lighting components, floor carpets, stage
          platform, mic podiums, projectors, lighting components and its
          accessories, Audio sound system and accessories, seating chairs, V.I.P
          chairs, recliners, electrical connections, main stage accessories,
          viewers chairs at Pavilion area, seating steps at Open air
          Amphitheatre area etc. of the allotted space.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, a penalty shall
          be levied amounting to Rs. 5000/- and the security deposit submitted
          to the department shall be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. The applicant shall ensure that they shall maintain the floor and
          premises of the allotted space, clean by avoiding littering of food
          materials over the floors, by sufficient provision of waste bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. Havan, Pooja, Katha, burning of crackers etc. shall not be allowed
          and is strictly prohibited in Auditorium Hall, Banquet Hall, Bride
          room and Groom Room. The same shall only be allowed in Open Air
          Amphitheatre with all the preventive measures.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. The applicant shall not stick any adhesive based posters in the
          allotted space and entire premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. Eating and drinking is strictly prohibited inside the Auditorium
          Halls and if found, the applicant shall have to pay a penalty amount
          of Rs. 5000/- to the concerned department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Applicant shall not occupy and hinder the common areas such as
          entry / exit points, corridors / passage, common road and foot paths
          etc. If the applicant does so, a penalty amounting to Rs. 5000/- shall
          be levied and the security deposit submitted to the department shall
          be forfeited without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. Smoking, drinking of alcohol, non-vegetarian food, chewing of
          tobacco is strictly prohibited in the entire premises and if found,
          you shall have to pay a penalty amount of Rs. 5000/- and also the
          security deposit submitted to the department shall be forfeited
          without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. If the applicant has to change their booking date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to cancel their booking date / allotted date,
          50% cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. If the applicant has to cancel their booking date / allotted date
          before 1 week of their function / event date, in that case 100%
          cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
        <p className="text-sm text-rose-500 font-normal my-2">
          17. The DNHPDA reserves the right to cancel the allotment of space at
          Kala-Kendra, Auditorium and Banquet Hall in case of any government
          functions without assigning any reason thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          18. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>

        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            onClick={submit}
          >
            Accept & Submit
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CreateRentPage;

interface CalendarMonthsProps {
  avaliableDays: Date[];
}

const CalendarMonths = (props: CalendarMonthsProps) => {
  const today = new Date();
  const months = [0, 1, 2].map((offset) => addMonths(today, offset));
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i), "EEE")
  );

  return (
    <div className="flex mt-6 w-full flex-wrap justify-center gap-6">
      {months.map((month, index) => {
        const firstDay = startOfMonth(month);
        const lastDay = endOfMonth(month);
        const days = eachDayOfInterval({ start: firstDay, end: lastDay });
        const startWeekday = firstDay.getDay();

        return (
          <div key={index} className="bg-white shadow p-2 rounded-md">
            <h2 className="text-center font-semibold mb-2">
              {format(month, "MMMM yyyy")}
            </h2>
            <div className="grid grid-cols-7 gap-3 text-center text-sm font-medium place-items-center">
              {weekDays.map((day) => (
                <div key={day} className="text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={"empty-" + i}></div>
              ))}
              {days.map((day) => {
                const isUnavailable = props.avaliableDays.some((d) =>
                  isSameDay(d, day)
                );

                return (
                  <div
                    key={day.toISOString()}
                    className={`py-1 rounded-full w-6 h-6 flex items-center justify-center ${
                      isUnavailable ? "bg-rose-500 text-white" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
