"use client";

import CreateBid from "@/action/bid/bidcreate";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CreateBidSchema } from "@/schema/createbid";
import { PercentageType, RefundType } from "@prisma/client";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { TimePicker } from "antd";
import axios from "axios";
import GetShop from "@/action/shop/getshop";
import Link from "next/link";
import { longtext } from "@/utils/methods";
import UploadFile from "@/action/file_upload/uploadfile";
import AddFileBid from "@/action/bid/addbidfile";
import BackButton from "@/components/backbutton";

interface CreateBidPageProps {
  shopid: number;
  uploadurl: string;
}

function setTime(date: Date, timeString: string): Date | void {
  // Parse the time string to get hours and minutes
  const parts = timeString.match(/(\d+):(\d+) (am|pm)/i);
  if (!parts) {
    toast.error("Invalid time format");
    return;
  }
  const hours = parseInt(parts[1], 10);
  const minutes = parseInt(parts[2], 10);
  const period = parts[3].toLowerCase();

  // Convert hours to 24-hour format if necessary
  let newHours = hours;
  if (period === "pm" && hours < 12) {
    newHours += 12;
  } else if (period === "am" && hours === 12) {
    newHours = 0;
  }

  // Create a new Date object based on the original date
  const newDate = new Date(date.getTime());
  // Set the new time on the new date object
  newDate.setHours(newHours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0); // Optionally set seconds to 0
  newDate.setMilliseconds(0); // Optionally set milliseconds to 0

  return newDate;
}

