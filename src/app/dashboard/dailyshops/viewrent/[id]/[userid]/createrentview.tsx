/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  refund_amount,
  shop_category,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import GetDailyShop from "@/action/dailyshop/getdailyshop";
import CreateDailyRent from "@/action/dailyrent/createdailyrent";
import { CreateDailyRentSchema } from "@/schema/createdailyrent";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker, Modal, Space } from "antd";
import GetDailyRent from "@/action/dailyrent/getdailyrent";
import { customAlphabet } from "nanoid";
import GetUser from "@/action/user/getuser";
import GetDailyRentById from "@/action/dailyshop/getdailyrent";
import { formateDate, handleNumberChange, longtext } from "@/utils/methods";
import BackButton from "@/components/backbutton";
import Link from "next/link";
import axios from "axios";
import CreateRefundRequest from "@/action/refund/createrefundrequest";
import GetRefundRequest from "@/action/refund/getrefundrequest";
import Image from "next/image";
import UpdateRefundRequest from "@/action/refund/udpaterefundrequest";
import { Textarea } from "@/components/ui/textarea";
import GetRefundRequest2 from "@/action/refund/getrefundrequest2";

const { RangePicker } = DatePicker;

interface CreateRentProps {
  rentid: number;
  userid: number;
}

const CreateRentPage = (props: CreateRentProps) => {
  const router = useRouter();
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  // const [isCreating, setIsCreating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [shopData, setShopData] = useState<any>();
  const [rentData, setRentData] = useState<
    | (daily_rent & {
        daily_shop: daily_shop & {
          property: daily_property;
          shop_category: shop_category;
          daily_rent_transact: daily_rent_transact[];
        };
      })
    | null
  >();

  const [user, setUser] = useState<user | null>(null);
  const [refundRequest, setRefundRequest] = useState<refund_amount | null>(
    null
  );

  const [cencalRequest, setCencalRequest] = useState<refund_amount | null>(
    null
  );

  const [refundRequest2, setRefundRequest2] = useState<refund_amount[]>([]);
  const init = async () => {
    setLoading(true);

    const dailyrentresponse = await GetDailyRentById({
      id: props.rentid,
    });

    if (dailyrentresponse.status && dailyrentresponse.data) {
      setRentData(dailyrentresponse.data);

      const refund_requestresponse2 = await GetRefundRequest2({
        userId: props.userid,
        rentId: dailyrentresponse.data.id,
        shopId: dailyrentresponse.data.shopId,
      });

      if (refund_requestresponse2.status && refund_requestresponse2.data) {
        setRefundRequest2(refund_requestresponse2.data);
      }

      const refund_requestresponse = await GetRefundRequest({
        userId: props.userid,
        rentId: dailyrentresponse.data.id,
        shopId: dailyrentresponse.data.shopId,
        retund_type: "DEPOSITREFUND",
      });

      if (refund_requestresponse.status && refund_requestresponse.data) {
        setRefundRequest(refund_requestresponse.data);
      }
      const cencal_requestresponse = await GetRefundRequest({
        userId: props.userid,
        rentId: dailyrentresponse.data.id,
        shopId: dailyrentresponse.data.shopId,
        retund_type: "CANCELREFUND",
      });

      if (cencal_requestresponse.status && cencal_requestresponse.data) {
        setCencalRequest(cencal_requestresponse.data);
      }

      const userresponse = await GetUser({ id: createuserid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const shopresponse = await GetDailyShop({
        id: dailyrentresponse.data.shopId,
      });
      if (shopresponse.status) {
        setShopData(shopresponse.data ?? null);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const dailyrentresponse = await GetDailyRentById({
        id: props.rentid,
      });

      if (dailyrentresponse.status && dailyrentresponse.data) {
        setRentData(dailyrentresponse.data);

        const refund_requestresponse2 = await GetRefundRequest2({
          userId: props.userid,
          rentId: dailyrentresponse.data.id,
          shopId: dailyrentresponse.data.shopId,
        });

        if (refund_requestresponse2.status && refund_requestresponse2.data) {
          setRefundRequest2(refund_requestresponse2.data);
        }

        const refund_requestresponse = await GetRefundRequest({
          userId: props.userid,
          rentId: dailyrentresponse.data.id,
          shopId: dailyrentresponse.data.shopId,
          retund_type: "DEPOSITREFUND",
        });

        if (refund_requestresponse.status && refund_requestresponse.data) {
          setRefundRequest(refund_requestresponse.data);
        }
        const cencal_requestresponse = await GetRefundRequest({
          userId: props.userid,
          rentId: dailyrentresponse.data.id,
          shopId: dailyrentresponse.data.shopId,
          retund_type: "CANCELREFUND",
        });

        if (cencal_requestresponse.status && cencal_requestresponse.data) {
          setCencalRequest(cencal_requestresponse.data);
        }

        const userresponse = await GetUser({ id: createuserid });
        if (userresponse.status) {
          setUser(userresponse.data!);
        }

        const shopresponse = await GetDailyShop({
          id: dailyrentresponse.data.shopId,
        });
        if (shopresponse.status) {
          setShopData(shopresponse.data ?? null);
        }
      }

      setLoading(false);
    };
    init();
  }, []);

  interface MonthType {
    isDisable: boolean;
    amount: string;
    month: string;
  }

  const [open, setOpen] = useState(false);
  const [depositeModelBox, setDepositeModelBox] = useState(false);
  const [dateChangeBox, setDateChangeBox] = useState(false);
  const [refundRequestRemarkBox, setRefundRequestRemarkBox] = useState(false);
  const [refundRequestBox, setRefundRequestBox] = useState(false);
  const [userCancelBookingBox, setUserCancelBookingBox] = useState(false);

  const [cencelRequestRemarkBox, setCencelRequestRemarkBox] = useState(false);
  const [cencelRequestBox, setCencelRequestBox] = useState(false);

  // photo upload start from here

  interface FileGetResponse {
    status: boolean;
    path: string;
  }

  // const [getPhoto, setGetPhoto] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  const [photo, setPhoto] = useState<File | null>(null);
  const cPhoto = useRef<HTMLInputElement>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const cPhoto2 = useRef<HTMLInputElement>(null);
  const [photo3, setPhoto3] = useState<File | null>(null);
  const cPhoto3 = useRef<HTMLInputElement>(null);

  const requestRefund = async () => {
    if (photo == null) {
      toast.error("Please upload photo", { theme: "light" });
      return;
    }
    if (photo2 == null) {
      toast.error("Please upload photo2", { theme: "light" });
      return;
    }
    if (photo3 == null) {
      toast.error("Please upload photo3", { theme: "light" });
      return;
    }
    const formData = new FormData();
    formData.append("file", photo);

    const uploadfile = await axios.post(
      process.env.UPLOAD_LINK ?? "",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (uploadfile.status != 200) {
      return toast.error("File upload failed");
    }

    const formData2 = new FormData();
    formData2.append("file", photo2);

    const uploadfile2 = await axios.post(
      process.env.UPLOAD_LINK ?? "",
      formData2,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (uploadfile2.status != 200) {
      return toast.error("File upload failed");
    }
    const formData3 = new FormData();
    formData3.append("file", photo3);
    const uploadfile3 = await axios.post(
      process.env.UPLOAD_LINK ?? "",
      formData3,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (uploadfile3.status != 200) {
      return toast.error("File upload failed");
    }

    const response = await CreateRefundRequest({
      creadtedById: createuserid,
      rentId: rentData?.id!,
      shopId: rentData?.shopId!,
      refunded_amount: parseFloat(rentData?.deposit_amount ?? "0"),
      photo1: uploadfile.data.filePath,
      photo2: uploadfile2.data.filePath,
      photo3: uploadfile3.data.filePath,
      retund_type: "DEPOSITREFUND",
    });

    if (response.status) {
      toast.success("Refund request created successfully", { theme: "light" });
    } else {
      toast.error(response.message, { theme: "light" });
    }

    setDepositeModelBox(false);
    await init();
  };

  const updaterequestRefundRemark = async () => {
    if (remark.current?.value == "" || remark.current?.value == undefined) {
      toast.error("Please enter remark", { theme: "light" });
      return;
    }

    const response = await UpdateRefundRequest({
      id: refundRequest?.id!,
      remark: remark.current?.value!,
      creadtedById: createuserid,
      refund_type: "DEPOSITREFUND",
    });
    if (response.status) {
      toast.success("Refund request updated successfully");
    } else {
      toast.error(response.message);
    }
    setRefundRequestRemarkBox(false);
    await init();
  };
  const updaterequestRefund = async () => {
    if (bankname.current?.value == "" || bankname.current?.value == undefined) {
      toast.error("Please enter bank name", { theme: "light" });
      return;
    }
    if (
      paymentmode.current?.value == "" ||
      paymentmode.current?.value == undefined
    ) {
      toast.error("Please enter payment mode", { theme: "light" });
      return;
    }
    if (
      transactionid.current?.value == "" ||
      transactionid.current?.value == undefined
    ) {
      toast.error("Please enter transaction id", { theme: "light" });
      return;
    }

    const response = await UpdateRefundRequest({
      id: refundRequest?.id!,
      bankname: bankname.current?.value!,
      paymentmode: paymentmode.current?.value!,
      transactionid: transactionid.current?.value!,
      creadtedById: createuserid,
      amount: refundamount.current?.value!,
      refund_type: "DEPOSITREFUND",
      status: "PAID",
    });
    if (response.status) {
      toast.success("Refund request updated successfully");
    } else {
      toast.error(response.message);
    }
    setRefundRequestBox(false);
    await init();
  };
  const updaterequestCancelRemark = async () => {
    if (remark.current?.value == "" || remark.current?.value == undefined) {
      toast.error("Please enter remark", { theme: "light" });
      return;
    }

    const response = await UpdateRefundRequest({
      id: cencalRequest?.id!,
      remark: remark.current?.value!,
      creadtedById: createuserid,
      refund_type: "CANCELREFUND",
    });
    if (response.status) {
      toast.success("Cancel request updated successfully");
    } else {
      toast.error(response.message);
    }
    setCencelRequestRemarkBox(false);
    await init();
  };

  const updaterequestCancel = async () => {
    if (bankname.current?.value == "" || bankname.current?.value == undefined) {
      toast.error("Please enter bank name", { theme: "light" });
      return;
    }
    if (
      paymentmode.current?.value == "" ||
      paymentmode.current?.value == undefined
    ) {
      toast.error("Please enter payment mode", { theme: "light" });
      return;
    }
    if (
      transactionid.current?.value == "" ||
      transactionid.current?.value == undefined
    ) {
      toast.error("Please enter transaction id", { theme: "light" });
      return;
    }

    const response = await UpdateRefundRequest({
      id: cencalRequest?.id!,
      bankname: bankname.current?.value!,
      paymentmode: paymentmode.current?.value!,
      transactionid: transactionid.current?.value!,
      creadtedById: createuserid,
      amount: refundamount.current?.value!,
      refund_type: "CANCELREFUND",
      status: "PAID",
    });
    if (response.status) {
      toast.success("Cancel request updated successfully");
    } else {
      toast.error(response.message);
    }
    setCencelRequestBox(false);
    await init();
  };

  const remark = useRef<HTMLTextAreaElement>(null);
  const bankname = useRef<HTMLInputElement>(null);
  const paymentmode = useRef<HTMLInputElement>(null);
  const transactionid = useRef<HTMLInputElement>(null);
  const refundamount = useRef<HTMLInputElement>(null);

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
          <div className="flex items-center gap-2">
            <BackButton />
            <p className="text-gray-500 text-xl gap-4">Booking Details</p>
            <div className="grow"></div>

            {user?.role == "USER" && (
              <>
                {rentData?.daily_shop.daily_rent_transact.filter(
                  (val: daily_rent_transact) => val.status == "PAID"
                ).length == 2 && refundRequest2.length == 0 ? (
                  <button
                    onClick={() => {
                      setDateChangeBox(true);
                    }}
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  >
                    Date Change
                  </button>
                ) : null}
                {rentData?.daily_shop.daily_rent_transact.filter(
                  (val: daily_rent_transact) => val.status == "PAID"
                ).length == 2 &&
                cencalRequest == null &&
                refundRequest2.length == 0 ? (
                  <button
                    onClick={() => {
                      setUserCancelBookingBox(true);
                    }}
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  >
                    Cancel Booking
                  </button>
                ) : null}

                {rentData?.daily_shop.daily_rent_transact.filter(
                  (val: daily_rent_transact) => val.status == "PAID"
                ).length == 2 && refundRequest == null ? (
                  <button
                    onClick={() => {
                      setDepositeModelBox(true);
                    }}
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  >
                    Request Refund
                  </button>
                ) : null}

                {/* {rentData?.daily_shop.daily_rent_transact.filter(
                  (val: daily_rent_transact) => val.status == "PAID"
                ).length == 1 ? (
                  <button
                    onClick={() => {
                      const nanoid = customAlphabet("1234567890abcdef", 10);
                      const uniqueid = nanoid();
                      router.push(
                        `/payamount?xlmnx=${rentData?.deposit_amount!}&ynboy=${uniqueid}&zgvfz=${
                          rentData?.daily_shop.daily_rent_transact[1]?.id
                        }_0_0_deposit&name=${user?.firstName}-${
                          user?.lastName
                        }&email=${user?.email}&mobile=${user?.contactone}`
                      );
                    }}
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  >
                    Pay Deposit
                  </button>
                ) : null} */}
              </>
            )}
            {rentData?.daily_shop.daily_rent_transact.filter(
              (val: daily_rent_transact) => val.status == "PAID"
            ).length != 0 && (
              <button
                onClick={() => {
                  router.push(
                    `/dashboard/dailyrentrecept/${user?.id}/${props.rentid}/${rentData?.daily_shop.daily_rent_transact[0]?.id}`
                  );
                }}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                View Receipt
              </button>
            )}
            <button
              onClick={() => setOpen(true)}
              className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
            >
              Terms & Condition
            </button>

            {["MANAGER"].includes(user?.role!) &&
              refundRequest != null &&
              refundRequest.status != "PAID" && (
                <button
                  onClick={() => setRefundRequestRemarkBox(true)}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  View Refund Request
                </button>
              )}

            {["ACCOUNTANT"].includes(user?.role!) &&
              refundRequest != null &&
              refundRequest.status != "PAID" &&
              refundRequest.officer_remark != null && (
                <button
                  onClick={() => setRefundRequestBox(true)}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  View Refund Request
                </button>
              )}

            {["ACCOUNTANT"].includes(user?.role!) &&
            rentData?.daily_shop.daily_rent_transact.filter(
              (val: daily_rent_transact) => val.status == "PAID"
            ).length == 1 ? (
              <button
                onClick={() => {
                  router.push(
                    `/dashboard/dailyshops/collectdeposit/${rentData?.daily_shop.daily_rent_transact[1]?.id}`
                  );
                  // const nanoid = customAlphabet("1234567890abcdef", 10);
                  // const uniqueid = nanoid();
                  // router.push(
                  //   `/payamount?xlmnx=${rentData?.deposit_amount!}&ynboy=${uniqueid}&zgvfz=${
                  //     rentData?.daily_shop.daily_rent_transact[1]?.id
                  //   }_0_0_deposit&name=${user?.firstName}-${
                  //     user?.lastName
                  //   }&email=${user?.email}&mobile=${user?.contactone}`
                  // );
                }}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                Collect Deposit
              </button>
            ) : null}

            {/* {["SYSTEM", "ADMIN", "ACCOUNTANT", "MANAGER"].includes(
              user?.role!
            ) &&
              refundRequest != null &&
              refundRequest.status != "PAID" && (
                <button
                  onClick={() => setRefundRequestRemarkBox(true)}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  View Refund Request
                </button>
              )} */}

            {["MANAGER"].includes(user?.role!) && cencalRequest != null && (
              <button
                onClick={() => setCencelRequestRemarkBox(true)}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                View Cancel Request
              </button>
            )}

            {["ACCOUNTANT"].includes(user?.role!) &&
              cencalRequest != null &&
              cencalRequest.officer_remark != null && (
                <button
                  onClick={() => setCencelRequestBox(true)}
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                >
                  View Cancel Request
                </button>
              )}
          </div>

          <div className="flex gap-4">
            <div className="grid w-full mt-4">
              <Label htmlFor="propertes">Property</Label>
              <p>{shopData?.property?.name}</p>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shopNumber">Unit Name</Label>
              <p>{shopData?.name}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Booking start - end date{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <p>
                From {formateDate(new Date(rentData?.event_from_date!))} to{" "}
                {formateDate(new Date(rentData?.event_to_date!))}
              </p>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="user">
                Purpose <span className="text-rose-500">*</span>
              </Label>
              <p>{rentData?.event_reason}</p>
            </div>
          </div>

          {user && (
            <div className="grid items-center gap-1.5 w-full mt-4 bg-gray-100 p-2 rounded-md">
              <Label htmlFor="user">
                User Details <span className="text-rose-500">*</span>
              </Label>
              <div className="">
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Contact: {user.contactone}</p>
                <p>Email: {user.email}</p>
              </div>
            </div>
          )}

          {rentData?.gst_no && rentData?.company_name && (
            <div className="grid items-center gap-1.5 w-full mt-4 bg-gray-100 p-2 rounded-md">
              <Label htmlFor="user">
                GST Details <span className="text-rose-500">*</span>
              </Label>
              <div className="">
                <p>GST No: {rentData?.gst_no}</p>
                <p>Company Name: {rentData?.company_name}</p>
              </div>
            </div>
          )}

          {refundRequest?.bankname && (
            <div className="grid items-center gap-1.5 w-full mt-4 bg-gray-100 p-2 rounded-md">
              <Label htmlFor="user">
                Refund Data <span className="text-rose-500">*</span>
              </Label>
              <div className="">
                <p>Bank Name: {refundRequest?.bankname}</p>
                <p>Payment Mode: {refundRequest?.paymentmode}</p>
                <p>Transaction Id: {refundRequest?.transactionid}</p>
                <p>Refund Amount: {refundRequest?.actual_refund_amount}</p>
                <p>
                  Refund Date: {formateDate(refundRequest?.transaction_date!)}
                </p>
              </div>
            </div>
          )}
          {cencalRequest?.bankname && (
            <div className="grid items-center gap-1.5 w-full mt-4 bg-gray-100 p-2 rounded-md">
              <Label htmlFor="user">
                Cancel Booking <span className="text-rose-500">*</span>
              </Label>
              <div className="">
                <p>Bank Name: {cencalRequest?.bankname}</p>
                <p>Payment Mode: {cencalRequest?.paymentmode}</p>
                <p>Transaction Id: {cencalRequest?.transactionid}</p>
                <p>Refund Amount: {cencalRequest?.actual_refund_amount}</p>
                <p>
                  Cancel Booking Date:{" "}
                  {formateDate(cencalRequest?.transaction_date!)}
                </p>
              </div>
            </div>
          )}

          <div className=" w-full mt-4 bg-gray-100 p-2 rounded-md">
            <Label htmlFor="user">
              Payment Details <span className="text-rose-500">*</span>
            </Label>

            <div className="flex w-full">
              <p>Price</p>
              <div className="grow"></div>
              <p>{rentData?.event_amount}</p>
            </div>
            <div className="flex w-full">
              <p>Pre-Preparation Charge</p>
              <div className="grow"></div>
              <p> {rentData?.prep_day_amount}</p>
            </div>
            <div className="flex w-full">
              <p>Venue-Handover Charge</p>
              <div className="grow"></div>
              <p>{rentData?.handover_day_amount}</p>
            </div>
            <div className="flex w-full">
              <p>Deposit</p>
              <div className="grow"></div>
              <p>{rentData?.deposit_amount}</p>
            </div>
            <div className="w-full h-[1px] bg-gray-500"></div>
            <div className="flex w-full">
              <p>Total</p>
              <div className="grow"></div>
              <p>
                {parseFloat(rentData?.event_amount ?? "0") +
                  parseFloat(rentData?.prep_day_amount ?? "0") +
                  parseFloat(rentData?.handover_day_amount ?? "0") +
                  parseFloat(rentData?.deposit_amount ?? "0")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Terms & Condition"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-rose-500">
          1. The DNHPDA reserves the right to cancel the allotment of space at
          Kala-Kendra, Auditorium and Banquet Hall in case of any government
          functions without assigning any reason thereof.
        </p>

        <p className="text-sm text-gray-800 font-normal my-2">
          2. The applicant shall ensure that they shall maintain the floor and
          premises of the Banquet hall clean by avoiding littering of food
          materials over the wooden floors, by sufficient provision of waste
          bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, and penalty
          shall be levied amounting to Rs. 5000/- and the security deposit
          submitted to the department shall be forfeited without any further
          explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall not stick any adhesive based posters in the
          entire premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. The applicant shall ensure that there shall not be any damages to
          the assets such as Auditorium and Banquet Hall/Exhibition Hall space,
          Acoustic wall panels, lighting components, floor carpets, stage
          platform, mic podiums, projectors, lighting Components and its
          accessories, Audio sound system and accessories, seating chairs, V.I.P
          chairs, recliners, electrical connections, main stage accessories,
          viewers chairs at Pavilion area, seating steps at Open air
          Amphitheatre area etc. of the allotted space area/ premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. The penalty of Rs. 100/- per Sq. Mt is imposed in case the
          applicant has not taken the permission and approval from the competent
          authority for utilizing the extra open space (Outer space) occupied
          for function other than allotment space.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. Havan, Pooja, Outdoor cooking, Tandoor etc. is prohibited in the
          Extra Open Space (Outer Space).
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. Havan, Pooja, Katha, Crackers etc. shall not be allowed and is
          strictly prohibited in Auditorium Hall, Banquet hall, Exhibition Hall,
          Bride room and Groom Room. The same shall only be allowed in Open Air
          Amphitheatre with all the preventive measures.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Eating and drinking is strictly prohibited inside the Auditorium
          Halls and if found, the applicant shall have to pay a penalty amount
          of Rs. 5000/- to the concerned department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. After receiving or informing the applicant about the Allotment
          Order, the payment should be done within a week by the applicant. If
          the applicant fails to do so, the booked date / allotted date shall be
          considered as cancelled without any intimation and same shall be
          allotted to the other applicant in the queue.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. If the applicant has to change their booked date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to cancel their booked date / allotted date,
          50% Cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. If the applicant has to cancel their booked date / allotted date
          before 1 week, in that case 100% Cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. Smoking, drinking of alcohol, non-vegetarian food, chewing of
          tobacco is strictly prohibited in the entire premises and if found,
          you shall have to pay a penalty amount of Rs. 5000/- and also the
          security deposit submitted to the department shall be forfeited
          without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          17. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          18. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
      </Modal>

      {/* user refund request start here*/}
      <Modal
        centered
        title="Request Refund"
        open={depositeModelBox}
        onCancel={() => setDepositeModelBox(false)}
        footer={null}
        // onOk={requestRefund}
        width={800}
        className="my-10 h-[600px]"
      >
        <DocUploader
          title="Photo"
          file={photo}
          setFile={setPhoto}
          cFile={cPhoto}
        />
        <DocUploader
          title="Photo2"
          file={photo2}
          setFile={setPhoto2}
          cFile={cPhoto2}
        />
        <DocUploader
          title="Photo3"
          file={photo3}
          setFile={setPhoto3}
          cFile={cPhoto3}
        />
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Refund Amount</Label>
          <div className="grow"></div>
          <p className="text-sm">{rentData?.deposit_amount}</p>
        </div>
        <div className="flex mt-2">
          <div className="grow"></div>
          <Button
            onClick={requestRefund}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Request Refund
          </Button>
        </div>
      </Modal>
      {/* user refund request  end here*/}
      {/* department view refund request  start here*/}
      <Modal
        centered
        title="Request Refund"
        open={refundRequestRemarkBox}
        onCancel={() => setRefundRequestRemarkBox(false)}
        footer={null}
        // onOk={requestRefund}
        width={800}
        className="my-10 h-[600px]"
      >
        <div className="flex gap-2 justify-center sm:justify-between flex-wrap">
          <Link
            href={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
            target="_blank"
          >
            <div className="relative h-52 w-52 rounded-md overflow-hidden">
              <Image
                src={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
                alt=""
                fill={true}
                className="object-contain rounded-md"
              />
            </div>
          </Link>
          <Link
            href={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
            target="_blank"
          >
            <div className="relative h-52 w-52 rounded-md overflow-hidden">
              <Image
                src={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo2!}`}
                alt=""
                fill={true}
                className="object-contain rounded-md"
              />
            </div>
          </Link>
          <Link
            href={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
            target="_blank"
          >
            <div className="relative h-52 w-52 rounded-md overflow-hidden">
              <Image
                src={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo3!}`}
                alt=""
                fill={true}
                className="object-contain rounded-md"
              />
            </div>
          </Link>
        </div>
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Refund Amount</Label>
          <div className="grow"></div>
          <p className="text-sm">{rentData?.deposit_amount}</p>
        </div>
        {refundRequest?.officer_remark == null ? (
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="remark">Officer Remark</Label>
              <Textarea id="remark" className="w-full bg-white" ref={remark} />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 bg-gray-100 px-2 py-2 rounded-sm">
              <Label>Officer Remark</Label>
              <p className="text-sm">{refundRequest?.officer_remark}</p>
            </div>
          </>
        )}

        {refundRequest?.officer_remark == null && (
          <div className="flex mt-2">
            <div className="grow"></div>
            <Button
              onClick={updaterequestRefundRemark}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        )}
      </Modal>
      <Modal
        centered
        title="Request Refund"
        open={refundRequestBox}
        onCancel={() => setRefundRequestBox(false)}
        footer={null}
        // onOk={requestRefund}
        width={800}
        className="my-10 h-[600px]"
      >
        <div className="flex gap-2 justify-center sm:justify-between flex-wrap">
          <Link
            href={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
            target="_blank"
          >
            <div className="relative h-52 w-52 rounded-md overflow-hidden">
              <Image
                src={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
                alt=""
                fill={true}
                className="object-contain rounded-md"
              />
            </div>
          </Link>
          <Link
            href={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
            target="_blank"
          >
            <div className="relative h-52 w-52 rounded-md overflow-hidden">
              <Image
                src={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo2!}`}
                alt=""
                fill={true}
                className="object-contain rounded-md"
              />
            </div>
          </Link>
          <Link
            href={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo1!}`}
            target="_blank"
          >
            <div className="relative h-52 w-52 rounded-md overflow-hidden">
              <Image
                src={`${process.env.YOUR_BASE_URL}/${refundRequest?.photo3!}`}
                alt=""
                fill={true}
                className="object-contain rounded-md"
              />
            </div>
          </Link>
        </div>
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Refund Amount</Label>
          <div className="grow"></div>
          <p className="text-sm">{rentData?.deposit_amount}</p>
        </div>

        {refundRequest?.bankname == null ? (
          <>
            {" "}
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  type="text"
                  className="w-full bg-white"
                  ref={bankname}
                  // value={shopData?.name}
                />
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <Input
                  id="payment_mode"
                  type="text"
                  className="w-full bg-white"
                  ref={paymentmode}
                />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="amount">Refund Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  className="w-full bg-white"
                  ref={refundamount}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="transactionid">Transaction Id </Label>
                <Input
                  id="transactionid"
                  type="text"
                  className="w-full bg-white"
                  ref={transactionid}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="bank_name">Bank Name</Label>
                <p>{refundRequest?.bankname}</p>
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <p>{refundRequest?.paymentmode}</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="amount">Actual Refund Amount</Label>
                <p>{refundRequest?.actual_refund_amount}</p>
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="transactionid">Transaction Id </Label>
                <p>{refundRequest?.transactionid}</p>
              </div>
            </div>
          </>
        )}

        <div className="mt-2 bg-gray-100 px-2 py-2 rounded-sm">
          <Label>Officer Remark</Label>
          <p className="text-sm">{refundRequest?.officer_remark}</p>
        </div>
        {refundRequest?.bankname == null && (
          <div className="flex mt-2">
            <div className="grow"></div>
            <Button
              onClick={updaterequestRefund}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        )}
      </Modal>
      {/* department view refund request end here*/}
      {/* department view cancel request  start here*/}
      <Modal
        centered
        title="Request Cancel"
        open={cencelRequestRemarkBox}
        onCancel={() => setCencelRequestRemarkBox(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px]"
      >
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Cancel Amount</Label>
          <div className="grow"></div>
          <p className="text-sm">{cencalRequest?.refunded_amount}</p>
        </div>
        {cencalRequest?.officer_remark == null ? (
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-2">
              <Label htmlFor="remark">Officer Remark</Label>
              <Textarea id="remark" className="w-full bg-white" ref={remark} />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 bg-gray-100 px-2 py-2 rounded-sm">
              <Label>Officer Remark</Label>
              <p className="text-sm">{cencalRequest?.officer_remark}</p>
            </div>
          </>
        )}

        {cencalRequest?.officer_remark == null && (
          <div className="flex mt-2">
            <div className="grow"></div>
            <Button
              onClick={updaterequestCancelRemark}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        )}
      </Modal>
      <Modal
        centered
        title="Request cancel"
        open={cencelRequestBox}
        onCancel={() => setCencelRequestBox(false)}
        footer={null}
        // onOk={requestRefund}
        width={800}
        className="my-10 h-[600px]"
      >
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Cancel Amount</Label>
          <div className="grow"></div>
          <p className="text-sm">{cencalRequest?.refunded_amount}</p>
        </div>

        {cencalRequest?.bankname == null ? (
          <>
            {" "}
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  type="text"
                  className="w-full bg-white"
                  ref={bankname}
                  // value={shopData?.name}
                />
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <Input
                  id="payment_mode"
                  type="text"
                  className="w-full bg-white"
                  ref={paymentmode}
                />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="amount">Refund Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  className="w-full bg-white"
                  ref={refundamount}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="transactionid">Transaction Id </Label>
                <Input
                  id="transactionid"
                  type="text"
                  className="w-full bg-white"
                  ref={transactionid}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="bank_name">Bank Name</Label>
                <p>{cencalRequest?.bankname}</p>
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <p>{cencalRequest?.paymentmode}</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap md:flex-nowrap mt-2">
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="amount">Actual Refund Amount</Label>
                <p>{cencalRequest?.actual_refund_amount}</p>
              </div>
              <div className="grid items-center gap-1.5 w-full">
                <Label htmlFor="transactionid">Transaction Id </Label>
                <p>{cencalRequest?.transactionid}</p>
              </div>
            </div>
          </>
        )}

        <div className="mt-2 bg-gray-100 px-2 py-2 rounded-sm">
          <Label>Officer Remark</Label>
          <p className="text-sm">{cencalRequest?.officer_remark}</p>
        </div>
        {cencalRequest?.bankname == null && (
          <div className="flex mt-2">
            <div className="grow"></div>
            <Button
              onClick={updaterequestCancel}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        )}
      </Modal>
      {/* department view cancel request end here*/}

      {/* user date change start here*/}
      <Modal
        centered
        title="Date Change Request"
        open={dateChangeBox}
        onCancel={() => setDateChangeBox(false)}
        footer={null}
        // onOk={requestRefund}
        width={800}
        className="my-10 h-[600px]"
      >
        <p className="text-sm  font-normal my-2 text-rose-500">
          1. The DNHPDA reserves the right to cancel the allotment of space at
          Kala-Kendra, Auditorium and Banquet Hall in case of any government
          functions without assigning any reason thereof.
        </p>

        <p className="text-sm text-gray-800 font-normal my-2">
          2. The applicant shall ensure that they shall maintain the floor and
          premises of the Banquet hall clean by avoiding littering of food
          materials over the wooden floors, by sufficient provision of waste
          bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, and penalty
          shall be levied amounting to Rs. 5000/- and the security deposit
          submitted to the department shall be forfeited without any further
          explanation.
        </p>
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Date Change Charge</Label>
          <div className="grow"></div>
          <p className="text-sm">
            {(
              (parseFloat(rentData?.event_amount!) +
                parseFloat(
                  rentData?.handover_day ? rentData.handover_day_amount! : "0"
                ) +
                parseFloat(
                  rentData?.prep_day ? rentData.prep_day_amount! : "0"
                )) *
              0.25
            ).toFixed(2)}
          </p>
        </div>
        <div className="flex mt-2">
          <div className="grow"></div>
          <Button
            onClick={() => {
              router.push(
                `/dashboard/dailyshops/dailyrentdatechange/${rentData?.shopId}/${props.rentid}`
              );
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Date Change
          </Button>
        </div>
      </Modal>
      {/* user date change end here*/}
      {/* user cancel start here*/}
      <Modal
        centered
        title="Cancellation Request"
        open={userCancelBookingBox}
        onCancel={() => setUserCancelBookingBox(false)}
        footer={null}
        // onOk={requestRefund}
        width={800}
        className="my-10 h-[600px]"
      >
        <p className="text-sm  font-normal my-2 text-rose-500">
          1. The DNHPDA reserves the right to cancel the allotment of space at
          Kala-Kendra, Auditorium and Banquet Hall in case of any government
          functions without assigning any reason thereof.
        </p>

        <p className="text-sm text-gray-800 font-normal my-2">
          2. The applicant shall ensure that they shall maintain the floor and
          premises of the Banquet hall clean by avoiding littering of food
          materials over the wooden floors, by sufficient provision of waste
          bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, and penalty
          shall be levied amounting to Rs. 5000/- and the security deposit
          submitted to the department shall be forfeited without any further
          explanation.
        </p>
        <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
          <Label htmlFor="termfile">Cancellation Charge</Label>
          <div className="grow"></div>
          <p className="text-sm">
            {(
              (parseFloat(rentData?.event_amount!) +
                parseFloat(
                  rentData?.handover_day ? rentData.handover_day_amount! : "0"
                ) +
                parseFloat(
                  rentData?.prep_day ? rentData.prep_day_amount! : "0"
                )) *
              0.5
            ).toFixed(2)}
          </p>
        </div>
        <div className="flex mt-2">
          <div className="grow"></div>
          <Button
            onClick={async () => {
              const response = await CreateRefundRequest({
                creadtedById: createuserid,
                rentId: rentData?.id!,
                shopId: rentData?.shopId!,
                refunded_amount: parseFloat(
                  (
                    (parseFloat(rentData?.event_amount!) +
                      parseFloat(
                        rentData?.handover_day
                          ? rentData.handover_day_amount!
                          : "0"
                      ) +
                      parseFloat(
                        rentData?.prep_day ? rentData.prep_day_amount! : "0"
                      )) *
                    0.5
                  ).toFixed(2)
                ),
                retund_type: "CANCELREFUND",
              });

              if (response.status) {
                toast.success("Refund request created successfully", {
                  theme: "light",
                });
              } else {
                toast.error(response.message, { theme: "light" });
              }

              setUserCancelBookingBox(false);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit
          </Button>
        </div>
      </Modal>
      {/* user cancel change end here*/}
    </>
  );
};

export default CreateRentPage;

interface DocUploaderProps {
  title: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  cFile: React.RefObject<HTMLInputElement>;
}

const DocUploader = (props: DocUploaderProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileSize = selectedFile.size / (1024 * 1024);

      if (fileSize < 5) {
        if (
          selectedFile.type.startsWith("image/") ||
          selectedFile.type.startsWith("application/pdf")
        ) {
          props.setFile(selectedFile);
        } else {
          toast.error("Please select an image or pdf file.", {
            theme: "light",
          });
        }
      } else {
        toast.error("File size must be less than 5 MB.", { theme: "light" });
      }
    }
  };

  return (
    <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
      <Label htmlFor="termfile">{props.title}</Label>
      <div className="grow"></div>
      <p className="text-sm">
        {props.file != null ? longtext(props.file.name, 6) : "No File Selected"}
      </p>
      <Button
        onClick={() => props.cFile.current?.click()}
        variant={"secondary"}
        className="bg-gray-200 hover:bg-gray-300 h-8"
      >
        {props.file == null ? "Upload File" : "Change File"}
      </Button>
      {props.file != null && (
        <Link
          target="_blank"
          href={URL.createObjectURL(props.file!)}
          className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
        >
          View File
        </Link>
      )}

      <div className="hidden">
        <Input
          type="file"
          ref={props.cFile}
          accept="*/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
