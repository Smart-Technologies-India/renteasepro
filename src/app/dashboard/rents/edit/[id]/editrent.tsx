"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { useRouter } from "next/navigation";
import { user } from "@prisma/client";
import { handleNumberChange, longtext } from "@/utils/methods";
import { default as MulSelect } from "react-select";
import GetRent from "@/action/rent/getrent";
import GetNormalUser from "@/action/user/getnormalusers";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import CreateCorrigendum from "@/action/corrigendum/createcorrigendum";
import EditRent from "@/action/rent/editrent";
import { getCookie } from "cookies-next";

interface EditRentProps {
  id: number;
}

const EditRentPage = (props: EditRentProps) => {
  const currentuserid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);

  const property = useRef<HTMLInputElement>(null);
  const shop = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const amount = useRef<HTMLInputElement>(null);
  const chargeone = useRef<HTMLInputElement>(null);
  const chargetwo = useRef<HTMLInputElement>(null);
  const chargeThree = useRef<HTMLInputElement>(null);

  const [duedate, setDueDate] = useState<number>(0);
  const [userid, setUserid] = useState<number>(0);

  const [rent, setRent] = useState<any>();

  const [user, setUsers] = useState<user[]>([]);

  const ctitle = useRef<HTMLInputElement>(null);
  const cdescription = useRef<HTMLTextAreaElement>(null);

  const [cFile, setCFile] = useState<File | null>(null);
  const ccFile = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const rentresponse = await GetRent({ id: props.id });

      if (rentresponse.status) {
        const rent = rentresponse.data;
        setRent(rent!);
        if (rent) {
          setStartDate(new Date(rent.rent_start_date));
          setEndDate(new Date(rent.rent_end_date));
          setDueDate(rent.due_date);
          setUserid(rent.userId);

          setTimeout(() => {
            amount.current!.value = rent.rent_amount.toString();
            chargeone.current!.value = rent.chargeone?.toString() ?? "0";
            chargetwo.current!.value = rent.chargetwo?.toString() ?? "0";
            chargeThree.current!.value = rent.chargethree?.toString() ?? "0";
          }, 1000);
        }
      }

      const normaluserresponse = await GetNormalUser({});

      if (normaluserresponse.status) {
        setUsers(normaluserresponse.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, [props.id]);

  const edit = async () => {
    if (!startDate) return toast.error("Please select start date");
    if (!endDate) return toast.error("Please select end date");
    if (!amount.current?.value || amount.current?.value == "")
      return toast.error("Please enter amount");
    if (!chargeone.current?.value || chargeone.current?.value == "")
      return toast.error("Please enter late fees");
    if (!chargetwo.current?.value || chargetwo.current?.value == "")
      return toast.error("Please enter interest");
    if (!chargeThree.current?.value || chargeThree.current?.value == "")
      return toast.error("Please enter penalty");
    if (!userid) return toast.error("Please select user");
    if (!duedate) return toast.error("Please select due date");

    if (
      ctitle.current?.value == "" ||
      ctitle.current?.value == null ||
      ctitle.current?.value == undefined
    )
      return toast.error("Title is required");

    if (
      cdescription.current?.value == "" ||
      cdescription.current?.value == null ||
      cdescription.current?.value == undefined
    )
      return toast.error("Description is required");

    if (cFile == null) return toast.error("Please upload a file");

    const createrent = await EditRent({
      id: props.id,
      userId: userid,
      createdById: parseInt(currentuserid.toString() ?? "0"),
      rent_amount: parseInt(amount.current?.value ?? "0"),
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

    const formData = new FormData();
    formData.append("file", cFile);

    const uploadfile = await axios.post(process.env.UPLOAD_LINK!, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (uploadfile.status != 200) {
      return toast.error("File upload failed");
    }

    const createresponse = await CreateCorrigendum({
      rentId: props.id,
      name: ctitle.current?.value!,
      description: cdescription.current?.value!,
      path: uploadfile.data.filePath,
      createdById: userid,
    });

    if (!createresponse.status) {
      return toast.error("Corrigendum creation failed");
    }

    router.back();
    toast.success("Rent updated successfully");
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
        <h1 className="text-[#162f57] text-2xl font-semibold">Edit for Shop</h1>

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
                value={rent?.shop.property?.name}
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
                value={rent?.shop?.shopNumber}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>Rent Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal cursor-not-allowed bg-gray-100 ${
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
                    disabled
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal cursor-not-allowed bg-gray-100 ${
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
                className="w-full"
                onChange={handleNumberChange}
                ref={amount}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargeone">Late Fees</Label>
              <Input
                id="chargeone"
                type="text"
                className="w-full"
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
                className="w-full"
                onChange={handleNumberChange}
                ref={chargetwo}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="chargethree">Penalty</Label>
              <Input
                id="chargethree"
                type="text"
                className="w-full"
                onChange={handleNumberChange}
                ref={chargeThree}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="user">User</Label>
              <MulSelect
                isMulti={false}
                options={user.map((u: user) => ({
                  value: u.contactone,
                  label: u.contactone,
                }))}
                className="w-full accent-slate-900"
                inputValue={rent?.user?.contactone ?? ""}
                onChange={(val: any) => {
                  if (!val) return;
                  const userdata = user.find(
                    (u: user) => u.contactone === val.value
                  );
                  if (userdata) {
                    setUserid(userdata.id);
                  }
                }}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="duedate">Due Date</Label>
              <MulSelect
                isMulti={false}
                options={Array.from({ length: 31 }, (_, i) => ({
                  value: i + 1,
                  label: i + 1,
                }))}
                inputValue={rent?.due_date.toString() ?? ""}
                defaultInputValue="Select Due Date"
                className="w-full accent-slate-900"
                onChange={(val: any) => {
                  if (!val) return;
                  setDueDate(parseInt(val.value.toString()));
                }}
              />
            </div>
          </div>
          <p className="text-gray-500 mt-4 text-center">Corrigendum</p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="ctitle">Title</Label>
            <Input id="ctitle" type="text" className="w-full" ref={ctitle} />
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
              {cFile != null ? longtext(cFile.name, 20) : "No File Selected"}
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
          <Button className="w-full mt-4" onClick={edit}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};
export default EditRentPage;
