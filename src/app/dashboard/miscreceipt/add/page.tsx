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
import { useRouter } from "next/navigation";
import { AccountPaymentMode, account_category, user } from "@prisma/client";
import { handleNumberChange } from "@/utils/methods";
import { default as MulSelect } from "react-select";
import GetNormalUser from "@/action/user/getnormalusers";
import { getCookie } from "cookies-next";
import { Textarea } from "@/components/ui/textarea";
import AllAccountCategorys from "@/action/account/getallaccountcategory";
import BackButton from "@/components/backbutton";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { AccountSchema } from "@/schema/createaccount";
import { ApiResponseType } from "@/models/response";

const CreateRentPage = () => {
  const router = useRouter();
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const [transcationDate, setTranscationDate] = useState<Date>();

  const amount = useRef<HTMLInputElement>(null);

  const banknameRef = useRef<HTMLInputElement>(null);
  const transcationIdRef = useRef<HTMLInputElement>(null);
  const remarkRef = useRef<HTMLTextAreaElement>(null);

  const [categoryId, setCategoryId] = useState<number>(0);

  const [category, setCategory] = useState<account_category[]>([]);

  const paymentModes = [
    "CASH",
    "CHEQUE",
    "RTGS",
    "NEFT",
    "DD",
    "UPI",
    "ERECEIPT",
    "BANKTRANSFER",
    "BANKGUARANTEE",
    "OTHER",
  ];

  const [paymentMode, setPaymentMode] = useState<AccountPaymentMode>(
    AccountPaymentMode.NEFT
  );

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const accountcategoryresponse = await AllAccountCategorys({});

      if (accountcategoryresponse.status) {
        setCategory(accountcategoryresponse.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, []);

  const create = async () => {
    setIsCreating(true);



    const result = safeParse(AccountSchema, {
      customername: nameRef.current?.value,
      customercontact: contactRef.current?.value,
      accountCategoryId: categoryId,
      paymentmode: paymentMode,
      transaction_date: transcationDate,
      amount: amount.current?.value,
      transactionid: transcationIdRef.current?.value,
      bankname: banknameRef.current?.value,
      remarks: remarkRef.current?.value,
    });

    if (result.success) {
      // const loginrespone: ApiResponseType<user | null> = await CreateAccountCategory({
      //   password: result.output.password,
      //   contactone: result.output.contactone,
      // });
      // if (loginrespone.status) {
      //   toast.success(loginrespone.message);
      //   router.back();
      // } else {
      //   toast.error(loginrespone.message);
      // }
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
          <div className="flex gap-4">
            <BackButton />
            <p className="text-gray-500 text-xl">Create Misc Receipt</p>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="name">
                Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                className="w-full bg-gray-100"
                ref={nameRef}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="contact">
                Contact Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="contact"
                type="text"
                className="w-full bg-gray-100"
                ref={contactRef}
                maxLength={10}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="category">
                Category <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={category.map((u: account_category) => ({
                  value: u.id,
                  label: u.name,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setCategoryId(val);
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="mode">
                Payment Mode <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                options={paymentModes.map((u: string) => ({
                  value: u,
                  label: u,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setPaymentMode(val.value);
                }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Transaction Date <span className="text-rose-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !transcationDate ?? "text-muted-foreground"
                    }`}
                  >
                    <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                    {transcationDate ? (
                      format(transcationDate, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={transcationDate}
                    onSelect={setTranscationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">
                Amount <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="amount"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={amount}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="transactionid">
                Transaction Id <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="transactionid"
                type="text"
                className="w-full bg-gray-100"
                ref={transcationIdRef}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bankname">
                Bank Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="bankname"
                type="text"
                className="w-full bg-gray-100"
                ref={banknameRef}
              />
            </div>
          </div>

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="remark">
              Remark <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="remark"
              className="w-full bg-gray-100 resize-none"
              ref={remarkRef}
            />
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
