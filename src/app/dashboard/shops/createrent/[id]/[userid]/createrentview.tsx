"use client";
import CreateRent from "@/action/rent/createrent";
import GetShop from "@/action/shop/getshop";
import GetNormalUser from "@/action/user/getnormalusers";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateRentSchema } from "@/schema/createrent";
import { user } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { format } from "date-fns";
import { handleNumberChange } from "@/utils/methods";
import { default as MulSelect } from "react-select";
import GetUser from "@/action/user/getuser";

interface CreateRentProps {
  shopid: number;
  userid: number;
}

const CreateRentPage = (props: CreateRentProps) => {
  const router = useRouter();
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  const [isLoading, setLoading] = useState<boolean>(true);
  const [shopData, setShopData] = useState<any>();

  const property = useRef<HTMLInputElement>(null);
  const shop = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const amount = useRef<HTMLInputElement>(null);
  const chargeone = useRef<HTMLInputElement>(null);
  const chargetwo = useRef<HTMLInputElement>(null);
  const chargeThree = useRef<HTMLInputElement>(null);

  const [duedate, setDueDate] = useState<number>(0);

  const [user, setUser] = useState<user>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const shopresponse = await GetShop({
        id: props.shopid,
      });
      if (shopresponse.status) {
        setShopData(shopresponse.data ?? null);
      }
      const normaluserresponse = await GetUser({
        id: props.userid,
      });

      if (normaluserresponse.status) {
        setUser(normaluserresponse.data!);
      }

      setLoading(false);
    };
    init();
  }, [props.shopid, props.userid]);

  const create = async () => {
    const result = safeParse(CreateRentSchema, {
      rent_amount: parseInt(amount.current?.value ?? "0"),
      rent_start_date: startDate,
      rent_end_date: endDate,
      due_date: duedate,
      userId: parseInt(props.userid.toString() ?? "0"),
    });

    if (result.success) {
      const createrent = await CreateRent({
        shopId: props.shopid,
        userId: parseInt(props.userid.toString() ?? "0"),
        createdById: createuserid,
        rent_amount: parseInt(amount.current?.value ?? "0"),
        rent_start_date: startDate!.toLocaleString(),
        rent_end_date: endDate!.toLocaleString(),
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
      });

      if (!createrent.status) return toast.error(createrent.message);
      toast.success("Shop rent created successfully");
      router.back();
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

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6">
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Add rent for Shop
        </h1>
        <p className="text-sm mt-4 mb-2">
          Get started by adding your shop&apos;s rant details below.
        </p>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500">GENERAL INFORMATION</p>

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
              <Label>Rent Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !startDate ?? "text-muted-foreground"
                    }`}
                  >
                    <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>Rent End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !endDate ?? "text-muted-foreground"
                    }`}
                  >
                    <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={amount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargeone">Late Fees</Label>
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
              <Label htmlFor="chargetwo">Interest</Label>
              <Input
                id="chargetwo"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={chargetwo}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargethree">Penalty</Label>
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
              <Label htmlFor="user">User</Label>
              <div className="bg-gray-100 py-2 px-2 rounded border text-sm">
                {user?.firstName} {user?.lastName} - {user?.contactone}
              </div>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="duedate">Due Date</Label>
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
          <Button className="w-full mt-4" onClick={create}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateRentPage;
