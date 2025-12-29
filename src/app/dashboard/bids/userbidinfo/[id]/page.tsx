"use client";

import UpdateBidStatus from "@/action/bid/changebidstatus";
import GetBid from "@/action/bid/getbid";
import GetBidTran from "@/action/bid_transact/getbidtransact";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";

const getExemptfor = (value: ExemptFor): string => {
  switch (value) {
    case ExemptFor.WOMEN:
      return "Women";
    case ExemptFor.RESERVED:
      return "Reserved Category";
    case ExemptFor.DIFFERENTLY_ABLED:
      return "Differently Abled";
    case ExemptFor.MSME:
      return "MSME";
    default:
      return "Women";
  }
};

const UserBidInfoView = () => {
  const param = useParams();

  const id: number = parseInt(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0"
  );
  const [isBox, setIsBox] = useState<boolean>(false);

  const [userid, setUserid] = useState<number>(0);
  const router = useRouter();
  const [user, setUser] = useState<user>();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [bid, setBid] = useState<any>();
  const [bidtran, setBidTran] = useState<any>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);

      const bidtranresponse = await GetBidTran({
        id: id
      });
      if (bidtranresponse.status) {
        setBidTran(bidtranresponse.data ?? ({} as bid_transact));
      }

      const bidresponse = await GetBid({ id: id });
      if (bidresponse.status) {
        setBid(bidresponse.data ?? ({} as bid));
      }
      const userresponse = await GetUser({ id: authResponse.data });
      if (userresponse.status) {
        setUser(userresponse.data ?? ({} as user));
      }
      setLoading(false);
    };
    init();
  }, [id, userid]);

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
        id: id
      });
      if (bidtranresponse.status) {
        setBidTran(bidtranresponse.data ?? ({} as bid_transact));
      }

      const bidresponse = await GetBid({ id: id });
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

  const expirebid = async () => {
    const updateresponse = await UpdateBidStatus({
      id: bid.id,
      status: BidStatus.EXPIRED,
    });
    if (updateresponse.status) {
      router.push("/dashboard");
    } else {
      toast.error(updateresponse.message);
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

          {bid.bid_status != BidStatus.EXPIRED && (
            <>
              <button
                className="text-white bg-rose-500 hover:bg-rose-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                onClick={() => setIsBox(true)}
              >
                Expire Bid
              </button>
            </>
          )}

          {["ADMIN", "MANAGER"].includes(user?.role!) && (
            <>
              {bid.bidenddate < new Date() ? (
                <>
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                    onClick={() =>
                      router.push(`/dashboard/bids/bidreport/${bid.id}`)
                    }
                  >
                    Print Report
                  </button>
                </>
              ) : (
                <>
                  {bid.bid_status == "PUBLISHED" ? (
                    <button
                      className="text-white bg-rose-500 hover:bg-rose-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                      onClick={() => changeBidStatus(BidStatus.NOTPUBLISHED)}
                    >
                      Unpublish Bid
                    </button>
                  ) : (
                    <button
                      className="text-white bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                      onClick={() => changeBidStatus(BidStatus.PUBLISHED)}
                    >
                      Publish Bid
                    </button>
                  )}
                </>
              )}

              {bid.bidenddate < new Date() ? (
                <></>
              ) : (
                <>
                  {bid.bid_status == BidStatus.NOTPUBLISHED ||
                  bid.bid_status == BidStatus.DRAFT ? (
                    <button
                      className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                      onClick={() =>
                        router.push(`/dashboard/bids/editbid/${bid.id}`)
                      }
                    >
                      Edit Bid
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              )}

              <button
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                onClick={() =>
                  router.push(`/dashboard/bids/biderslist/${bid?.id}`)
                }
              >
                View All Bidders
              </button>
            </>
          )}
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
              <button
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                onClick={nextpage}
              >
                Go To Next
              </button>
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
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={prevpage}
                >
                  Go To Previous
                </button>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={nextpage}
                >
                  Go To Next
                </button>
              </div>
            </div>
          </>
        )}

        {page == 2 && (
          <>
            <div className="bg-white rounded-sm shadow-sm p-4 my-2">
              <p className="text-gray-500 text-center">Document Required</p>
              <Separator />

              <div className="grid grid-cols-5 gap-4 items-start justify-around w-full mt-4">
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1 col-span-2">
                  <h1 className="text-center">Document Title</h1>
                  <p className="text-center">{bid.docone ?? "-"}</p>
                </div>
                <div className="p-2 px-4 bg-gray-100 mt-2 rounded-md flex-1 col-span-3">
                  <h1 className="text-center">Document Description</h1>
                  <p className="text-center">{bid.doconedescription ?? "-"}</p>
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
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={prevpage}
                >
                  Go To Previous
                </button>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                  onClick={nextpage}
                >
                  Go To Next
                </button>
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

                <h1 className="mt-2">Allowed Bidder Category</h1>
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
                    <>
                      <div className="bg-gray-100 rounded-sm shadow py-1 px-4 text-xs">
                        SC/ST
                      </div>
                    </>
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
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
                    onClick={prevpage}
                  >
                    Go To Previous
                  </button>
                </div>
              </div>
              {["ADMIN", "MANAGER"].includes(user?.role!) ? (
                <></>
              ) : (
                <>
                  <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
                    <p className="text-gray-500 text-center">
                      User Submitted Bid Information
                    </p>
                    <Separator />
                    <h1 className="mt-2">Amount:</h1>
                    <p>{bidtran.amount ?? "-"}</p>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        <AlertDialog open={isBox} onOpenChange={setIsBox}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Warning</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to expire this bid?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={expirebid}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};
export default UserBidInfoView;
