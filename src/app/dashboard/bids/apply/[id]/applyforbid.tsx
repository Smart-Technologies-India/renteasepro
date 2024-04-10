"use client";

import ApplyBid from "@/action/bid/applybid";
import GetBid from "@/action/bid/getbid";
import getFromUser from "@/action/bid_transact/getfromuser";
import UploadFile from "@/action/file_upload/uploadfile";
import getUploadFileUser from "@/action/user/getuploadedfile";
import BackButton from "@/components/backbutton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  formatDateTime,
  formateDate,
  handleNumberChange,
  longtext,
} from "@/utils/methods";
import { ExemptFor, UserDocType, bid, exempt, user } from "@prisma/client";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const getExemptfor = (value: ExemptFor): string => {
  switch (value) {
    case ExemptFor.WOMEN:
      return "For Women";
    case ExemptFor.RESERVED:
      return "For Reserved Category";
    case ExemptFor.DIFFERENTLY_ABLED:
      return "For Differently Abled";
    case ExemptFor.MSME:
      return "For MSME";
    default:
      return "For Women";
  }
};
interface ApplyForBidViewProps {
  bidid: number;
}

const ApplyForBidView = (props: ApplyForBidViewProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const [isPaying, setIsPaying] = useState<boolean>(false);

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [bid, setBid] = useState<any>();

  const amount = useRef<HTMLInputElement>(null);

  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [bidTransact, setBidTransact] = useState<any>();

  const [isAplicable, setIsApplicable] = useState<boolean>(false);

  // const [user, setUser] = useState<user>();

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

      // const userresponse = await GetUser({
      //   id: userid,
      // });
      // if (userresponse.status) {
      //   setUser(userresponse.data!);
      // }

      const bidresponse = await GetBid({
        id: parseInt(props.bidid.toString()),
      });
      if (bidresponse.status) {
        setBid(bidresponse.data ?? ({} as bid));
      }

      const isaaplied = await getFromUser({
        bidid: parseInt(props.bidid.toString()),
        userid: userid,
      });
      if (isaaplied.status) {
        setIsApplied(true);
        setBidTransact(isaaplied.data);
      }

      // file info start from here

      const womenfileresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.WOMEN,
      });

      const categoryresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.RESERVED,
      });

      const abledresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.DIFFERENTLY_ABLED,
      });

      const msmeresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.MSME,
      });

      const stscresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.SC_ST,
      });

      const tribalresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.TRIBAL,
      });

      const setApplicable = (): boolean => {
        if (bidresponse.data.is_open) return true;
        if (womenfileresponse.status && bidresponse.data.is_woman) return true;
        if (categoryresponse.status && bidresponse.data.is_reserved)
          return true;
        if (abledresponse.status && bidresponse.data.is_differently_abled)
          return true;
        if (msmeresponse.status && bidresponse.data.is_msme) return true;
        if (stscresponse.status && bidresponse.data.is_sc_st) return true;
        if (tribalresponse.status && bidresponse.data.is_tribal) return true;
        return false;
      };

      const value = setApplicable();
      setIsApplicable(() => value);

      // file info end here
      setLoading(false);
    };

    init();
  }, [props.bidid, userid]);

  const create = async (issecond: boolean) => {
    setIsPaying(true);
    if (
      amount.current?.value === "" ||
      amount.current?.value == undefined ||
      amount.current?.value == null
    ) {
      toast.error("Please enter bid amount");
      setIsPaying(true);
      return;
    }
    if (bid?.is_auction == false) {
      if (
        parseInt(amount.current?.value ?? "0") <
        bid.min_bid_amount + bid.min_bid_increment
      ) {
        toast.error(
          `Bid amount should be greater than minimum bid amount. Bid amount should be in multiple of Rs.${bid.min_bid_increment}`
        );
        setIsPaying(true);
        return;
      }
    } else {
      if (
        parseInt(amount.current?.value ?? "0") <
        bid.max_bid_amount + bid.min_bid_increment
      ) {
        setIsPaying(true);
        toast.error(
          `Bid amount should be greater than current bid amount. Bid amount should be in multiple of Rs.${bid.min_bid_increment}`
        );
        return;
      }
    }

    if (parseInt(amount.current?.value ?? "0") % bid.min_bid_increment != 0) {
      setIsPaying(true);
      toast.error(
        `Bid amount should be in multiple of Rs.${bid.min_bid_increment}`
      );
      return;
    }

    if (!issecond && fileUploader == null) {
      return toast.error("Please upload receipt file");
    }

    if (!issecond && banknameRef.current?.value == "") {
      return toast.error("Please enter bank name");
    }

    if (!issecond && transactionRef.current?.value == "") {
      return toast.error("Please enter transaction id");
    }

    const createbid = await ApplyBid({
      amount: parseInt(amount.current?.value ?? "0"),
      bidId: parseInt(props.bidid.toString()),
      shopId: bid?.shopId ?? 0,
      userId: parseInt(userid.toString()),
      issecond: issecond,
      fees: bid.fees_amount,
      emd: bid.emd_amount,
      bg: bid.bg_amount,
      bankname: banknameRef.current?.value ?? "",
      transactionid: transactionRef.current?.value ?? "",
    });
    if (!createbid.status) return toast.error(createbid.message);

    if (!issecond) {
      const formData = new FormData();
      formData.append("file", fileUploader!);

      const uploadfile = await axios.post(process.env.UPLOAD_LINK!, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadfile.status != 200) {
        return toast.error("File upload failed");
      }

      await UploadFile({
        name: "receipt",
        path: uploadfile.data.filePath,
        createdById: userid,
        bidId: createbid.data?.id,
      });

      return router.push(`/dashboard/bidrecept/${userid}/${props.bidid}`);
    }
    router.back();
    toast.success(createbid.message);
  };

  const [page, setPage] = useState<number>(0);
  const maxpage = 4;
  const nextpage = () => {
    if (page < maxpage) {
      setPage(page + 1);
    }
  };

  const prevpage = () => {
    if (page > 0) {
      setPage(page - 1);
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
          <h1 className="text-[#162f57] text-2xl font-semibold">Bid Details</h1>
        </div>

        {page == 0 && (
          <div className="bg-white rounded-sm shadow-sm p-4 my-2">
            <p className="text-gray-500 text-center">General Information</p>
            <Separator />
            <div className="flex gap-4">
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Property Name:</h1>
                <p>{bid.shop.property.name ?? "-"}</p>
              </div>
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Shop Number:</h1>
                <p>{bid.shop.shopNumber ?? "="}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Bid Title:</h1>
                <p>{bid.title ?? "-"}</p>
              </div>
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Bid Description:</h1>
                <p>{bid.description ?? "-"}</p>
              </div>
            </div>
            <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md">
              <h1>Bid Instructions:</h1>
              <p>{bid.instruction ?? "-"}</p>
            </div>
            <div className="mt-4"></div>
            <Separator />
            <div className="flex justify-between w-full mt-2">
              <div className="grow"></div>
              <Button
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                onClick={nextpage}
              >
                Go To Next
              </Button>
            </div>
          </div>
        )}

        {page == 1 && (
          <>
            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-gray-500 text-center">Fees Structure</p>
              <Separator />

              <div className="flex gap-4 items-center justify-around w-full mt-4">
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Bid Start Date Time:</h1>
                  <p className="text-center">
                    {formatDateTime(new Date(bid.bidstartdate))}
                  </p>
                </div>

                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Bid End Date Time:</h1>
                  <p className="text-center">
                    {formatDateTime(new Date(bid.bidenddate))}
                  </p>
                </div>

                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Bid Deadline Date:</h1>
                  <p className="text-center">
                    {formateDate(new Date(bid.biddeclarationdate))}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center justify-around w-full mt-2">
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Fees Amount:</h1>
                  <p className="text-center">&#8377;{bid.fees_amount}</p>
                </div>

                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">EMD Amount:</h1>
                  <p className="text-center">&#8377;{bid.emd_amount}</p>
                </div>

                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">BG Amount:</h1>
                  <p className="text-center">&#8377;{bid.bg_amount}</p>
                </div>
              </div>

              <div className="flex gap-4 items-center justify-around w-full mt-2">
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Minimum Bid:</h1>
                  <p className="text-center">&#8377;{bid.min_bid_amount}</p>
                </div>
                {bid.is_auction == true && (
                  <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                    <h1 className="text-center">Current Bid:</h1>
                    <p className="text-center">&#8377;{bid.max_bid_amount}</p>
                  </div>
                )}
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Min Bid Increment:</h1>
                  <p className="text-center">&#8377;{bid.min_bid_increment}</p>
                </div>
              </div>

              <div className="mt-4"></div>
              <Separator />
              <div className="flex justify-between w-full mt-2">
                <Button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={prevpage}
                >
                  Go To Previous
                </Button>
                <Button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={nextpage}
                >
                  Go To Next
                </Button>
              </div>
            </div>
          </>
        )}

        {page == 2 && (
          <>
            <div className="bg-white rounded-sm shadow-sm p-4 my-2">
              <p className="text-gray-500 text-center">Document Required</p>
              <Separator />

              <div className="grid grid-cols-5 gap-4 items-center justify-around w-full mt-4">
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1 col-span-2">
                  <h1 className="text-center">Document Title</h1>
                  <p className="text-center">{bid.docone ?? "-"}</p>
                </div>
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1 col-span-3">
                  <h1 className="text-center">Document Description</h1>
                  <p className="text-center">{bid.Description ?? "-"}</p>
                </div>
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1  col-span-2">
                  <h1 className="text-center">File Number</h1>
                  <p className="text-center">
                    {bid.t_and_c_file_number ?? "-"}
                  </p>
                </div>
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1 col-span-3">
                  <h1 className="text-center">File Subject</h1>
                  <p className="text-center">
                    {bid.t_and_c_description ?? "-"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 items-center">
                <Label htmlFor="termfile">Terms & Conditions File</Label>
                <a
                  download={true}
                  href={bid.t_and_c_upload}
                  className="bg-green-500 hover:bg-green-500 py-1 px-4 rounded-md text-white cursor-pointer"
                >
                  Download File
                </a>
              </div>
              <div className="mt-4"></div>
              <Separator />
              <div className="flex justify-between w-full mt-2">
                <Button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={prevpage}
                >
                  Go To Previous
                </Button>
                <Button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={nextpage}
                >
                  Go To Next
                </Button>
              </div>
            </div>
          </>
        )}

        {page == 3 && (
          <>
            <div className="flex gap-4">
              <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                <p className="text-gray-500 text-center">
                  User Bid Information
                </p>
                <Separator />

                <h1 className="mt-2 text-gray-500 m">
                  Allowed Bidder Category
                </h1>
                <div className="flex gap-2 flex-wrap items-center my-4">
                  {bid.is_open == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        Open Bid
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_woman == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        Women
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_reserved == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        Reserved Category
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_differently_abled == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        Differently Abled
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_msme == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        MSME
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_sc_st == true ? (
                    <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                      SC/ST
                    </div>
                  ) : (
                    <></>
                  )}
                  {bid.tribal == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        Tribal
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                {bid?.is_exemption == true && (
                  <>
                    <h1 className="text-gray-500 mt-2">Exempt Category :</h1>
                    <div className="flex gap-4 flex-wrap mt-2 items-center">
                      {bid.exempt!.map((item: exempt, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs"
                        >
                          {getExemptfor(item.fees_for!)}
                        </div>
                      ))}
                    </div>
                    <h1 className="text-gray-500 mt-2">Exempt For : </h1>
                    <div className="flex gap-4 flex-wrap mt-2 items-center">
                      {bid.exempt[0].is_fees_exempt_allowed! ? (
                        <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                          Fees
                        </div>
                      ) : (
                        <></>
                      )}
                      {bid.exempt[0].is_bg_exempt_allowed! ? (
                        <div className="bg-gray-100 rounded-sm shadow py-1 px-4  text-xs">
                          BG
                        </div>
                      ) : (
                        <></>
                      )}
                      {bid.exempt[0].is_emd_exempt_allowed! ? (
                        <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                          EMD
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    {bid.exempt[0].is_fees_exempt_allowed! && (
                      <div className="grid items-center gap-1.5 w-full mt-4">
                        <h1 className="mt-2">Exempt Fees Amount:</h1>
                        <p>{bid?.exempt[0].feesamount ?? "-"}</p>
                      </div>
                    )}
                    {bid.exempt[0].is_bg_exempt_allowed! && (
                      <div className="grid items-center gap-1.5 w-full mt-4">
                        <h1 className="mt-2">Exempt BG Amount:</h1>
                        <p>{bid?.exempt[0].bgamount ?? "-"}</p>
                      </div>
                    )}
                    {bid.exempt[0].is_emd_exempt_allowed! && (
                      <div className="grid items-center gap-1.5 w-full mt-4">
                        <h1 className="mt-2">Exempt EMD Amount:</h1>
                        <p>{bid?.exempt[0].emdamount ?? "-"}</p>
                      </div>
                    )}
                  </>
                )}
                <Separator />
                <div className="flex justify-between w-full mt-2">
                  <Button
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                    onClick={prevpage}
                  >
                    Go To Previous
                  </Button>
                </div>
              </div>

              {isAplicable ? (
                <>
                  {bid.is_auction == true ? (
                    <>
                      {isApplied == true ? (
                        <>
                          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                            <p className="text-gray-500 text-center">
                              User Submitted Bid Information
                            </p>
                            <Separator />
                            <div className="flex gap-2">
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">Minimum Bid</h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_amount}
                                </p>
                              </div>

                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">
                                  Min Bid Increment
                                </h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_increment}
                                </p>
                              </div>
                              {bid.is_auction == true && (
                                <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                  <h1 className="text-center">Current Bid</h1>
                                  <p className="text-center text-xl">
                                    &#8377;{bid.max_bid_amount}
                                  </p>
                                </div>
                              )}
                            </div>
                      

                            <div className="flex justify-between mt-2">
                              <p>Fees Paid</p>
                              <p>&#8377;{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees Paid</p>
                                <p>&#8377;(-){bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>EMD Amount Paid</p>
                              <p>&#8377;{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted EMD Amount Paid</p>
                                <p>&#8377;(-){bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>User Bid Amount</p>
                              <p>&#8377;{bidTransact.amount}</p>
                            </div>
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="grid items-center gap-1.5 w-full mt-4">
                              <Label htmlFor="minbid">Enter Bid Amount</Label>
                              <Input
                                id="minbid"
                                type="text"
                                className="w-full"
                                ref={amount}
                                onChange={handleNumberChange}
                              />
                            </div>

                            {isPaying ? (
                              <Button className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]">
                                Loading...
                              </Button>
                            ) : (
                              <Button
                                onClick={() => create(true)}
                                className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                              >
                                Freeze Bid
                              </Button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                            <p className="text-gray-500 text-center">
                              User Submitted Bid Information
                            </p>
                            <Separator />

                            <div className="flex gap-2">
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">Minimum Bid</h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_amount}
                                </p>
                              </div>

                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">
                                  Min Bid Increment
                                </h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_increment}
                                </p>
                              </div>
                              {bid.is_auction == true && (
                                <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                  <h1 className="text-center">Current Bid</h1>
                                  <p className="text-center text-xl">
                                    &#8377;{bid.max_bid_amount}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="grid items-center gap-1.5 w-full mt-4">
                              <Label htmlFor="minbid">Enter Bid Amount</Label>
                              <Input
                                id="minbid"
                                type="text"
                                className="w-full"
                                ref={amount}
                                onChange={handleNumberChange}
                              />
                            </div>

                            <div className="flex justify-between mt-2">
                              <p>Tender Fees</p>
                              <p>&#8377;{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees</p>
                                <p>&#8377;(-){bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>EMD Amount</p>
                              <p>&#8377;{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted EMD Amount</p>
                                <p>&#8377;(-){bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="flex justify-between">
                              <p>Total Fees to be Paid</p>
                              <p>
                                &#8377;
                                {bid?.is_exemption == true
                                  ? parseInt(
                                      bid.fees_amount.toString() ?? "0"
                                    ) -
                                    parseInt(
                                      bid?.exempt[0].feesamount.toString() ??
                                        "0"
                                    ) +
                                    parseInt(bid.emd_amount.toString() ?? "0") -
                                    parseInt(
                                      bid?.exempt[0].emdamount.toString() ?? "0"
                                    )
                                  : parseInt(
                                      bid.fees_amount.toString() ?? "0"
                                    ) +
                                    parseInt(bid.emd_amount.toString() ?? "0")}
                              </p>
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
                              <Label htmlFor="transactionid">
                                Enter Transaction Id
                              </Label>
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
                                {fileUploader == null
                                  ? "Upload File"
                                  : "Change File"}
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
                                  onChange={(val) =>
                                    handleFileChange(val, setFileUploader)
                                  }
                                />
                              </div>
                            </div>

                            {isPaying ? (
                              <Button className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]">
                                Loading...
                              </Button>
                            ) : (
                              <Button
                                onClick={() => create(true)}
                                className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                              >
                                Pay Fees and Freeze Bid
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isApplied == true ? (
                        <>
                          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                            <p className="text-gray-500 text-center">
                              User Submitted Bid Information
                            </p>
                            <Separator />
                            <div className="flex gap-2">
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">Minimum Bid</h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_amount}
                                </p>
                              </div>

                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">
                                  Min Bid Increment
                                </h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_increment}
                                </p>
                              </div>
                              {bid.is_auction == true && (
                                <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                  <h1 className="text-center">Current Bid</h1>
                                  <p className="text-center text-xl">
                                    &#8377;{bid.max_bid_amount}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between mt-2">
                              <p>User Bid Amount</p>
                              <p>&#8377;{bidTransact.amount}</p>
                            </div>

                            <div className="flex justify-between mt-2">
                              <p>Fees Paid</p>
                              <p>&#8377;{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees Paid</p>
                                <p>&#8377;(-){bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>EMD Amount Paid</p>
                              <p>&#8377;{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted EMD Amount Paid</p>
                                <p>&#8377;(-){bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="flex justify-between">
                              <p>Total Amount Paid</p>
                              <p>
                                &#8377;
                                {bid?.is_exemption == true
                                  ? parseInt(
                                      bid.fees_amount.toString() ?? "0"
                                    ) -
                                    parseInt(
                                      bid?.exempt[0].feesamount.toString() ??
                                        "0"
                                    ) +
                                    parseInt(bid.emd_amount.toString() ?? "0") -
                                    parseInt(
                                      bid?.exempt[0].emdamount.toString() ?? "0"
                                    )
                                  : parseInt(
                                      bid.fees_amount.toString() ?? "0"
                                    ) +
                                    parseInt(bid.emd_amount.toString() ?? "0")}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                            <p className="text-gray-500 text-center">
                              User Submitted Bid Information
                            </p>
                            <Separator />
                            <div className="flex gap-2">
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">Minimum Bid</h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_amount}
                                </p>
                              </div>

                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1 className="text-center">
                                  Min Bid Increment
                                </h1>
                                <p className="text-center text-xl">
                                  &#8377;{bid.min_bid_increment}
                                </p>
                              </div>
                              {bid.is_auction == true && (
                                <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                  <h1 className="text-center">Current Bid</h1>
                                  <p className="text-center text-xl">
                                    &#8377;{bid.max_bid_amount}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="grid items-center gap-1.5 w-full mt-4">
                              <Label htmlFor="minbid">Enter Bid Amount</Label>
                              <Input
                                id="minbid"
                                type="text"
                                className="w-full"
                                ref={amount}
                                onChange={handleNumberChange}
                              />
                            </div>

                            <div className="flex justify-between mt-2">
                              <p>Tender Fees</p>
                              <p>&#8377;{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees</p>
                                <p>&#8377;(-){bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>EMD Amount</p>
                              <p>&#8377;{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted EMD Amount</p>
                                <p>&#8377;(-){bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="flex justify-between">
                              <p>Total Fees to be Paid</p>
                              <p>
                                &#8377;
                                {bid?.is_exemption == true
                                  ? parseInt(
                                      bid.fees_amount.toString() ?? "0"
                                    ) -
                                    parseInt(
                                      bid?.exempt[0].feesamount.toString() ??
                                        "0"
                                    ) +
                                    parseInt(bid.emd_amount.toString() ?? "0") -
                                    parseInt(
                                      bid?.exempt[0].emdamount.toString() ?? "0"
                                    )
                                  : parseInt(
                                      bid.fees_amount.toString() ?? "0"
                                    ) +
                                    parseInt(bid.emd_amount.toString() ?? "0")}
                              </p>
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
                              <Label htmlFor="transactionid">
                                Enter Transaction Id
                              </Label>
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
                                {fileUploader == null
                                  ? "Upload File"
                                  : "Change File"}
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
                                  onChange={(val) =>
                                    handleFileChange(val, setFileUploader)
                                  }
                                />
                              </div>
                            </div>

                            {isPaying ? (
                              <Button className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]">
                                Loading...
                              </Button>
                            ) : (
                              <Button
                                onClick={() => create(false)}
                                className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                              >
                                Pay Fees and Freeze Bid
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                    <p className="text-gray-500 text-center">
                      User Submitted Bid Information
                    </p>
                    <Separator />
                    <div className="mt-4">
                      This bid is for category (
                      {bid.is_open == true ? <>Open Bid, </> : <></>}
                      {bid.is_woman == true ? <>Women, </> : <></>}
                      {bid.is_reserved == true ? (
                        <>Reserved Category, </>
                      ) : (
                        <></>
                      )}
                      {bid.is_differently_abled == true ? (
                        <>Differently Abled, </>
                      ) : (
                        <></>
                      )}
                      {bid.is_msme == true ? <>MSME, </> : <></>}
                      {bid.is_sc_st == true ? <>SC/ST, </> : <></>}
                      {bid.tribal == true ? <>Tribal, </> : <></>}). You are not
                      eligible for this bid. Please Submit required document in
                      My Profile as per bid requirement if you belong to
                      relevant category.
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default ApplyForBidView;
