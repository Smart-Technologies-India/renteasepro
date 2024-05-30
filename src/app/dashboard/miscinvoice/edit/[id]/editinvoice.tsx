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
import {
  AccountPaymentMode,
  account_category,
  misc_invoice,
} from "@prisma/client";
import { handleDecimalChange, handleNumberChange } from "@/utils/methods";
import { default as MulSelect } from "react-select";
import { getCookie } from "cookies-next";
import { Textarea } from "@/components/ui/textarea";
import AllAccountCategorys from "@/action/account/getallaccountcategory";
import BackButton from "@/components/backbutton";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { ApiResponseType } from "@/models/response";
import CreateInvoice from "@/action/invoice/createinvoice";
import { InvoiceSchema } from "@/schema/createinvoice";
import GetInvoice from "@/action/invoice/getinvoice";
import UpdateAcount from "@/action/invoice/updateinvoice";

interface EditInvoiceProps {
  id: number;
}

const EditInvoice = (props: EditInvoiceProps) => {
  const router = useRouter();
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const [transcationDate, setTranscationDate] = useState<Date>();

  const amount = useRef<HTMLInputElement>(null);
  const amountTwo = useRef<HTMLInputElement>(null);
  const amountThree = useRef<HTMLInputElement>(null);

  const banknameRef = useRef<HTMLInputElement>(null);
  const transcationIdRef = useRef<HTMLInputElement>(null);
  const remarkRef = useRef<HTMLTextAreaElement>(null);

  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryIdtwo, setCategoryIdtwo] = useState<number>(0);
  const [categoryIdthree, setCategoryIdthree] = useState<number>(0);

  const [category, setCategory] = useState<account_category[]>([]);

  const [startDPop, setStartDPop] = useState<boolean>(false);

  const gstRef = useRef<HTMLInputElement>(null);
  const [placeOfSupply, setPlaceOfSupply] = useState<string>("");
  const customerAddressRef = useRef<HTMLTextAreaElement>(null);

  const cgstRef = useRef<HTMLInputElement>(null);
  const ugstRef = useRef<HTMLInputElement>(null);
  const igstRef = useRef<HTMLInputElement>(null);
  const cgstPercentRef = useRef<HTMLInputElement>(null);
  const igstPercentRef = useRef<HTMLInputElement>(null);
  const hsnRef = useRef<HTMLInputElement>(null);

  const remarkoneRef = useRef<HTMLTextAreaElement>(null);
  const remarktwoRef = useRef<HTMLTextAreaElement>(null);
  const remarkthreeRef = useRef<HTMLTextAreaElement>(null);

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

      const invoice = await GetInvoice({ id: props.id });

      if (invoice.status) {

        setTimeout(() => {
          nameRef.current!.value = invoice.data?.customername ?? "";
          contactRef.current!.value = invoice.data?.customercontact ?? "";
          gstRef.current!.value = invoice.data?.customergst ?? "";
          setPlaceOfSupply(invoice.data?.customerplaceofsupply ?? "");
          customerAddressRef.current!.value =
            invoice.data?.customeraddress ?? "";

          setCategoryId(invoice.data?.accountCategoryOneId ?? 0);
          amount.current!.value = invoice.data?.amount ?? "0";
          remarkoneRef.current!.value = invoice.data?.remark_cat_one ?? "";

          setCategoryIdtwo(invoice.data?.accountCategoryTwoId ?? 0);
          amountTwo.current!.value = invoice.data?.amount_two ?? "0";
          remarktwoRef.current!.value = invoice.data?.remark_cat_two ?? "";

          setCategoryIdthree(invoice.data?.accountCategoryThreeId ?? 0);
          amountThree.current!.value = invoice.data?.amount_three ?? "0";
          remarkthreeRef.current!.value = invoice.data?.remark_cat_three ?? "";

          setTranscationDate(new Date(invoice.data?.transaction_date ?? ""));

          setPaymentMode(invoice.data?.paymentmode ?? AccountPaymentMode.NEFT);

          transcationIdRef.current!.value = invoice.data?.transactionid ?? "";
          banknameRef.current!.value = invoice.data?.bankname ?? "";
          hsnRef.current!.value = invoice.data?.hsn ?? "";

          cgstRef.current!.value = invoice.data?.cgst ?? "0";
          ugstRef.current!.value = invoice.data?.ugst ?? "0";
          igstRef.current!.value = invoice.data?.igst ?? "0";

          if (invoice.data?.cgst_percent == "9") {
            cgstPercentRef.current!.value = invoice.data?.cgst_percent ?? "0";
          } else {
            igstPercentRef.current!.value = invoice.data?.cgst_percent ?? "0";
          }

          remarkRef.current!.value = invoice.data?.remarks ?? "";
        }, 500);
      }

      setLoading(false);
    };
    init();
  }, []);

  const getCgestPercent = (): string => {
    const cgstpercent = cgstPercentRef.current?.value;
    const igstpercent = igstPercentRef.current?.value;
    if (cgstpercent && cgstpercent != "0" && cgstpercent != "") {
      return cgstpercent ?? "0";
    } else {
      return igstpercent ?? "0";
    }
  };

  const amounttogst = (amount: number): string => {
    const tempamount: number = amount;

    const cgest = cgstPercentRef.current?.value;
    const igest = igstPercentRef.current?.value;

    if (cgest && cgest != "0" && cgest != "") {
      const percentage: number = parseInt(cgest ?? "0");
      const value = amount * ((percentage * 2) / (100 + percentage * 2));

      return (tempamount - value).toFixed(2);
    } else {
      const percentage: number = parseInt(igest ?? "0");
      return (tempamount - (amount * percentage) / (100 + percentage)).toFixed(
        2
      );
    }
  };

  const update = async () => {
    setIsCreating(true);

    const result = safeParse(InvoiceSchema, {
      customername: nameRef.current?.value,
      customergst: gstRef.current?.value,
      customerplaceofsupply: placeOfSupply,
      accountCategoryId: categoryId,
      paymentmode: paymentMode,
      transaction_date: transcationDate,
      amount: parseInt(amount.current?.value ?? "0"),
      hsn: hsnRef.current?.value,
      cgst: cgstRef.current?.value ?? "0",
      igst: igstRef.current?.value ?? "0",
      ugst: ugstRef.current?.value ?? "0",
      cgst_percent: getCgestPercent(),
    });

    if (result.success) {
      const accountrespone: ApiResponseType<misc_invoice | null> =
        await UpdateAcount({
          id: props.id,
          createdById: createuserid,
          accountCategoryId: result.output.accountCategoryId,
          accountCategoryIdTwo: categoryIdtwo,
          accountCategoryIdThree: categoryIdthree,
          amount: amounttogst(result.output.amount),
          amountTwo: amounttogst(parseInt(amountTwo.current?.value ?? "0")),
          amountThree: amounttogst(parseInt(amountThree.current?.value ?? "0")),
          bankname: banknameRef.current?.value,
          customercontact: contactRef.current?.value,
          customername: result.output.customername,
          customeraddress: customerAddressRef.current?.value,
          customergst: result.output.customergst,
          customerplaceofsupply: result.output.customerplaceofsupply,
          paymentmode: result.output.paymentmode,
          remarks: remarkRef.current?.value,
          transaction_date: result.output.transaction_date,
          transactionid: transcationIdRef.current?.value,
          hsn: result.output.hsn,
          cgst: result.output.cgst,
          igst: result.output.igst,
          ugst: result.output.ugst,
          cgst_percent: result.output.cgst_percent,
          remarkOne: remarkoneRef.current?.value,
          remarkTwo: remarktwoRef.current?.value,
          remarkThree: remarkthreeRef.current?.value,
        });
      if (accountrespone.status) {
        toast.success(accountrespone.message);
        router.back();
      } else {
        toast.error(accountrespone.message);
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

    setIsCreating(false);
  };

  const getcgest = () => {
    const amtone = amount.current?.value ? parseInt(amount.current?.value) : 0;
    const amttwo = amountTwo.current?.value
      ? parseInt(amountTwo.current?.value)
      : 0;
    const amtthree = amountThree.current?.value
      ? parseInt(amountThree.current?.value)
      : 0;

    const totalamount = amtone + amttwo + amtthree;

    const cgest = parseInt(cgstPercentRef.current?.value ?? "0");

    return (totalamount * (cgest * 2)) / (100 + cgest * 2) / 2;
  };
  const getigest = () => {
    const amtone = amount.current?.value ? parseInt(amount.current?.value) : 0;
    const amttwo = amountTwo.current?.value
      ? parseInt(amountTwo.current?.value)
      : 0;
    const amtthree = amountThree.current?.value
      ? parseInt(amountThree.current?.value)
      : 0;

    const totalamount = amtone + amttwo + amtthree;

    const igest = parseInt(igstPercentRef.current?.value ?? "0");
    return (totalamount * igest) / (100 + igest);
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
            <p className="text-gray-500 text-xl">Edit Misc Receipt</p>
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
              <Label htmlFor="contact">Contact Number</Label>
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
              <Label htmlFor="customergst">
                Customer GST <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="customergst"
                type="text"
                className="w-full bg-gray-100"
                ref={gstRef}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="customerplaceofsupply">
                Place Of Supply <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                value={{
                  value: placeOfSupply,
                  label: placeOfSupply,
                }}
                defaultValue={placeOfSupply}
                options={[
                  {
                    value: "26-Dadra and Nagar Haveli and Daman and Diu",
                    label: "26-Dadra and Nagar Haveli and Daman and Diu",
                  },
                  {
                    value: "24-Gujarat",
                    label: "24-Gujarat",
                  },
                  {
                    value: "27-Maharashtra",
                    label: "27-Maharashtra",
                  },
                  {
                    value: "07-Delhi",
                    label: "07-Delhi",
                  },
                ]}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setPlaceOfSupply(val.value);
                }}
              />
            </div>
          </div>

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="address">Customer Address</Label>
            <Textarea
              id="address"
              className="w-full bg-gray-100 resize-none"
              ref={customerAddressRef}
            />
          </div>

          {/* category one start here */}
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="category">
                Category One <span className="text-rose-500">*</span>
              </Label>
              <MulSelect
                isMulti={false}
                value={
                  category.find((u) => u.id === categoryId)
                    ? {
                        value: categoryId,
                        label: category.find((u) => u.id === categoryId)?.name,
                      }
                    : null
                }
                options={category.map((u: account_category) => ({
                  value: u.id,
                  label: u.name,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setCategoryId(val.value);
                }}
              />
            </div>

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">
                Amount One<span className="text-rose-500">*</span>
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
          {/* category one end here */}

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="reamarkone">Remark One</Label>
            <Textarea
              id="reamarkone"
              className="w-full bg-gray-100 resize-none"
              ref={remarkoneRef}
            />
          </div>
          {/* category two start here */}
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="category">Category Two</Label>
              <MulSelect
                isMulti={false}
                value={
                  categoryIdtwo
                    ? {
                        value: categoryIdtwo,
                        label: category.find((u) => u.id === categoryIdtwo)
                          ?.name,
                      }
                    : null
                }
                options={category.map((u: account_category) => ({
                  value: u.id,
                  label: u.name,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setCategoryIdtwo(val.value);
                }}
              />
            </div>

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">Amount Two</Label>
              <Input
                id="amount"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={amountTwo}
              />
            </div>
          </div>
          {/* category two end here */}
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="reamarktwo">Remark Two</Label>
            <Textarea
              id="reamarktwo"
              className="w-full bg-gray-100 resize-none"
              ref={remarktwoRef}
            />
          </div>
          {/* category three start here */}
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="category">Category Three</Label>
              <MulSelect
                isMulti={false}
                value={
                  categoryIdthree
                    ? {
                        value: categoryIdthree,
                        label: category.find((u) => u.id === categoryIdthree)
                          ?.name,
                      }
                    : null
                }
                options={category.map((u: account_category) => ({
                  value: u.id,
                  label: u.name,
                }))}
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setCategoryIdthree(val.value);
                }}
              />
            </div>

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="amount">Amount Three</Label>
              <Input
                id="amount"
                type="text"
                className="w-full bg-gray-100"
                onChange={handleNumberChange}
                ref={amountThree}
              />
            </div>
          </div>
          {/* category three end here */}
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="reamarkthree">Remark Three</Label>
            <Textarea
              id="reamarkthree"
              className="w-full bg-gray-100 resize-none"
              ref={remarkthreeRef}
            />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Transaction Date <span className="text-rose-500">*</span>
              </Label>
              <Popover open={startDPop} onOpenChange={setStartDPop}>
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
                    onSelect={(e) => {
                      setTranscationDate(e);
                      setStartDPop(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
              <Label htmlFor="transactionid">Transaction Id</Label>
              <Input
                id="transactionid"
                type="text"
                className="w-full bg-gray-100"
                ref={transcationIdRef}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bankname">Bank Name</Label>
              <Input
                id="bankname"
                type="text"
                className="w-full bg-gray-100"
                ref={banknameRef}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="hsn">HSN</Label>
              <Input
                id="hsn"
                type="text"
                className="w-full bg-gray-100"
                ref={hsnRef}
                onChange={handleDecimalChange}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="cgstpercent">CGST/UGST Percent</Label>
              <Input
                id="cgstpercent"
                type="text"
                className="w-full bg-gray-100"
                ref={cgstPercentRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const onlyDecimalRegex = /^[0-9.]*$/;
                  const { value } = event.target;
                  if (!onlyDecimalRegex.test(value)) {
                    event.target.value = event.target.value.slice(0, -1);
                  }
                  igstPercentRef.current!.value = "0";
                  igstRef.current!.value = "0";
                  cgstRef.current!.value = getcgest().toFixed(2).toString();
                  ugstRef.current!.value = getcgest().toFixed(2).toString();
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="cgstpercent">IGST Percent</Label>
              <Input
                id="igstpercent"
                type="text"
                className="w-full bg-gray-100"
                ref={igstPercentRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const onlyDecimalRegex = /^[0-9.]*$/;
                  const { value } = event.target;
                  if (!onlyDecimalRegex.test(value)) {
                    event.target.value = event.target.value.slice(0, -1);
                  }
                  cgstPercentRef.current!.value = "0";
                  cgstRef.current!.value = "0";
                  ugstRef.current!.value = "0";
                  igstRef.current!.value = getigest().toFixed(2).toString();
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="cgst">CGST</Label>
              <Input
                id="cgst"
                type="text"
                className="w-full bg-gray-100"
                ref={cgstRef}
                disabled
                onChange={handleDecimalChange}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="ugst">UGST</Label>
              <Input
                id="ugst"
                type="text"
                className="w-full bg-gray-100"
                ref={ugstRef}
                disabled
                onChange={handleDecimalChange}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="igst">IGST</Label>
              <Input
                id="igst"
                type="text"
                className="w-full bg-gray-100"
                disabled
                ref={igstRef}
                onChange={handleDecimalChange}
              />
            </div>
          </div>

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="remark">Remark</Label>
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
              Updating Invoice...
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d]"
              onClick={update}
            >
              Update
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
export default EditInvoice;
