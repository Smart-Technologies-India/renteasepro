"use client";

import ApplyBid from "@/action/bid/applybid";
import GetBid from "@/action/bid/getbid";
import getFromUser from "@/action/bid_transact/getfromuser";
import getUploadFileUser from "@/action/user/getuploadedfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  formatDateTime,
  formateDate,
  handleNumberChange,
} from "@/utils/methods";
import { ExemptFor, UserDocType, bid, exempt } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [bid, setBid] = useState<any>();

  const amount = useRef<HTMLInputElement>(null);

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [bidTransact, setBidTransact] = useState<any>();

  const [isAplicable, setIsApplicable] = useState<boolean>(false);

  // interface FileGetResponse {
  //   status: boolean;
  //   path: string;
  // }

  // const [getWomenFile, setGetWomenFile] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  // const [getCategory, setGetCategory] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  // const [getAbled, setGetAbled] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  // const [getMsme, setGetMsme] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  // const [getStsc, setGetStsc] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  // const [getTribal, setGetTribal] = useState<FileGetResponse>({
  //   status: false,
  //   path: "",
  // });

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const bidresponse = await GetBid({
        id: parseInt(props.bidid.toString()),
      });
      if (bidresponse.status) {
        setBid(bidresponse.data ?? ({} as bid));
        // setIsOpen(bidresponse.data?.is_auction ?? false);
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
        if (womenfileresponse.status && bidresponse.data.is_woman) return true;
        if (categoryresponse.status && bidresponse.data.is_reserved)
          return true;
        if (abledresponse.status && bidresponse.data.is_differently_abled)
          return true;
        if (msmeresponse.status && bidresponse.data.is_msme) return true;
        if (stscresponse.status && bidresponse.data.is_stsc) return true;
        if (tribalresponse.status && bidresponse.data.is_tribal) return true;
        return false;
      };
      const value = setApplicable();

      setIsApplicable(() => value);

      console.log("isApplicable", value);
      // file info end here
      setLoading(false);
    };

    init();
  }, [props.bidid, userid]);

  const create = async () => {
    if (
      amount.current?.value === "" ||
      amount.current?.value == undefined ||
      amount.current?.value == null
    )
      return toast.error("Please enter bid amount");

    if (bid?.is_auction == false) {
      if (
        parseInt(amount.current?.value ?? "0") <
        bid.min_bid_amount + bid.min_bid_increment
      )
        return toast.error(
          "Bid amount should be greater than minimum bid amount"
        );
    } else {
      if (
        parseInt(amount.current?.value ?? "0") <
        bid.max_bid_amount + bid.min_bid_increment
      )
        return toast.error(
          "Bid amount should be greater than current bid amount"
        );
    }

    if (parseInt(amount.current?.value ?? "0") % bid.min_bid_increment != 0)
      return toast.error(
        `Bid amount should be in multiple of Rs.${bid.min_bid_increment}`
      );

    const createbid = await ApplyBid({
      amount: parseInt(amount.current?.value ?? "0"),
      bidId: parseInt(props.bidid.toString()),
      shopId: bid?.shopId ?? 0,
      userId: parseInt(userid.toString()),
    });

    if (!createbid.status) return toast.error(createbid.message);
    toast.success(createbid.message);
    router.back();
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
      <div className="p-6 sm:p-10">
        <h1 className="text-[#162f57] text-2xl font-semibold">Bid Details</h1>
        <p className="text-sm mt-4 mb-2">
          Get started by adding your Bid details below.
        </p>

        {page == 0 && (
          <div className="bg-white rounded-sm shadow-sm p-4 my-2">
            <p className="text-gray-500 text-center">General Information</p>
            <Separator />
            <div className="flex gap-4">
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Property Name:</h1>
                <p>- {bid.shop.property.name}</p>
              </div>
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Shop Number:</h1>
                <p>- {bid.shop.shopNumber}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Bid Title:</h1>
                <p>- {bid.title}</p>
              </div>
              <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                <h1>Bid Description:</h1>
                <p>- {bid.description}</p>
              </div>
            </div>
            <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md">
              <h1>Bid Instructions:</h1>
              <p>- {bid.instruction}</p>
            </div>
            <div className="mt-4"></div>
            <Separator />
            <div className="flex justify-between w-full mt-2">
              <div className="grow"></div>
              <Button className="" onClick={nextpage}>
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
                  <p className="text-center">{bid.fees_amount}</p>
                </div>

                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Emd Amount:</h1>
                  <p className="text-center">{bid.emd_amount}</p>
                </div>

                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Bg Amount:</h1>
                  <p className="text-center">{bid.bg_amount}</p>
                </div>
              </div>

              <div className="flex gap-4 items-center justify-around w-full mt-2">
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Minimum Bid:</h1>
                  <p className="text-center">{bid.min_bid_amount}</p>
                </div>
                {bid.is_auction == true && (
                  <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                    <h1 className="text-center">Current Bid:</h1>
                    <p className="text-center">{bid.max_bid_amount}</p>
                  </div>
                )}
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1">
                  <h1 className="text-center">Min Bid Increment:</h1>
                  <p className="text-center">{bid.min_bid_increment}</p>
                </div>
              </div>

              <div className="mt-4"></div>
              <Separator />
              <div className="flex justify-between w-full mt-2">
                <Button className="" onClick={prevpage}>
                  Go To Previous
                </Button>
                <Button className="" onClick={nextpage}>
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
              <h1 className="mt-2">Document Title:</h1>
              <p>- {bid.docone}</p>

              <h1 className="mt-2">Document Description:</h1>
              <p>- {bid.doconedescription}</p>

              <h1 className="mt-2">File Number:</h1>
              <p>- {bid.t_and_c_file_number}</p>

              <h1 className="mt-2">File Subject:</h1>
              <p>- {bid.t_and_c_description}</p>
              <div className="flex gap-4 mt-4 items-center">
                <Label htmlFor="termfile">Terms & Conditions File</Label>
                <a
                  download={true}
                  href={bid.t_and_c_upload}
                  className="bg-green-500 hover:bg-green-500 py-1 px-4 rounded-md text-white"
                >
                  Download File
                </a>
              </div>
              <div className="mt-4"></div>
              <Separator />
              <div className="flex justify-between w-full mt-2">
                <Button className="" onClick={prevpage}>
                  Go To Previous
                </Button>
                <Button className="" onClick={nextpage}>
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
                        For Women
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_reserved == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        For Reserved Category
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_differently_abled == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        For Differently Abled
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.is_msme == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        For MSME
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
                          Exempt Fees
                        </div>
                      ) : (
                        <></>
                      )}
                      {bid.exempt[0].is_bg_exempt_allowed! ? (
                        <div className="bg-gray-100 rounded-sm shadow py-1 px-4  text-xs">
                          Exempt BG
                        </div>
                      ) : (
                        <></>
                      )}
                      {bid.exempt[0].is_emd_exempt_allowed! ? (
                        <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                          Exempt EMD
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    {bid.exempt[0].is_fees_exempt_allowed! && (
                      <div className="grid items-center gap-1.5 w-full mt-4">
                        <h1 className="mt-2">Exempt Fees Amount:</h1>
                        <p>- {bid?.exempt[0].feesamount.toString()}</p>
                      </div>
                    )}
                    {bid.exempt[0].is_bg_exempt_allowed! && (
                      <div className="grid items-center gap-1.5 w-full mt-4">
                        <h1 className="mt-2">Exempt BG Amount:</h1>
                        <p>- {bid?.exempt[0].bgamount.toString()}</p>
                      </div>
                    )}
                    {bid.exempt[0].is_emd_exempt_allowed! && (
                      <div className="grid items-center gap-1.5 w-full mt-4">
                        <h1 className="mt-2">Exempt EMD Amount:</h1>
                        <p>- {bid?.exempt[0].emdamount.toString()}</p>
                      </div>
                    )}
                  </>
                )}
                <Separator />
                <div className="flex justify-between w-full mt-2">
                  <Button className="" onClick={prevpage}>
                    Go To Previous
                  </Button>
                </div>
              </div>

              {isAplicable == true ? (
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
                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Minimum Bid:</h1>
                              <p>{bid.min_bid_amount}</p>
                            </div>

                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Min Bid Increment:</h1>
                              <p>{bid.min_bid_increment}</p>
                            </div>
                            {bid.is_auction == true && (
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1>Current Bid:</h1>
                                <p>{bid.max_bid_amount}</p>
                              </div>
                            )}

                            <div className="flex justify-between mt-2">
                              <p>Fees Paid</p>
                              <p>{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees Paid</p>
                                <p>-{bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>Emd Amount Paid</p>
                              <p>{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Emd Amount Paid</p>
                                <p>-{bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>User Bid Amount</p>
                              <p>{bidTransact.amount}</p>
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

                            <Button onClick={create} className="w-full mt-4">
                              Pay Fees and Submit
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                            <p className="text-gray-500 text-center">
                              User Submitted Bid Information
                            </p>
                            <Separator />
                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Minimum Bid:</h1>
                              <p>{bid.min_bid_amount}</p>
                            </div>

                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Min Bid Increment:</h1>
                              <p>{bid.min_bid_increment}</p>
                            </div>
                            {bid.is_auction == true && (
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1>Current Bid:</h1>
                                <p>{bid.max_bid_amount}</p>
                              </div>
                            )}
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
                              <p>Fees</p>
                              <p>{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees</p>
                                <p>-{bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>Emd Amount</p>
                              <p>{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Emd Amount</p>
                                <p>-{bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="flex justify-between">
                              <p>Total Fees to be Paid</p>
                              <p>
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
                            <Button onClick={create} className="w-full mt-4">
                              Pay Fees and Submit
                            </Button>
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
                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Minimum Bid:</h1>
                              <p>{bid.min_bid_amount}</p>
                            </div>

                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Min Bid Increment:</h1>
                              <p>{bid.min_bid_increment}</p>
                            </div>
                            {bid.is_auction == true && (
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1>Current Bid:</h1>
                                <p>{bid.max_bid_amount}</p>
                              </div>
                            )}

                            <div className="flex justify-between mt-2">
                              <p>User Bid Amount</p>
                              <p>{bidTransact.amount}</p>
                            </div>

                            <div className="flex justify-between mt-2">
                              <p>Fees Paid</p>
                              <p>{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees Paid</p>
                                <p>-{bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>Emd Amount Paid</p>
                              <p>{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Emd Amount Paid</p>
                                <p>-{bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="flex justify-between">
                              <p>Total Amount Paid</p>
                              <p>
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
                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Minimum Bid:</h1>
                              <p>{bid.min_bid_amount}</p>
                            </div>

                            <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                              <h1>Min Bid Increment:</h1>
                              <p>{bid.min_bid_increment}</p>
                            </div>
                            {bid.is_auction == true && (
                              <div className="p-2 bg-gray-100 mt-2 rounded-md flex-1 text-sm">
                                <h1>Current Bid:</h1>
                                <p>{bid.max_bid_amount}</p>
                              </div>
                            )}
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
                              <p>Fees</p>
                              <p>{bid.fees_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Fees</p>
                                <p>-{bid?.exempt[0].feesamount}</p>
                              </div>
                            )}
                            <div className="flex justify-between mt-2">
                              <p>Emd Amount</p>
                              <p>{bid.emd_amount}</p>
                            </div>
                            {bid?.is_exemption == true && (
                              <div className="flex justify-between mt-2">
                                <p>Exempted Emd Amount</p>
                                <p>-{bid?.exempt[0].emdamount}</p>
                              </div>
                            )}
                            <div className="mt-4"></div>
                            <Separator />
                            <div className="flex justify-between">
                              <p>Total Fees to be Paid</p>
                              <p>
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
                            <Button onClick={create} className="w-full mt-4">
                              Pay Fees and Submit
                            </Button>
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
                      Your are not applicable for this bid. Please Submit required document as per bid requirement.
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
