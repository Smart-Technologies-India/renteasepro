"use client";

import GetRent from "@/action/rent/getrent";
import BackButton from "@/components/backbutton";
import { Separator } from "@/components/ui/separator";
import { formateDate, decryptURLData } from "@/utils/methods";
import { rent, rent_transact, shop, user } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import GetUserRent from "@/action/rent_transact/getuserrent";
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
import { Textarea } from "@/components/ui/textarea";
import Settlerent from "@/action/shop/settlerent";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";

const CollectRent = () => {
  const [userid, setUserid] = useState<number>(0);


  const router = useRouter();
  const param = useParams();
  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const shopid: number = parseInt(encid);

  //   const [field, setField] = useState<number[]>([]);

  const [isPaying, setPaying] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<
    rent & { shop: shop; user: user; rent_transact: rent_transact[] }
  >();
  const [rentTransact, setRentTransact] = useState<rent_transact[]>([]);

  const banknameRef = useRef<HTMLInputElement>(null);
  const transactionRef = useRef<HTMLInputElement>(null);

  const [throughfd, setThroughfd] = useState<number | undefined>();
  const [letoffamount, setLetoffamount] = useState<number | undefined>();
  const [offlinepayment, setOfflinepayment] = useState<number | undefined>();

  const remarkRef = useRef<HTMLTextAreaElement>(null);

  const [startDate, setStartDate] = useState<Date>();
  const [startDPop, setStartDPop] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);

      const rentresponse = await GetRent({ id: parseInt(shopid.toString()) });
      if (rentresponse.status && rentresponse.data) {
        setRent(rentresponse.data);
      }

      const rentTransactresponse = await GetUserRent({ rentid: shopid });
      if (rentTransactresponse.status) {
        const res: rent_transact[] | undefined =
          rentTransactresponse.data?.filter(
            (val: rent_transact) => val.status != "DUE"
          );
        setRentTransact(res ?? []);
      }
      setLoading(false);
    };
    init();
  }, [shopid]);

  const closerent = async () => {
    setLoading(true);
    setPaying(true);

    let amt =
      rentTransact.reduce(
        (accumulator, currentValue) => accumulator + currentValue.amount,
        0
      ) -
      (throughfd ?? 0) -
      (letoffamount ?? 0) -
      (offlinepayment ?? 0);

    if (amt !== 0) {
      toast.error("Total Amount should be 0");
      setLoading(false);
      setPaying(false);
      return;
    }

    if (!remarkRef.current?.value) {
      toast.error("Remark is required name");
      setLoading(false);
      setPaying(false);
      return;
    }

    const closerent_response = await Settlerent({
      userid: rent?.userId!,
      rentid: rent?.id!,
      shopid: rent?.shopId!,
      currentuser: userid,
      fd_amount: throughfd ?? 0,
      letoff_amount: letoffamount ?? 0,
      offline_amount: offlinepayment ?? 0,
      bankname: banknameRef.current?.value,
      transactionid: transactionRef.current?.value ?? "",
      transaction_date: startDate?.toISOString(),
      remark: remarkRef.current?.value,
    });

    if (closerent_response.status) {
      toast.success(closerent_response.message);
    } else {
      setLoading(false);
      setPaying(false);
      toast.error(closerent_response.message);
      return;
    }

    setLoading(false);
    setPaying(false);
    router.back();
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
          <h1 className="text-[#162f57] text-2xl font-semibold">Settle Rent</h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="bankname">FD Adjust Amount</Label>
              <Input
                type="text"
                value={throughfd === undefined ? "" : throughfd.toString()}
                className="w-full"
                placeholder="Enter FD Amount"
                onChange={(e) => {
                  const onlyNumbersRegex = /^[0-9]*$/;
                  const { value } = e.target;

                  if (value === "") {
                    setThroughfd(undefined);
                  } else if (onlyNumbersRegex.test(value)) {
                    setThroughfd(parseInt(value, 10));
                  }
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="bankname">Let off Amount</Label>
              <Input
                type="text"
                className="w-full"
                value={
                  letoffamount === undefined ? "" : letoffamount.toString()
                }
                placeholder="Enter Let off Amount"
                onChange={(e) => {
                  const onlyNumbersRegex = /^[0-9]*$/;
                  const { value } = e.target;

                  if (value === "") {
                    setLetoffamount(undefined);
                  } else if (onlyNumbersRegex.test(value)) {
                    setLetoffamount(parseInt(value, 10));
                  }
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="bankname">Offline Payment Amount</Label>
              <Input
                type="text"
                className="w-full"
                value={
                  offlinepayment === undefined ? "" : offlinepayment.toString()
                }
                placeholder="Enter online Amount"
                onChange={(e) => {
                  const onlyNumbersRegex = /^[0-9]*$/;
                  const { value } = e.target;

                  if (value === "") {
                    setOfflinepayment(undefined);
                  } else if (onlyNumbersRegex.test(value)) {
                    setOfflinepayment(parseInt(value, 10));
                  }
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="bankname">Bank Name</Label>
              <Input
                id="bankname"
                type="text"
                className="w-full"
                ref={banknameRef}
                placeholder="Enter Bank Name"
              />
            </div>
            <Label htmlFor="transactionid">Transaction Id And Date</Label>
            <div className="flex gap-2 items-end">
              <div className="grid items-center gap-1.5 w-full mt-2 flex-1">
                <Input
                  id="transactionid"
                  type="text"
                  className="w-full"
                  ref={transactionRef}
                  placeholder="Enter Transaction Id"
                />
              </div>
              <div className="mt-2  flex-1">
                <Popover open={startDPop} onOpenChange={setStartDPop}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        startDate ? "text-gray-900" : "text-muted-foreground"
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
            </div>

            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="bankname">Remark</Label>
              <Textarea
                className="w-full h-20 resize-none"
                ref={remarkRef}
                placeholder="Enter remark"
              />
            </div>

            {isPaying ? (
              <Button
                disabled
                className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
              >
                Loading....
              </Button>
            ) : (
              <Button
                onClick={closerent}
                className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
              >
                Close Rent
              </Button>
            )}
          </div>
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1 text-sm">
            <p className="text-gray-500 text-center  font-semibold text-xl">
              Shop Information
            </p>
            <Separator />
            <div className="grid gap-4 mt-4 grid-cols-2">
              <p className="text-xs leading-3">
                Shop Number <br />
                <span className="text-sm text-gray-500 font-medium">
                  {/* {rent.shop.shopNumber < new Date() ? "Ended" : "Running"} */}
                  {rent!.shop.shopNumber}
                </span>
              </p>

              <p className="text-xs leading-3">
                Shop Size <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent!.shop.shopSize}
                  {/* {rent.shop.shopSize < new Date() ? "Ended" : "Running"} */}
                </span>
              </p>

              <p className="text-xs leading-3">
                Start Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rent!.rent_start_date))}
                </span>
              </p>

              <p className="text-xs leading-3">
                End Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rent!.rent_end_date))}
                </span>
              </p>

              <p className="text-xs leading-3">
                Rent Amount <br />
                <span className="text-sm text-gray-500 font-medium">
                  &#8377;{rent!.rent_amount}
                </span>
              </p>

              <p className="text-xs leading-3">
                Due Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent!.due_date}
                </span>
              </p>
            </div>
            <p className="text-gray-500 text-center mt-6 font-semibold text-xl">
              Rent Close Summary
            </p>

            <Separator />
            {rentTransact.length == 0 ? (
              <>
                <p className="p-1 bg-gray-100 rounded mt-4">No Rent Pending</p>
              </>
            ) : (
              <>
                <div className="mt-4 flex my-2">
                  <h1 className="">Pending Rent</h1>
                  <div className="grow"></div>
                  <p className="">
                    &#8377;
                    {rentTransact.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.amount,
                      0
                    )}{" "}
                    - ({rentTransact.length} Months)
                  </p>
                </div>
                <Separator />

                {rentTransact.map((item, index) => (
                  <div key={index} className="flex my-2 items-center gap-2">
                    <p>
                      {new Date(item.formonth).toLocaleString("default", {
                        month: "long",
                      })}
                      -
                      {new Date(item.formonth).toLocaleString("default", {
                        year: "numeric",
                      })}
                    </p>
                    <div className="grow"></div>
                    <p>&#8377;{item.amount}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between mt-2">
                  <p>Rent</p>
                  <p>
                    &#8377;
                    {rentTransact.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.amount,
                      0
                    )}
                  </p>
                </div>

                <div className="flex justify-between mt-2">
                  <p>Interest</p>
                  {/* <p>{parseInt((amount * 0.02).toString(), 0)}</p> */}
                  <p>&#8377;0</p>
                </div>

                <div className="flex justify-between mt-2">
                  <p>Penalty</p>
                  <p>&#8377;0</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Through FD</p>
                  <p>
                    -&#8377;
                    {throughfd ?? 0}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Let off Amount</p>
                  <p>
                    -&#8377;
                    {letoffamount ?? 0}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Offline Payment </p>
                  <p>
                    -&#8377;
                    {offlinepayment ?? 0}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Total</p>

                  <p>
                    &#8377;
                    {rentTransact.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.amount,
                      0
                    ) -
                      (throughfd ?? 0) -
                      (letoffamount ?? 0) -
                      (offlinepayment ?? 0)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default CollectRent;
