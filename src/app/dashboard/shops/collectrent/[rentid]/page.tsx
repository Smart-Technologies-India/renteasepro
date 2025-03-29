"use client";

import GetRent from "@/action/rent/getrent";
import BackButton from "@/components/backbutton";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { formateDate } from "@/utils/methods";
import { rent_transact } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import GetUserRent from "@/action/rent_transact/getuserrent";
import { customAlphabet } from "nanoid";
import AddOrderId from "@/action/rent_transact/addorderid";
import { toast } from "react-toastify";
import PayRent from "@/action/rent_transact/payrent";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GetUserFirstRent from "@/action/rent_transact/getuserfirstrent";

const CollectRent = () => {
  const params = useParams<{ rentid: string }>();
  const rentid: number = parseInt(params.rentid);

  //   const [field, setField] = useState<number[]>([]);
  const [check, setCheck] = useState<boolean>(false);
  const router = useRouter();

  const [isPaying, setPaying] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(0);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<any>();
  const [rentTransact, setRentTransact] = useState<rent_transact | null>(null);

  const banknameRef = useRef<HTMLInputElement>(null);
  const transactionRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState<Date>();
  const [startDPop, setStartDPop] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const rentresponse = await GetRent({ id: parseInt(rentid.toString()) });
      if (rentresponse.status) {
        setRent(rentresponse.data);
      }

      const rentTransactresponse = await GetUserFirstRent({ rentid: rentid });
      if (rentTransactresponse.status) {
        setRentTransact(rentTransactresponse.data);
      }
      setLoading(false);
    };
    init();
  }, [rentid]);

  const payfees = async () => {
    if (check == false) {
      toast.error("Please select atleast one month to pay rent");
      setLoading(false);
      setPaying(false);
      return;
    }

    const nanoid = customAlphabet("1234567890abcdef", 10);

    const uniqueid = nanoid();
    // const ids: string = field.join(",");

    await AddOrderId({
      rentid: [rentTransact!.id],
      orderid: uniqueid,
    });

    setLoading(true);
    setPaying(true);
    // if (field.length == 0) {
    //   toast.error("Please select atleast one month to pay rent");
    //   setLoading(false);
    //   setPaying(false);
    //   return;
    // }

    if (!banknameRef.current?.value) {
      toast.error("Please enter bank name");
      setLoading(false);
      setPaying(false);
      return;
    }

    if (!transactionRef.current?.value) {
      toast.error("Please enter transaction id");
      setLoading(false);
      setPaying(false);
      return;
    }

    if (!startDate) {
      toast.error("Please select transaction date");
      setLoading(false);
      setPaying(false);
      return;
    }

    const payrent_response = await PayRent({
      rentid: [rentTransact!.id],
      transactionid: transactionRef.current?.value ?? "",
      bankname: banknameRef.current?.value ?? "",
      orderid: uniqueid,
      startdate: startDate,
    });

    if (payrent_response.status) {
      toast.success(payrent_response.message);
    } else {
      setLoading(false);
      setPaying(false);
      toast.error(payrent_response.message);
      return;
    }

    // setField([]);
    setCheck(false);
    setAmount(0);
    setLoading(false);
    setPaying(false);
    router.push("/dashboard");
    // return router.push(`/dashboard/rentrecept/${userid}/${props.id}/${field[0]}`);
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
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-[#162f57] text-2xl font-semibold">
            Rent Details
          </h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
            <p className="text-gray-500 text-center">General Information</p>
            <Separator />
            <div className="grid gap-4 mt-4 grid-cols-2">
              <p className="text-xs leading-3">
                Shop Number <br />
                <span className="text-sm text-gray-500 font-medium">
                  {/* {rent.shop.shopNumber < new Date() ? "Ended" : "Running"} */}
                  {rent.shop.shopNumber}
                </span>
              </p>

              <p className="text-xs leading-3">
                Shop Size <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent.shop.shopSize}
                  {/* {rent.shop.shopSize < new Date() ? "Ended" : "Running"} */}
                </span>
              </p>

              <p className="text-xs leading-3">
                Start Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rent.rent_start_date))}
                </span>
              </p>

              <p className="text-xs leading-3">
                End Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rent.rent_end_date))}
                </span>
              </p>

              <p className="text-xs leading-3">
                Rent Amount <br />
                <span className="text-sm text-gray-500 font-medium">
                  &#8377;{rent.rent_amount}
                </span>
              </p>

              <p className="text-xs leading-3">
                Due Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent.due_date}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1 text-sm">
            <p className="text-gray-500 text-center">Rent Payment</p>

            <Separator />

            <>
              <div className="mt-4 flex my-2">
                <h1 className="">Pending Rent</h1>
                <div className="grow"></div>
                {/* <p className="">
                  &#8377;
                  {rentTransact.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.amount,
                    0
                  )}{" "}
                  - ({rentTransact.length} Months)
                </p> */}
              </div>
              <Separator />

              {/* {rentTransact.map((item, index) => ( */}
              <div className="flex my-2 items-center gap-2">
                <Checkbox
                  // disabled={
                  //   index == 0
                  //     ? false
                  //     : !field?.includes(rentTransact[index - 1].id)
                  // }
                  checked={check}
                  onCheckedChange={(checked) => {
                    setCheck(checked === true);

                    if (checked) {
                      setAmount(rentTransact!.amount);
                    } else {
                      setAmount(0);
                    }

                    //   if (checked) {
                    //     setField([...field, item.id]);
                    //   } else {
                    //     // setField(field.filter((id) => id !== item.id));
                    //     // remove the curretn checkbox and all the checkbox after it
                    //     setField(field.slice(0, index));
                    //   }

                    //   if (checked) {
                    //     setAmount(amount + item.amount);
                    //   } else {
                    //     // setAmount(amount - item.amount);
                    //     // remove the curent amount and all the amount after it
                    //     setAmount(
                    //       rentTransact
                    //         .slice(0, index)
                    //         .reduce((a, b) => a + b.amount, 0)
                    //     );
                    //   }
                  }}
                />
                <p>
                  {new Date(rentTransact!.formonth).toLocaleString("default", {
                    month: "long",
                  })}
                  -
                  {new Date(rentTransact!.formonth).toLocaleString("default", {
                    year: "numeric",
                  })}
                </p>
                <div className="grow"></div>
                <p>&#8377;{rentTransact!.amount}</p>
              </div>
              {/* //   ))} */}

              <Separator />

              <div className="flex justify-between mt-2">
                <p>Rent</p>
                <p>&#8377;{amount}</p>
              </div>

              <div className="flex justify-between mt-2">
                <p>Interest</p>
                {/* <p>{parseInt((amount * 0.02).toString(), 0)}</p> */}
                <p>&#8377;0</p>
              </div>

              <div className="flex justify-between mt-2">
                <p>Penalty</p>
                {/* <p>{parseInt((amount * 0.05).toString(), 0)}</p> */}
                <p>&#8377;0</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Total</p>
                {/* <p>
                    {parseInt(
                      (amount + amount * 0.02 + amount * 0.05).toString(),
                      0
                    )}
                  </p> */}
                <p>&#8377;{amount.toString()}</p>
              </div>

              <div className="grid items-center gap-1.5 w-full mt-2">
                <Label htmlFor="bankname">Enter Bank Name</Label>
                <Input
                  id="bankname"
                  type="text"
                  className="w-full"
                  ref={banknameRef}
                />
              </div>

              <div className="grid items-center gap-1.5 w-full mt-2">
                <Label htmlFor="transactionid">Enter Transaction Id</Label>
                <Input
                  id="transactionid"
                  type="text"
                  className="w-full"
                  ref={transactionRef}
                />
              </div>
              <div className="mt-2">
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
                        <span>Transaction date</span>
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

              <div className="mt-2 flex gap-2 items-center">
                <Button
                  onClick={() => router.back()}
                  className="w-full mt-4 bg-rose-400 hover:bg-rose-600"
                >
                  Close
                </Button>
                {isPaying ? (
                  <Button
                    disabled
                    className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                  >
                    Loading....
                  </Button>
                ) : (
                  <Button
                    onClick={payfees}
                    className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                  >
                    Collect Rent
                  </Button>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};
export default CollectRent;
