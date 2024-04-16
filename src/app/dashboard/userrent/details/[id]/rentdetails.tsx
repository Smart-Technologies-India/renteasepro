"use client";
import GetRent from "@/action/rent/getrent";
import GetUserRent from "@/action/rent_transact/getuserrent";
import PayRent from "@/action/rent_transact/payrent";
import BackButton from "@/components/backbutton";
import { AntDesignCheckOutlined } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { formateDate, longtext } from "@/utils/methods";
import { rent_transact } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios";
import UploadFile from "@/action/file_upload/uploadfile";
import GetRentTran from "@/action/rent_transact/getrenttransact";

interface UserRentDetailsViewProps {
  id: number;
}

const UserRentDetailsView = (props: UserRentDetailsViewProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const [field, setField] = useState<number[]>([]);
  const router = useRouter();

  const [isPaying, setPaying] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(0);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<any>();
  const [rentTransact, setRentTransact] = useState<rent_transact[]>([]);

  const banknameRef = useRef<HTMLInputElement>(null);
  const transactionRef = useRef<HTMLInputElement>(null);

  const [fileUploader, setFileUploader] = useState<File | null>(null);
  const cFileUploader = useRef<HTMLInputElement>(null);

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

      const rentresponse = await GetRent({ id: parseInt(props.id.toString()) });
      if (rentresponse.status) {
        setRent(rentresponse.data);
      }

      const rentTransactresponse = await GetUserRent({ rentid: props.id });
      if (rentTransactresponse.status) {
        setRentTransact(rentTransactresponse.data as rent_transact[]);
      }
      setLoading(false);
    };
    init();
  }, [props.id]);

  const payfees = async () => {
    if (field.length == 0) {
      toast.error("Please select atleast one month to pay rent");
      setLoading(false);
      setPaying(false);
      return;
    }

    const rentresponse = await GetRentTran({ id: field[0] });
    if (rentresponse.status) {
      router.push(
        `/payamount?xlmnx=${amount}&zgvfz=rent&ynboy=${rentresponse.data?.rentId}_${rentresponse.data?.userId}_${rentresponse.data?.shopId}_rent`
      );
    }
    // setLoading(true);
    // setPaying(true);
    // if (field.length == 0) {
    //   toast.error("Please select atleast one month to pay rent");
    //   setLoading(false);
    //   setPaying(false);
    //   return;
    // }

    // if (!banknameRef.current?.value) {
    //   toast.error("Please enter bank name");
    //   setLoading(false);
    //   setPaying(false);
    //   return;
    // }

    // if (!transactionRef.current?.value) {
    //   toast.error("Please enter transaction id");
    //   setLoading(false);
    //   setPaying(false);
    //   return;
    // }

    // const payrent_response = await PayRent({
    //   rentid: field,
    //   transactionid: transactionRef.current?.value ?? "",
    //   bankname: banknameRef.current?.value ?? "",
    // });

    // if (payrent_response.status) {
    //   toast.success(payrent_response.message);
    // }

    // const formData = new FormData();
    // formData.append("file", fileUploader!);

    // const uploadfile = await axios.post(process.env.UPLOAD_LINK!, formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });

    // if (uploadfile.status != 200) {
    //   toast.error("File upload failed");
    //   setLoading(false);
    //   setPaying(false);
    //   return;
    // }

    // await UploadFile({
    //   name: "receipt",
    //   path: uploadfile.data.filePath,
    //   createdById: userid,
    //   rentId: field[0],
    // });

    // const rentresponse = await GetRent({ id: parseInt(props.id.toString()) });
    // if (rentresponse.status) {
    //   setRent(rentresponse.data);
    // }
    // const rentTransactresponse = await GetUserRent({ rentid: props.id });
    // if (rentTransactresponse.status) {
    //   setRentTransact(rentTransactresponse.data as rent_transact[]);
    // }

    // setField([]);
    // setAmount(0);
    // setLoading(false);
    // setPaying(false);
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
                  {rent.shop.shopNumber < new Date() ? "Ended" : "Running"}
                </span>
              </p>

              <p className="text-xs leading-3">
                Shop Size <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent.shop.shopSize < new Date() ? "Ended" : "Running"}
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
                    <Checkbox
                      disabled={
                        index == 0
                          ? false
                          : !field?.includes(rentTransact[index - 1].id)
                      }
                      checked={field?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setField([...field, item.id]);
                        } else {
                          // setField(field.filter((id) => id !== item.id));
                          // remove the curretn checkbox and all the checkbox after it
                          setField(field.slice(0, index));
                        }

                        if (checked) {
                          setAmount(amount + item.amount);
                        } else {
                          // setAmount(amount - item.amount);
                          // remove the curent amount and all the amount after it
                          setAmount(
                            rentTransact
                              .slice(0, index)
                              .reduce((a, b) => a + b.amount, 0)
                          );
                        }
                      }}
                    />
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

                <div className="grid items-center gap-1.5 w-full mt-4">
                  <Label htmlFor="bankname">Enter Bank Name</Label>
                  <Input
                    id="bankname"
                    type="text"
                    className="w-full"
                    ref={banknameRef}
                  />
                </div>

                <div className="grid items-center gap-1.5 w-full mt-4">
                  <Label htmlFor="transactionid">Enter Transaction Id</Label>
                  <Input
                    id="transactionid"
                    type="text"
                    className="w-full"
                    ref={transactionRef}
                  />
                </div>

                <div className="flex gap-4 mt-4 items-center">
                  <Label htmlFor="termfile">Upload receipt</Label>
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
                    Pay Rent
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRentDetailsView;

interface PropertiesDeatilsProps {
  name: string;
  status: boolean;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  return (
    <>
      <div
        className={`p-2  flex flex-col  items-center justify-start px-4 py-2 min-w-28`}
      >
        <p className={`text-sm text-black`}>{props.name}</p>
        <div
          className={`text-sm h-7  mx-auto rounded-md mt-2 py-1 grid place-items-center w-10 border ${
            props.status
              ? "border-green-500 bg-green-500 bg-opacity-10"
              : "border-gray-100 bg-gray-100"
          }`}
        >
          {props.status && (
            <AntDesignCheckOutlined className="text-green-500 text-xl" />
          )}
        </div>
      </div>
    </>
  );
};
