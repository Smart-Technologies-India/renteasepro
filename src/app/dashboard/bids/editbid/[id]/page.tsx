"use client";

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
import { ExemptFor, PercentageType, RefundType } from "@prisma/client";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { TimePicker } from "antd";
import axios from "axios";
import GetShop from "@/action/shop/getshop";
import Link from "next/link";
import { longtext } from "@/utils/methods";
import GetBid from "@/action/bid/getbid";

import dayjs, { Dayjs } from "dayjs";
import CreateCorrigendum from "@/action/corrigendum/createcorrigendum";
import EditBid from "@/action/bid/editbid";
import BackButton from "@/components/backbutton";
import GetDateTime from "@/action/getdatetime";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { decryptURLData } from "@/utils/methods";

function setTime(date: Date, timeString: string): Date {
  // Parse the time string to get hours and minutes
  const parts = timeString.match(/(\d+):(\d+) (am|pm)/i);
  if (!parts) {
    toast.error("Invalid time format");
    return new Date();
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

const UpdateBidPage = () => {
  const router = useRouter();
  const param = useParams();

  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);

  const [userid, setUserid] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

  const [showCorrigendum, setShowCorrigendum] = useState<boolean>(false);

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

  const ctitle = useRef<HTMLInputElement>(null);
  const cdescription = useRef<HTMLTextAreaElement>(null);

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

  // const [bid, setBid] = useState<any>();
  const [shop, setShop] = useState<any>();

  const [editAll, setEditAll] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const current_date = new Date();
      setLoading(true);
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);
      const bidresponse = await GetBid({ id: id });

      // if (bidresponse.status) {
      //   setBid(bidresponse.data);
      // }

      const shopresponse = await GetShop({ id: bidresponse.data.shopId });

      if (shopresponse.status) {
        setShop(shopresponse.data);
      }

      if (current_date < new Date(bidresponse.data.bidstartdate)) {
        setEditAll(true);
      }

      setTimeout(() => {
        title.current!.value = bidresponse.data?.title;
        description.current!.value = bidresponse.data?.description;
        instructions.current!.value = bidresponse.data?.instruction;
        minbid.current!.value = bidresponse.data?.min_bid_amount;
        minbidinc.current!.value = bidresponse.data?.min_bid_increment;
        feesamount.current!.value = bidresponse.data?.fees_amount;
        emdamount.current!.value = bidresponse.data?.emd_amount;
        bgamount.current!.value = bidresponse.data?.bg_amount;
        setStartDate(new Date(bidresponse.data.bidstartdate));
        setEndDate(new Date(bidresponse.data.bidenddate));
        setDeadlineDate(new Date(bidresponse.data.biddeclarationdate));
        setStartTime(dayjs(bidresponse.data.bidstartdate));
        setEndTime(dayjs(bidresponse.data.bidenddate));

        doctitle.current!.value = bidresponse.data?.docone;
        docdescription.current!.value = bidresponse.data?.doconedescription;
        filenumber.current!.value = bidresponse.data?.t_and_c_file_number;
        filesubject.current!.value = bidresponse.data?.t_and_c_description;

        setBidType(
          bidresponse.data.is_auction ? BidType.AUCTION : BidType.TENDER
        );

        setFees(
          bidresponse.data.fees
            ? PercentageType.PERCENTAGE
            : PercentageType.AMOUNT
        );
        setEmd(
          bidresponse.data.emd
            ? PercentageType.PERCENTAGE
            : PercentageType.AMOUNT
        );
        setBg(
          bidresponse.data.bg
            ? PercentageType.PERCENTAGE
            : PercentageType.AMOUNT
        );
        setFeesrefundable(
          bidresponse.data.fees_refundable
            ? RefundType.REFUNDABLE
            : RefundType.NONREFUNDABLE
        );
        setEmdrefundable(
          bidresponse.data.emd_refundable
            ? RefundType.REFUNDABLE
            : RefundType.NONREFUNDABLE
        );
        setBgrefundable(
          bidresponse.data.bg_refundable
            ? RefundType.REFUNDABLE
            : RefundType.NONREFUNDABLE
        );

        setExempt(bidresponse.data.is_exemption ? Exempt.YES : Exempt.NO);

        if (bidresponse.data.is_exemption) {
          for (let i = 0; i < bidresponse.data.exempt.length; i++) {
            if (bidresponse.data.exempt[i].emd_for == ExemptFor.WOMEN) {
              setExamptField((prev) => [...prev, "forwomen"]);
            } else if (
              bidresponse.data.exempt[i].emd_for == ExemptFor.RESERVED
            ) {
              setExamptField((prev) => [...prev, "category"]);
            } else if (
              bidresponse.data.exempt[i].emd_for == ExemptFor.DIFFERENTLY_ABLED
            ) {
              setExamptField((prev) => [...prev, "abled"]);
            } else if (bidresponse.data.exempt[i].emd_for == ExemptFor.MSME) {
              setExamptField((prev) => [...prev, "msme"]);
            }
          }

          const exemptdata = bidresponse.data.exempt[0];

          if (exemptdata.is_bg_exempt_allowed) {
            setExemptsectionsvalue((prev) => [...prev, "bg"]);
            setExemptbg(exemptdata.bg);
            setTimeout(() => {
              exemptbgamount.current!.value = exemptdata.bgamount.toString();
            }, 200);
          }

          if (exemptdata.is_emd_exempt_allowed) {
            setExemptsectionsvalue((prev) => [...prev, "emd"]);
            setExemptEmd(exemptdata.emd);
            setTimeout(() => {
              exemptemdamount.current!.value = exemptdata.emdamount.toString();
            }, 200);
          }

          if (exemptdata.is_fees_exempt_allowed) {
            setExemptsectionsvalue((prev) => [...prev, "fees"]);
            setExemptFees(exemptdata.fees);
            setTimeout(() => {
              exemptfeesamount.current!.value =
                exemptdata.feesamount.toString();
            }, 200);
          }
        }

        setIsOpen(bidresponse.data.is_open);

        if (bidresponse.data.is_woman) {
          setField((prev) => [...prev, "forwomen"]);
        }
        if (bidresponse.data.is_reserved) {
          setField((prev) => [...prev, "category"]);
        }
        if (bidresponse.data.is_differently_abled) {
          setField((prev) => [...prev, "abled"]);
        }
        if (bidresponse.data.is_msme) {
          setField((prev) => [...prev, "msme"]);
        }
        if (bidresponse.data.is_tribal) {
          setField((prev) => [...prev, "tribal"]);
        }
        if (bidresponse.data.is_sc_st) {
          setField((prev) => [...prev, "scst"]);
        }
      }, 1000);

      const getcurrentdate = await GetDateTime({});
      if (getcurrentdate.status) {
        if (
          new Date(getcurrentdate.data!) <
          new Date(bidresponse.data.bidstartdate)
        ) {
          setShowCorrigendum(true);
        }
      }
      setLoading(false);
    };
    init();
  }, [id]);

  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  const [cFile, setCFile] = useState<File | null>(null);
  const ccFile = useRef<HTMLInputElement>(null);

  const editbid = async () => {
    if (showCorrigendum) {
      if (
        ctitle.current?.value == "" ||
        ctitle.current?.value == null ||
        ctitle.current?.value == undefined
      ) {
        return toast.error("Title is required");
      }

      if (
        cdescription.current?.value == "" ||
        cdescription.current?.value == null ||
        cdescription.current?.value == undefined
      ) {
        return toast.error("Description is required");
      }

      if (cFile == null) {
        return toast.error("Please upload a file");
      }
    }

    const result = safeParse(CreateBidSchema, {
      title: title.current?.value,
      description: description.current?.value,
      instruction: instructions.current?.value,
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
      startTime: startTime?.format("h:mm a"),
      endTime: endTime?.format("h:mm a"),
      bidstartdate: setTime(startDate!, startTime?.format("h:mm a")!),
      bidenddate: setTime(endDate!, endTime?.format("h:mm a")!),
      biddeclarationdate: deadlineDate,
    });

    if (result.success) {
      if (
        parseInt(minbid.current?.value!) < parseInt(minbidinc.current?.value!)
      ) {
        return toast.error(
          "Minimum bid increment should be less than minimum bid amount"
        );
      }

      if (
        parseInt(minbid.current?.value!) < parseInt(feesamount.current?.value!)
      ) {
        return toast.error(
          "Fees amount should be less than minimum bid amount"
        );
      }

      if (
        parseInt(minbid.current?.value!) < parseInt(emdamount.current?.value!)
      ) {
        return toast.error("EMD amount should be less than minimum bid amount");
      }

      if (
        parseInt(minbid.current?.value!) < parseInt(bgamount.current?.value!)
      ) {
        return toast.error("BG amount should be less than minimum bid amount");
      }

      if (exempt === Exempt.YES && exemptfield.length == 0) {
        return toast.error("Please select at least one exempt category");
      }

      if (exempt == Exempt.YES && exemptsectionsvalue.length == 0) {
        return toast.error("Please select at least one exempt section");
      }

      if (exemptsectionsvalue.includes("fees") && !exemptfeesamount.current) {
        return toast.error("Please enter exempt fees amount");
      }

      if (exemptsectionsvalue.includes("emd") && !exemptemdamount.current) {
        return toast.error("Please enter exempt emd amount");
      }

      if (exemptsectionsvalue.includes("bg") && !exemptbgamount.current) {
        return toast.error("Please enter exempt bg amount");
      }

      // if (fileUploader == null) {
      //   return toast.error("Please upload a file");
      // }

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

      const createbid = await EditBid({
        id: id,
        title: result.output.title,
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
        shopId: shop.id,
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
      });
      if (!createbid.status) {
        return toast.error(createbid.message);
      }

      if (showCorrigendum) {
        const formData = new FormData();
        formData.append("file", cFile!);

        const uploadfile = await axios.post(process.env.UPLOAD_URL!, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadfile.status != 200) {
          return toast.error("File upload failed");
        }

        const createresponse = await CreateCorrigendum({
          bidId: id,
          name: ctitle.current?.value!,
          description: cdescription.current?.value!,
          path: uploadfile.data.filePath,
          createdById: userid,
        });

        if (!createresponse.status) {
          return toast.error("Corrigendum creation failed");
        }
      }

      toast.success("Bid updated successfully");
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

  const handleFileChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setFun: (value: SetStateAction<File | null>) => void
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 5) {
      if (value!.target.files![0].type.startsWith("image/")) {
        setFun((val) => value!.target.files![0]);
      } else {
        toast.error("Please select a file.", { theme: "light" });
      }
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
        <div className="flex gap-2">
          <BackButton />
          <h1 className="text-[#162f57] text-2xl font-semibold">Edit Bid</h1>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500 text-center">General Information</p>

          <Separator />

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="propertes">Property Name</Label>
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
            <Label htmlFor="title">Bid Title</Label>
            <Input id="title" type="text" className="w-full" ref={title} />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="description">Bid Description</Label>
            <Textarea
              id="description"
              className="w-full h-20 resize-none"
              ref={description}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="instructions">Bid Instructions</Label>
            <Textarea
              id="instructions"
              className="w-full h-20 resize-none"
              ref={instructions}
            />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="starttime">Start Date</Label>

              <Popover open={startDPop} onOpenChange={setStartDPop}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      startDate ? "" : "text-muted-foreground"
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
              <Label htmlFor="minbid">Start Time</Label>
              <TimePicker
                minuteStep={15}
                use12Hours
                format="h:mm a"
                size="large"
                value={startTime}
                onChange={(time) => {
                  setStartTime(time);
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="enddatetime">End Date Time</Label>
              <Popover open={endDPop} onOpenChange={setEndDPop}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      endDate ? "" : "text-muted-foreground"
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
              <Label htmlFor="minbid">End Time</Label>
              <TimePicker
                minuteStep={15}
                use12Hours
                format="h:mm a"
                size="large"
                value={endTime}
                onChange={(time) => {
                  setEndTime(time);
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="enddatetime">Document Deadline Date</Label>
              <Popover open={deadlineDPop} onOpenChange={setDeadlineDPop}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      deadlineDate ? "" : "text-muted-foreground"
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
                    autoFocus
                    disabled={(date) => date < new Date() || endDate! > date}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="exempt">Exempt</Label>
              <RadioGroup
                defaultValue="exempt"
                className="flex gap-2"
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

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="exempt">Bid Type</Label>
              <RadioGroup className="flex gap-2" id="bid_type" value={bidType}>
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
                    <Label htmlFor="exemptfeespa">Exempt Fees % / Amount</Label>
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
                    <Label htmlFor="exemptfees">Exempt Fees Amount</Label>
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
                    <Label htmlFor="exemptemdpa">Exempt EMD % / Amount</Label>
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
                    <Label htmlFor="exemptemd">Exempt EMD Amount</Label>
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
                    <Label htmlFor="exemptbgpa">Exempt BG % / Amount</Label>
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
                    <Label htmlFor="exemptbg">Exempt BG Amount</Label>
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

          <p className="text-gray-500 mt-4 text-center">Fees Structure</p>
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
              <Label htmlFor="minbid">Min Bid Increment</Label>
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
              <Label htmlFor="feesamount">Fees Amount</Label>
              <Input
                id="feesamount"
                type="text"
                className="w-full"
                ref={feesamount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feespercentage">Fees % / Amount</Label>
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
                <div className="flex items-center space-x-2">
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
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feespercentage">Is Fees Refundable</Label>
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
              <Label htmlFor="emdamount">EMD Amount</Label>
              <Input
                id="emdamount"
                type="text"
                className="w-full"
                ref={emdamount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdpercentage">EMD % / Amount</Label>
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
                <div className="flex items-center space-x-2">
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
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdpercentage">Is EMD Refundable</Label>
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
              <Label htmlFor="bgamount">BG Amount</Label>
              <Input
                id="bgamount"
                type="text"
                className="w-full"
                ref={bgamount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgpercentage">BG % / Amount</Label>
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
                <div className="flex items-center space-x-2">
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
                </div>
              </RadioGroup>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgpercentage">Is BG Refundable</Label>
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
            <Label htmlFor="doctitle">Document Title</Label>
            <Input
              id="doctitle"
              type="text"
              className="w-full"
              ref={doctitle}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="docdescription">Document Description</Label>
            <Textarea
              id="docdescription"
              className="w-full h-20 resize-none"
              ref={docdescription}
            />
          </div>

          <p className="text-gray-500 mt-4 text-center">
            Terms & Conditions Document
          </p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filenumber">File Number</Label>
            <Input
              id="filenumber"
              type="text"
              className="w-full"
              ref={filenumber}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filesubject">File Subject</Label>
            <Textarea
              id="filesubject"
              className="w-full h-20 resize-none"
              ref={filesubject}
            />
          </div>

          {/* <div className="flex gap-4 mt-4 items-center">
            <Label htmlFor="termfile">Terms & Conditions File</Label>
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
                onChange={(val) => handleFileChange(val, setFileUploader)}
                />
                </div>
              </div> */}

          <p className="text-gray-500 mt-4">Select Bidder Category</p>
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

          {showCorrigendum && (
            <>
              <p className="text-gray-500 mt-4 text-center">Corrigendum</p>
              <Separator />

              <div className="grid items-center gap-1.5 w-full mt-4">
                <Label htmlFor="ctitle">Title</Label>
                <Input
                  id="ctitle"
                  type="text"
                  className="w-full"
                  ref={ctitle}
                />
              </div>
              <div className="grid items-center gap-1.5 w-full mt-4">
                <Label htmlFor="cdescription">Description</Label>
                <Textarea
                  id="cdescription"
                  className="w-full h-20 resize-none"
                  ref={cdescription}
                />
              </div>

              <div className="flex gap-4 mt-4 items-center">
                <Label htmlFor="termfile">Corrigendum File</Label>
                <Button
                  onClick={() => ccFile.current?.click()}
                  variant={"secondary"}
                >
                  {cFile == null ? "Upload File" : "Change File"}
                </Button>

                {cFile != null && (
                  <Link
                    target="_blank"
                    href={URL.createObjectURL(cFile!)}
                    className="bg-gray-100 text-black py-1 px-4 rounded-md text-sm h-10 grid place-items-center"
                  >
                    View File
                  </Link>
                )}
                <p className="text-sm">
                  {cFile != null
                    ? longtext(cFile.name, 20)
                    : "No File Selected"}
                </p>

                <div className="hidden">
                  <Input
                    type="file"
                    ref={ccFile}
                    accept="*/*"
                    onChange={(val) => handleFileChange(val, setCFile)}
                  />
                </div>
              </div>
            </>
          )}

          <Button className="w-full mt-4" onClick={editbid}>
            Edit
          </Button>
        </div>
      </div>
    </>
  );
};
export default UpdateBidPage;
