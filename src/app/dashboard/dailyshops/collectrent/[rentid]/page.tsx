"use client";

import BackButton from "@/components/backbutton";
import { Separator } from "@/components/ui/separator";
import { formateDate } from "@/utils/methods";
import { daily_rent, daily_shop, rent_transact } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { customAlphabet } from "nanoid";
import { toast } from "react-toastify";
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
import GetDailyRentById from "@/action/dailyrent/getdailyrentbyid";
import PayDailyRent from "@/action/dailyrent/paydailyrent";
import { getCookie } from "cookies-next";

const CollectRent = () => {
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  const params = useParams<{ rentid: string }>();
  const rentid: number = parseInt(params.rentid);

  const router = useRouter();

  const [isPaying, setPaying] = useState<boolean>(false);


  const [isLoading, setLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<
    (daily_rent & { daily_shop: daily_shop }) | null
  >(null);

  const banknameRef = useRef<HTMLInputElement>(null);
  const transactionRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState<Date>();
  const [startDPop, setStartDPop] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const rentresponse = await GetDailyRentById({
        id: parseInt(rentid.toString()),
      });
      if (rentresponse.status) {
        setRent(rentresponse.data);
      }

      setLoading(false);
    };
    init();
  }, [rentid]);

  const payfees = async () => {
    const nanoid = customAlphabet("1234567890abcdef", 10);

    const uniqueid = nanoid();

    setLoading(true);
    setPaying(true);

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

    const payrent_response = await PayDailyRent({
      rentid: rentid,
      transactionid: transactionRef.current?.value ?? "",
      bankname: banknameRef.current?.value ?? "",
      orderid: uniqueid,
      startdate: startDate,
      approvedById: createuserid,
    });

    if (payrent_response.status) {
      toast.success(payrent_response.message);
    } else {
      setLoading(false);
      setPaying(false);
      toast.error(payrent_response.message);
      return;
    }

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
                Unit Name <br />
                <span className="text-sm text-gray-500 font-medium">
                  {/* {rent.shop.shopNumber < new Date() ? "Ended" : "Running"} */}
                  {rent?.daily_shop.name}
                </span>
              </p>

              <p className="text-xs leading-3">
                Event Start Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(rent?.event_from_date!)}
                </span>
              </p>

              <p className="text-xs leading-3">
                Event End Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(rent?.event_to_date!)}
                </span>
              </p>

              {rent?.prep_day && (
                <>
                  <p className="text-xs leading-3">
                    Prep Day <br />
                    <span className="text-sm text-gray-500 font-medium">
                      {formateDate(rent?.prep_day!)}
                    </span>
                  </p>
                </>
              )}

              {rent?.handover_day && (
                <>
                  <p className="text-xs leading-3">
                    Handover Day <br />
                    <span className="text-sm text-gray-500 font-medium">
                      {formateDate(rent?.handover_day!)}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1 text-sm">
            <p className="text-gray-500 text-center">Rent Payment</p>

            <Separator />

            <>
              <Separator />

              <div className="flex justify-between mt-2">
                <p>Rent</p>
                <p>&#8377;{rent?.event_amount}</p>
              </div>

              <div className="flex justify-between mt-2">
                <p>Deposit</p>
                <p>&#8377;{rent?.deposit_amount}</p>
              </div>

              <div className="flex justify-between mt-2">
                <p>Preparation Amount</p>
                <p>&#8377; {rent?.prep_day_amount}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Handover Amount</p>
                <p>&#8377; {rent?.handover_day_amount}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p>Total</p>

                <p>
                  &#8377;
                  {parseInt(rent?.event_amount ?? "0") +
                    parseInt(rent?.deposit_amount ?? "0") +
                    parseInt(rent?.prep_day_amount ?? "0") +
                    parseInt(rent?.handover_day_amount ?? "0")}
                </p>
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
