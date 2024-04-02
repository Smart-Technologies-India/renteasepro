"use client";

import UpdateBidStatus from "@/action/bid/changebidstatus";
import GetBid from "@/action/bid/getbid";
import GetBidTran from "@/action/bid_transact/getbidtransact";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, formateDate } from "@/utils/methods";
import {
  BidStatus,
  ExemptFor,
  bid,
  bid_transact,
  exempt,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface UserBidInfoViewProps {
  bidid: number;
}

const UserBidInfoView = (props: UserBidInfoViewProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();
  const [user, setUser] = useState<user>();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [bid, setBid] = useState<any>();
  const [bidtran, setBidTran] = useState<any>();
  const [editAll, setEditAll] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const bidtranresponse = await GetBidTran({
        id: props.bidid,
      });
      if (bidtranresponse.status) {
        setBidTran(bidtranresponse.data ?? ({} as bid_transact));
      }

      const bidresponse = await GetBid({ id: props.bidid });
      if (bidresponse.status) {
        setBid(bidresponse.data ?? ({} as bid));
      }
      const userresponse = await GetUser({ id: userid });
      if (userresponse.status) {
        setUser(userresponse.data ?? ({} as user));
      }
      setLoading(false);
    };
    init();
  }, [props.bidid, userid]);

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

  const changeBidStatus = async (status: BidStatus) => {
    const updateresponse = await UpdateBidStatus({
      id: bid.id,
      status: status,
    });
    if (updateresponse.status) {
      toast.success(updateresponse.message);
      setLoading(true);

      const bidtranresponse = await GetBidTran({
        id: props.bidid,
      });
      if (bidtranresponse.status) {
        setBidTran(bidtranresponse.data ?? ({} as bid_transact));
      }

      const bidresponse = await GetBid({ id: props.bidid });
      if (bidresponse.status) {
        setBid(bidresponse.data ?? ({} as bid));
      }
      const userresponse = await GetUser({ id: userid });
      if (userresponse.status) {
        setUser(userresponse.data ?? ({} as user));
      }
      setLoading(false);
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
        <div className="items-center gap-4 flex">
          <BackButton />
          <h1 className="text-[#162f57] text-2xl font-semibold">Bid Details</h1>
          <div className="grow"></div>
          {user?.role === "ADMIN" && (
            <>
              <Button
                className="bg-blue-500"
                onClick={() => router.push(`/dashboard/bids/bidreport/${bid.id}`)}
              >
                Print Report
              </Button>
              {bid.bid_status == "PUBLISHED" ? (
                <Button
                  className="bg-rose-500 h-auto"
                  onClick={() => changeBidStatus(BidStatus.NOTPUBLISHED)}
                >
                  UNPUBLISH BID
                </Button>
              ) : (
                <Button
                  className="bg-green-500 h-auto"
                  onClick={() => changeBidStatus(BidStatus.PUBLISHED)}
                >
                  PUBLISH BID
                </Button>
              )}
              {bid.bid_status == BidStatus.NOTPUBLISHED ||
              bid.bid_status == BidStatus.DRAFT ? (
                <Button
                  className="bg-black h-auto"
                  onClick={() =>
                    router.push(`/dashboard/bids/editbid/${bid.id}`)
                  }
                >
                  Edit Bid
                </Button>
              ) : (
                <></>
              )}

              <Button
                className="bg-black h-auto"
                onClick={() =>
                  router.push(`/dashboard/bids/biderslist/${bid?.id}`)
                }
              >
                View All Bidders
              </Button>
            </>
          )}
        </div>

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
            <div className="bg-white rounded-sm shadow-sm p-4 my-2">
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
                  className="bg-green-500 hover:bg-green-500 py-1 px-4 rounded-md text-white cursor-pointer"
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

                <h1 className="mt-2">- Allowed Bidder Category</h1>
                <div className="flex gap-2 flex-wrap items-center mt-4">
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
                  {bid.is_sc_st == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        For SC/ST
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {bid.tribal == true ? (
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        For Tribal
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="mt-4"></div>
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
              {user?.role === "ADMIN" ? (
                <></>
              ) : (
                <>
                  <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                    <p className="text-gray-500 text-center">
                      User Submitted Bid Information
                    </p>
                    <Separator />
                    <h1 className="mt-2">Amount:</h1>
                    <p>- {bidtran.amount.toString()}</p>
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
export default UserBidInfoView;