const CreateBidPage = (props: CreateBidPageProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [deadlineDate, setDeadlineDate] = useState<Date>();
  const [startDPop, setStartDPop] = useState<boolean>(false);
  const [endDPop, setEndDPop] = useState<boolean>(false);
  const [deadlineDPop, setDeadlineDPop] = useState<boolean>(false);

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const instructions = useRef<HTMLTextAreaElement>(null);
  const minbid = useRef<HTMLInputElement>(null);
  const [bidinc, setBidinc] = useState<PercentageType>(PercentageType.AMOUNT);
  const minbidinc = useRef<HTMLInputElement>(null);
  const feesamount = useRef<HTMLInputElement>(null);
  const [fees, setFees] = useState<PercentageType>(PercentageType.AMOUNT);
  const [feesrefundable, setFeesrefundable] = useState<RefundType>(
    RefundType.NONREFUNDABLE
  );
  const emdamount = useRef<HTMLInputElement>(null);
  const [emd, setEmd] = useState<PercentageType>(PercentageType.AMOUNT);
  const [emdrefundable, setEmdrefundable] = useState<RefundType>(
    RefundType.REFUNDABLE
  );

  const bgamount = useRef<HTMLInputElement>(null);
  const [bg, setBg] = useState<PercentageType>(PercentageType.AMOUNT);
  const [bgrefundable, setBgrefundable] = useState<RefundType>(
    RefundType.REFUNDABLE
  );

  enum Exempt {
    YES = "YES",
    NO = "NO",
  }
  const [exempt, setExempt] = useState<Exempt>(Exempt.NO);

  enum BidType {
    AUCTION = "AUCTION",
    TENDER = "TENDER",
  }
  const [bidType, setBidType] = useState<BidType>(BidType.TENDER);

  const exemptfeesamount = useRef<HTMLInputElement>(null);
  const exemptemdamount = useRef<HTMLInputElement>(null);
  const exemptbgamount = useRef<HTMLInputElement>(null);

  const [exemptfees, setExemptFees] = useState<PercentageType>(
    PercentageType.AMOUNT
  );
  const [exemptemd, setExemptEmd] = useState<PercentageType>(
    PercentageType.AMOUNT
  );
  const [exemptbg, setExemptbg] = useState<PercentageType>(
    PercentageType.AMOUNT
  );

  const doctitle = useRef<HTMLInputElement>(null);
  const docdescription = useRef<HTMLTextAreaElement>(null);
  const filenumber = useRef<HTMLInputElement>(null);
  const filesubject = useRef<HTMLTextAreaElement>(null);

  const items = [
    {
      id: "forwomen",
      label: "For Women",
    },
    {
      id: "category",
      label: "For Reserved Category",
    },
    {
      id: "abled",
      label: "For Differently Abled",
    },
    {
      id: "msme",
      label: "For MSME",
    },
    {
      id: "tribal",
      label: "For Tribal",
    },
    {
      id: "scst",
      label: "For SC/ST",
    },
  ] as const;

  const [field, setField] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const exemptitems = [
    {
      id: "forwomen",
      label: "For Women",
    },
    {
      id: "category",
      label: "For Reserved Category",
    },
    {
      id: "abled",
      label: "For Differently Abled",
    },
    {
      id: "msme",
      label: "For MSME",
    },
  ] as const;

  const [exemptfield, setExamptField] = useState<string[]>([]);

  const exemptsections = [
    {
      id: "fees",
      label: "Exempt Fees",
    },
    {
      id: "emd",
      label: "Exempt EMD",
    },
    {
      id: "bg",
      label: "Exempt BG",
    },
  ] as const;

  const [exemptsectionsvalue, setExemptsectionsvalue] = useState<string[]>([]);

  const [shop, setShop] = useState<any>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const shopresponse = await GetShop({ id: props.shopid });
      if (shopresponse.status) {
        setShop(shopresponse.data);
      }

      setLoading(false);
    };
    init();
  }, [props.shopid]);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [fileUploader, setFileUploader] = useState<File | null>(null);
  const cFileUploader = useRef<HTMLInputElement>(null);

  const create = async () => {
    setIsCreating(true);
    const result = safeParse(CreateBidSchema, {
      title: title.current?.value,
      min_bid_amount: parseInt(minbid.current?.value ?? "0"),
      bidincrementamount: bidinc as PercentageType,
      min_bid_increment: parseInt(minbidinc.current?.value ?? "0"),
      fees_amount: parseInt(feesamount.current?.value ?? "0"),
      fees: fees as PercentageType,
      fees_refundable: feesrefundable as RefundType,
      emd_amount: parseInt(emdamount.current?.value ?? "0"),
      emd: emd as PercentageType,
      emd_refundable: emdrefundable as RefundType,
      bg_amount: parseInt(bgamount.current?.value ?? "0"),
      bg: bg as PercentageType,
      bg_refundable: bgrefundable as RefundType,
      startTime: startTime,
      endTime: endTime,
      bidstartdate: setTime(startDate!, startTime),
      bidenddate: setTime(endDate!, endTime),
      biddeclarationdate: deadlineDate,
    });

    if (result.success) {
      if (
        parseInt(minbid.current?.value!) < parseInt(minbidinc.current?.value!)
      ) {
        toast.error(
          "Minimum bid increment should be less than minimum bid amount"
        );
        setIsCreating(false);
        return;
      }

      if (
        parseInt(minbid.current?.value!) < parseInt(feesamount.current?.value!)
      ) {
        toast.error("Fees amount should be less than minimum bid amount");
        setIsCreating(false);
        return;
      }

      if (
        parseInt(minbid.current?.value!) < parseInt(emdamount.current?.value!)
      ) {
        toast.error("EMD amount should be less than minimum bid amount");
        setIsCreating(false);
        return;
      }

      if (
        parseInt(minbid.current?.value!) < parseInt(bgamount.current?.value!)
      ) {
        toast.error("BG amount should be less than minimum bid amount");
        setIsCreating(false);
        return;
      }

      if (exempt === Exempt.YES && exemptfield.length == 0) {
        toast.error("Please select at least one exempt category");
        setIsCreating(false);
        return;
      }

      if (exempt == Exempt.YES && exemptsectionsvalue.length == 0) {
        toast.error("Please select at least one exempt section");
        setIsCreating(false);
        return;
      }

      if (exemptsectionsvalue.includes("fees") && !exemptfeesamount.current) {
        toast.error("Please enter exempt fees amount");
        setIsCreating(false);
        return;
      }

      if (exemptsectionsvalue.includes("emd") && !exemptemdamount.current) {
        toast.error("Please enter exempt EMD amount");
        setIsCreating(false);
        return;
      }

      if (exemptsectionsvalue.includes("bg") && !exemptbgamount.current) {
        toast.error("Please enter exempt bg amount");
        setIsCreating(false);
        return;
      }

      if (fileUploader == null) {
        toast.error("Please upload a file");
        setIsCreating(false);
        return;
      }

      let extrafields: any = {};
      if (exempt === Exempt.YES && exemptsectionsvalue.includes("fees")) {
        extrafields["exempt_fees_amount"] = parseInt(
          exemptfeesamount.current?.value ?? "0"
        );
        extrafields["exempt_fees"] = exemptfees;
      }

      if (exempt === Exempt.YES && exemptsectionsvalue.includes("emd")) {
        extrafields["exempt_emd_amount"] = parseInt(
          exemptemdamount.current?.value ?? "0"
        );
        extrafields["exempt_emd"] = exemptemd;
      }

      if (exempt === Exempt.YES && exemptsectionsvalue.includes("bg")) {
        extrafields["exempt_bg_amount"] = parseInt(
          exemptbgamount.current?.value ?? "0"
        );
        extrafields["exempt_bg"] = exemptbg;
      }

      const createbid = await CreateBid({
        title: result.output.title,
        description: description.current?.value,
        instruction: instructions.current?.value,
        min_bid_amount: result.output.min_bid_amount,
        bidincrementamount: result.output.bidincrementamount,
        min_bid_increment: result.output.min_bid_increment,
        fees_amount: result.output.fees_amount,
        fees: result.output.fees,
        fees_refundable: result.output.fees_refundable,
        emd_amount: result.output.emd_amount,
        emd: result.output.emd,
        emd_refundable: result.output.emd_refundable,
        bg_amount: result.output.bg_amount,
        bg: result.output.bg,
        bg_refundable: result.output.bg_refundable,
        bidstartdate: result.output.bidstartdate,
        bidenddate: result.output.bidenddate,
        biddeclarationdate: result.output.biddeclarationdate,
        createdById: userid,
        shopId: props.shopid,
        is_woman: field.includes("forwomen"),
        is_reserved: field.includes("category"),
        is_differently_abled: field.includes("abled"),
        is_msme: field.includes("msme"),
        is_exemption: exempt == Exempt.YES,
        is_auction: bidType == BidType.AUCTION,
        is_sc_st: field.includes("scst"),
        is_tribal: field.includes("tribal"),
        is_open: isOpen,
        exemptfield: exemptfield,
        exemptsectionsvalue: exemptsectionsvalue,
        ...extrafields,
        is_fees_exempt_allowed:
          exempt === Exempt.YES && exemptsectionsvalue.includes("fees"),
        is_emd_exempt_allowed:
          exempt === Exempt.YES && exemptsectionsvalue.includes("emd"),
        is_bg_exempt_allowed:
          exempt === Exempt.YES && exemptsectionsvalue.includes("bg"),
        docone: doctitle.current?.value,
        doconedescription: docdescription.current?.value,
        t_and_c_file_number: filenumber.current?.value,
        t_and_c_description: filesubject.current?.value,
      });

      if (!createbid.status) {
        toast.error(createbid.message);
        setIsCreating(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", fileUploader!);

      const uploadfile = await axios.post(props.uploadurl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadfile.status != 200) {
        toast.error("File upload failed");
        setIsCreating(false);
        return;
      }

      const uploadfileResponse = await UploadFile({
        name: doctitle.current?.value!,
        path: uploadfile.data.filePath,
        createdById: userid,
        bidId: createbid.data?.id,
      });

      await AddFileBid({
        id: createbid.data?.id!,
        t_and_c_upload: uploadfileResponse.data?.path,
      });

      if (!uploadfileResponse.status) {
        toast.error("File upload failed");
        setIsCreating(false);
        return;
      }

      toast.success("Bid added successfully");
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
    setIsCreating(false);
  };

  const handleFileChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setFun: (value: SetStateAction<File | null>) => void
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 5) {
      setFun((val) => value!.target.files![0]);
      // if (value!.target.files![0].type.startsWith("image/")) {
      //   setFun((val) => value!.target.files![0]);
      // } else {
      //   toast.error("Please select a file.", { theme: "light" });
      // }
    } else {
      toast.error("File size must be less then 5 mb", { theme: "light" });
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
        <div className="flex gap-4">
          <BackButton />
          <h1 className="text-[#162f57] text-2xl font-semibold">Create Bid</h1>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500 text-center">General Information</p>

          <Separator />

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="propertes">Property Name </Label>
              <div className="rounded-sm w-full p-2 bg-gray-100 border">
                {shop.property.name}
              </div>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>Shop Number</Label>
              <div className="rounded-sm w-full p-2 bg-gray-100 border">
                {shop.shopNumber}
              </div>
            </div>
          </div>

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="title">
              Bid Title <span className="text-rose-500">*</span>
            </Label>
            <Input id="title" type="text" className="w-full" ref={title} />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="description">
              Bid Description{" "}
              <span className="text-[0.50rem] font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              className="w-full h-20 resize-none"
              ref={description}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="instructions">
              Bid Instructions{" "}
              <span className="text-[0.50rem] font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="instructions"
              className="w-full h-20 resize-none"
              ref={instructions}
            />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="starttime">
                Start Date <span className="text-rose-500">*</span>
              </Label>

              <Popover open={startDPop} onOpenChange={setStartDPop}>
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
                    disabled={(date) => date < new Date() || endDate! <= date}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">
                Start Time <span className="text-rose-500">*</span>
              </Label>
              <TimePicker
                minuteStep={15}
                use12Hours
                format="h:mm a"
                size="large"
                onChange={(time) => {
                  setStartTime(time.format("h:mm a"));
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="enddatetime">
                End Date Time <span className="text-rose-500">*</span>
              </Label>
              <Popover open={endDPop} onOpenChange={setEndDPop}>
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
                    disabled={(date) => date < new Date() || startDate! >= date}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">
                End Time <span className="text-rose-500">*</span>
              </Label>
              <TimePicker
                minuteStep={15}
                use12Hours
                format="h:mm a"
                size="large"
                onChange={(time) => {
                  setEndTime(time.format("h:mm a"));
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="enddatetime">
                Document Deadline Date <span className="text-rose-500">*</span>
              </Label>
              <Popover open={deadlineDPop} onOpenChange={setDeadlineDPop}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !deadlineDate ?? "text-muted-foreground"
                    }`}
                  >
                    <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                    {deadlineDate ? (
                      format(deadlineDate, "PPP")
                    ) : (
                      <span>Select deadline date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadlineDate}
                    onSelect={(e) => {
                      setDeadlineDate(e);
                      setDeadlineDPop(false);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date() || endDate! > date}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full mt-4">
              <Label htmlFor="exempt">
                Exempt <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                defaultValue="exempt"
                className="flex gap-2 mt-2"
                id="exempt"
                value={exempt}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="YES"
                    id="exempt1"
                    onClick={() => setExempt(Exempt.YES)}
                  />
                  <Label
                    htmlFor="exempt1"
                    className="cursor-pointer"
                    onClick={() => setExempt(Exempt.YES)}
                  >
                    YES
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="NO"
                    id="exempt2"
                    onClick={() => setExempt(Exempt.NO)}
                  />
                  <Label
                    htmlFor="exempt2"
                    className="cursor-pointer"
                    onClick={() => setExempt(Exempt.NO)}
                  >
                    NO
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="w-full mt-4">
              <Label htmlFor="exempt">
                Bid Type <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                className="flex gap-2 mt-2"
                id="bid_type"
                value={bidType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="AUCTION"
                    id="bid_type1"
                    onClick={() => setBidType(BidType.AUCTION)}
                  />
                  <Label
                    htmlFor="bid_type1"
                    className="cursor-pointer"
                    onClick={() => setBidType(BidType.AUCTION)}
                  >
                    AUCTION
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="TENDER"
                    id="bid_type2"
                    onClick={() => setBidType(BidType.TENDER)}
                  />
                  <Label
                    htmlFor="bid_type2"
                    className="cursor-pointer"
                    onClick={() => setBidType(BidType.TENDER)}
                  >
                    TENDER
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {exempt === Exempt.YES && (
            <>
              <p className="text-gray-500 mt-4 text-center">Exempt</p>
              <Separator />
              <div className="flex gap-x-4 gap-y-2 flex-wrap items-center my-4">
                <p className="text-gray-500">Select Exempt Category :</p>
                {exemptitems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center ">
                    <Checkbox
                      id={item.id.toString()}
                      checked={exemptfield.includes(item.id)}
                      onCheckedChange={(value) => {
                        if (value) {
                          setExamptField((prev) => [...prev, item.id]);
                        } else {
                          setExamptField((prev) =>
                            prev.filter((x) => x !== item.id)
                          );
                        }
                      }}
                    />

                    <Label
                      className="text-sm font-normal cursor-pointer"
                      htmlFor={item.id.toString()}
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-x-4 gap-y-2 flex-wrap items-center my-4">
                <p className="text-gray-500">Select Exempt Section : </p>
                {exemptsections.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center ">
                    <Checkbox
                      id={item.id.toString()}
                      checked={exemptsectionsvalue.includes(item.id)}
                      onCheckedChange={(value) => {
                        if (value) {
                          setExemptsectionsvalue((prev) => [...prev, item.id]);
                        } else {
                          setExemptsectionsvalue((prev) =>
                            prev.filter((x) => x !== item.id)
                          );
                        }
                      }}
                    />

                    <Label
                      className="text-sm font-normal cursor-pointer"
                      htmlFor={item.id.toString()}
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>

              {/* exempt fees start here */}
              {exemptsectionsvalue.includes("fees") && (
                <div className="flex gap-4">
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="exemptfeespa">
                      Exempt Fees % / Amount
                      <span className="text-rose-500">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue="AMOUNT"
                      className="flex gap-2"
                      id="exemptfeespa"
                      value={exemptfees}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="PERCENTAGE"
                          id="exemptfeesp"
                          onClick={() =>
                            setExemptFees(PercentageType.PERCENTAGE)
                          }
                        />
                        <Label
                          htmlFor="exemptfeesp"
                          className="cursor-pointer"
                          onClick={() =>
                            setExemptFees(PercentageType.PERCENTAGE)
                          }
                        >
                          By Percentage
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="AMOUNT"
                          id="exemptfeesa"
                          onClick={() => setExemptFees(PercentageType.AMOUNT)}
                        />
                        <Label
                          htmlFor="exemptfeesa"
                          className="cursor-pointer"
                          onClick={() => setExemptFees(PercentageType.AMOUNT)}
                        >
                          By Amount
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="exemptfees">
                      Exempt Fees Amount{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="exemptfees"
                      type="text"
                      className="w-full bg-gray-100"
                      ref={exemptfeesamount}
                    />
                  </div>
                </div>
              )}

              {/* exempt fees end here */}

              {/* exempt emd start here */}
              {exemptsectionsvalue.includes("emd") && (
                <div className="flex gap-4">
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="exemptemdpa">
                      Exempt EMD % / Amount{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue="AMOUNT"
                      className="flex gap-2"
                      id="exemptemdpa"
                      value={exemptemd}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="PERCENTAGE"
                          id="exemptemdp"
                          onClick={() =>
                            setExemptEmd(PercentageType.PERCENTAGE)
                          }
                        />
                        <Label
                          htmlFor="exemptemd"
                          className="cursor-pointer"
                          onClick={() =>
                            setExemptEmd(PercentageType.PERCENTAGE)
                          }
                        >
                          By Percentage
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="AMOUNT"
                          id="exemptemda"
                          onClick={() => setExemptEmd(PercentageType.AMOUNT)}
                        />
                        <Label
                          htmlFor="exemptemda"
                          className="cursor-pointer"
                          onClick={() => setExemptEmd(PercentageType.AMOUNT)}
                        >
                          By Amount
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="exemptemd">
                      Exempt EMD Amount <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="exemptemd"
                      type="text"
                      className="w-full bg-gray-100"
                      ref={exemptemdamount}
                    />
                  </div>
                </div>
              )}

              {/* exempt emd end here */}

              {/* exempt bg start here */}
              {exemptsectionsvalue.includes("bg") && (
                <div className="flex gap-4 mb-4">
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="exemptbgpa">
                      Exempt BG % / Amount{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue="AMOUNT"
                      className="flex gap-2"
                      id="exemptbgpa"
                      value={exemptbg}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="PERCENTAGE"
                          id="exemptbgp"
                          onClick={() => setExemptbg(PercentageType.PERCENTAGE)}
                        />
                        <Label
                          htmlFor="exemptbgp"
                          className="cursor-pointer"
                          onClick={() => setExemptbg(PercentageType.PERCENTAGE)}
                        >
                          By Percentage
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="AMOUNT"
                          id="exemptbga"
                          onClick={() => setExemptbg(PercentageType.AMOUNT)}
                        />
                        <Label
                          htmlFor="exemptbga"
                          className="cursor-pointer"
                          onClick={() => setExemptbg(PercentageType.AMOUNT)}
                        >
                          By Amount
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="exemptbg">
                      Exempt BG Amount <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="exemptbg"
                      type="text"
                      className="w-full bg-gray-100"
                      ref={exemptbgamount}
                    />
                  </div>
                </div>
              )}

              {/* exempt bg end here */}
            </>
          )}

          <p className="text-gray-500 mt-4 text-center">Fees Structure </p>
          <Separator />

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">Minimum Bid</Label>
              <Input id="minbid" type="text" className="w-full" ref={minbid} />
            </div>
            {/* <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bidinc">Bid Increment % / Amount</Label>
              <RadioGroup
                defaultValue="AMOUNT"
                className="flex gap-2"
                id="bidinc"
                value={bidinc}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="AMOUNT"
                    id="r2"
                    onClick={() => setBidinc(PercentageType.AMOUNT)}
                  />
                  <Label
                    htmlFor="r2"
                    className="cursor-pointer"
                    onClick={() => setBidinc(PercentageType.AMOUNT)}
                  >
                    By Amount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="PERCENTAGE"
                    id="r1"
                    onClick={() => setBidinc(PercentageType.PERCENTAGE)}
                  />
                  <Label
                    htmlFor="r1"
                    className="cursor-pointer"
                    onClick={() => setBidinc(PercentageType.PERCENTAGE)}
                  >
                    By Percentage
                  </Label>
                </div>
              </RadioGroup>
            </div> */}
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">
                Min Bid Increment <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="minbid"
                type="text"
                className="w-full"
                ref={minbidinc}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feesamount">
                Fees Amount <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="feesamount"
                type="text"
                className="w-full"
                ref={feesamount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feespercentage">
                Fees % / Amount <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                defaultValue="feesbypercentage"
                className="flex gap-2"
                id="feespercentage"
                value={fees}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="AMOUNT"
                    id="fr2"
                    onClick={() => setFees(PercentageType.AMOUNT)}
                  />
                  <Label
                    htmlFor="fr2"
                    className="cursor-pointer"
                    onClick={() => setFees(PercentageType.AMOUNT)}
                  >
                    By Amount
                  </Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="PERCENTAGE"
                    id="fr1"
                    onClick={() => setFees(PercentageType.PERCENTAGE)}
                  />
                  <Label
                    htmlFor="fr1"
                    className="cursor-pointer"
                    onClick={() => setFees(PercentageType.PERCENTAGE)}
                  >
                    By Percentage
                  </Label>
                </div> */}
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feespercentage">
                Is Fees Refundable <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                defaultValue="no"
                className="flex gap-2"
                id="feespercentage"
                value={feesrefundable}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="REFUNDABLE"
                    id="rr1"
                    onClick={() => setFeesrefundable(RefundType.REFUNDABLE)}
                  />
                  <Label
                    htmlFor="rr1"
                    className="cursor-pointer"
                    onClick={() => setFeesrefundable(RefundType.REFUNDABLE)}
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="NONREFUNDABLE"
                    id="rr2"
                    onClick={() => setFeesrefundable(RefundType.NONREFUNDABLE)}
                  />
                  <Label
                    htmlFor="rr2"
                    className="cursor-pointer"
                    onClick={() => setFeesrefundable(RefundType.NONREFUNDABLE)}
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdamount">
                EMD Amount <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="emdamount"
                type="text"
                className="w-full"
                ref={emdamount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdpercentage">
                EMD % / Amount <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                defaultValue="emdbypercentage"
                className="flex gap-2"
                id="emdpercentage"
                value={emd}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="AMOUNT"
                    id="emdr2"
                    onClick={() => setEmd(PercentageType.AMOUNT)}
                  />
                  <Label
                    htmlFor="emdr2"
                    className="cursor-pointer"
                    onClick={() => setEmd(PercentageType.AMOUNT)}
                  >
                    By Amount
                  </Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="PERCENTAGE"
                    id="emdr1"
                    onClick={() => setEmd(PercentageType.PERCENTAGE)}
                  />
                  <Label
                    htmlFor="emdr1"
                    className="cursor-pointer"
                    onClick={() => setEmd(PercentageType.PERCENTAGE)}
                  >
                    By Percentage
                  </Label>
                </div> */}
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdpercentage">
                Is EMD Refundable <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                defaultValue="yes"
                className="flex gap-2"
                id="emdpercentage"
                value={emdrefundable}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="REFUNDABLE"
                    id="emdrr1"
                    onClick={() => setEmdrefundable(RefundType.REFUNDABLE)}
                  />
                  <Label
                    htmlFor="emdrr1"
                    className="cursor-pointer"
                    onClick={() => setEmdrefundable(RefundType.REFUNDABLE)}
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="NONREFUNDABLE"
                    id="emdrr2"
                    onClick={() => setEmdrefundable(RefundType.NONREFUNDABLE)}
                  />
                  <Label
                    htmlFor="emdrr2"
                    className="cursor-pointer"
                    onClick={() => setEmdrefundable(RefundType.NONREFUNDABLE)}
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgamount">
                BG Amount <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="bgamount"
                type="text"
                className="w-full"
                ref={bgamount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgpercentage">
                BG % / Amount <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                id={"bgpercentage"}
                defaultValue="bgbypercentage"
                className="flex gap-2"
                value={bg}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="AMOUNT"
                    id="bgfr2"
                    onClick={() => setBg(PercentageType.AMOUNT)}
                  />
                  <Label
                    htmlFor="bgfr2"
                    className="cursor-pointer"
                    onClick={() => setBg(PercentageType.AMOUNT)}
                  >
                    By Amount
                  </Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="PERCENTAGE"
                    id="bgfr1"
                    onClick={() => setBg(PercentageType.PERCENTAGE)}
                  />
                  <Label
                    htmlFor="bgfr1"
                    className="cursor-pointer"
                    onClick={() => setBg(PercentageType.PERCENTAGE)}
                  >
                    By Percentage
                  </Label>
                </div> */}
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgpercentage">
                Is BG Refundable <span className="text-rose-500">*</span>
              </Label>
              <RadioGroup
                defaultValue="yes"
                className="flex gap-2"
                id="bgpercentage"
                value={bgrefundable}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="REFUNDABLE"
                    id="bgrr1"
                    onClick={() => setBgrefundable(RefundType.REFUNDABLE)}
                  />
                  <Label
                    htmlFor="bgrr1"
                    className="cursor-pointer"
                    onClick={() => setBgrefundable(RefundType.REFUNDABLE)}
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="NONREFUNDABLE"
                    id="bgrr2"
                    onClick={() => setBgrefundable(RefundType.NONREFUNDABLE)}
                  />
                  <Label
                    htmlFor="bgrr2"
                    className="cursor-pointer"
                    onClick={() => setBgrefundable(RefundType.NONREFUNDABLE)}
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <p className="text-gray-500 mt-4 text-center">Document Required</p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="doctitle">
              Document Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="doctitle"
              type="text"
              className="w-full"
              ref={doctitle}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="docdescription">
              Document Description <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="docdescription"
              className="w-full h-20 resize-none"
              ref={docdescription}
            />
          </div>

          <p className="text-gray-500 mt-4 text-center">
            Terms & Conditions Document <span className="text-rose-500">*</span>
          </p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filenumber">
              File Number <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="filenumber"
              type="text"
              className="w-full"
              ref={filenumber}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filesubject">
              File Subject <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="filesubject"
              className="w-full h-20 resize-none"
              ref={filesubject}
            />
          </div>

          <div className="flex gap-4 mt-4 items-center">
            <Label htmlFor="termfile">
              Terms & Conditions File <span className="text-rose-500">*</span>
            </Label>
            <Button
              onClick={() => cFileUploader.current?.click()}
              variant={"secondary"}
            >
              {fileUploader == null ? "Upload File" : "Change File"}
            </Button>

            {fileUploader != null && (
              <Link
                target="_blank"
                href={URL.createObjectURL(fileUploader!)}
                className="bg-gray-100 text-black py-1 px-4 rounded-md text-sm h-10 grid place-items-center"
              >
                View File
              </Link>
            )}
            <p className="text-sm">
              {fileUploader != null
                ? longtext(fileUploader.name, 20)
                : "No File Selected"}
            </p>

            <div className="hidden">
              <Input
                type="file"
                ref={cFileUploader}
                accept="*/*"
                onChange={(val) => handleFileChange(val, setFileUploader)}
              />
            </div>
          </div>

          <p className="text-gray-500 mt-4">
            Select Bidder Category <span className="text-rose-500">*</span>
          </p>
          <div className="flex gap-x-6 gap-y-4 flex-wrap mt-2">
            <div className="flex gap-2 mt-1 items-center ">
              <Checkbox
                id={"isopen"}
                checked={isOpen}
                onCheckedChange={(value) => {
                  if (value) {
                    setIsOpen(true);

                    setField([]);
                  } else {
                    setIsOpen(false);
                  }
                }}
              />

              <Label
                className="text-sm font-normal cursor-pointer"
                htmlFor={`isopen`}
              >
                Open Bid
              </Label>
            </div>

            {isOpen == false &&
              items.map((item, index) => (
                <div key={index} className="flex gap-2 mt-1 items-center ">
                  <Checkbox
                    id={`${item.id.toString()}1`}
                    checked={field.includes(item.id)}
                    onCheckedChange={(value) => {
                      if (value) {
                        setField((prev) => [...prev, item.id]);
                      } else {
                        setField((prev) => prev.filter((x) => x !== item.id));
                      }
                    }}
                  />

                  <Label
                    className="text-sm font-normal cursor-pointer"
                    htmlFor={`${item.id.toString()}1`}
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
          </div>

          {isCreating ? (
            <Button
              disabled
              className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
            >
              Loading...
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
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
export default CreateBidPage;
