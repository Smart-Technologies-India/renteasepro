"use client";

import GetBid from "@/action/bid/getbid";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";
import { IcBaselineCalendarMonth } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, formateDate } from "@/utils/methods";
import { ExemptFor, exempt, user } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

interface BidDetailsViewProps {
  bidid: number;
}

const BidDetailsView = (props: BidDetailsViewProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [bid, setBid] = useState<any>();

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const instructions = useRef<HTMLTextAreaElement>(null);
  const minbid = useRef<HTMLInputElement>(null);
  const minbidinc = useRef<HTMLInputElement>(null);
  const feesamount = useRef<HTMLInputElement>(null);
  const emdamount = useRef<HTMLInputElement>(null);

  const bgamount = useRef<HTMLInputElement>(null);
  const doctitle = useRef<HTMLInputElement>(null);
  const docdescription = useRef<HTMLTextAreaElement>(null);
  const filenumber = useRef<HTMLInputElement>(null);
  const filesubject = useRef<HTMLTextAreaElement>(null);

  const [user, setUser] = useState<user>();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const bidresponse = await GetBid({
        id: parseInt(props.bidid.toString()),
      });
      if (bidresponse.status) {
        setBid(bidresponse.data ?? ({} as any));
      }

      const userresponse = await GetUser({ id: userid });
      if (userresponse.status) {
        setUser(userresponse.data ?? ({} as user));
      }
      setLoading(false);
    };

    init();
  }, [props.bidid, userid]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6 sm:p-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#162f57] text-2xl font-semibold">View Bid</h1>
          <div className="grow"></div>
          {user?.role === "ADMIN" && (
            <>
              <Button
                className="bg-green-500 hover:bg-green-500 h-auto"
                onClick={() => router.push("/dashboard/bids")}
              >
                Edit Bid
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-500 h-auto"
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

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500 text-center">General Information</p>

          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="title">Bid Title</Label>
            <Input
              id="title"
              type="text"
              className="w-full bg-gray-100"
              value={bid?.title}
              ref={title}
              disabled
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="description">Bid Description</Label>
            <Textarea
              id="description"
              className="w-full bg-gray-100 h-20 resize-none"
              ref={description}
              value={bid?.description}
              disabled
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="instructions">Bid Instructions</Label>
            <Textarea
              id="instructions"
              className="w-full bg-gray-100 h-20 resize-none"
              ref={instructions}
              value={bid?.instruction ?? ""}
              disabled
            />
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4  cursor-not-allowed">
              <Label htmlFor="starttime">Start Date Time</Label>

              <Button
                variant={"outline"}
                disabled
                className={`w-full justify-start text-left font-normal cursor-not-allowed`}
              >
                <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />

                {formatDateTime(new Date(bid?.bidstartdate ?? ""))}
              </Button>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4  cursor-not-allowed">
              <Label htmlFor="enddatetime">End Date Time</Label>
              <Button
                variant={"outline"}
                disabled
                className={`w-full justify-start text-left font-normal`}
              >
                <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                {formatDateTime(new Date(bid?.bidenddate ?? ""))}
              </Button>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4 cursor-not-allowed">
              <Label htmlFor="enddatetime">Document Deadline Date</Label>
              <Button
                variant={"outline"}
                disabled
                className={`w-full justify-start text-left font-normal`}
              >
                <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                {formateDate(new Date(bid?.biddeclarationdate ?? ""))}
              </Button>
            </div>
          </div>

          {bid?.is_exemption == true && (
            <>
              <p className="text-gray-500 mt-4 text-center">Exempt</p>
              <Separator />
              <div className="flex gap-4 flex-wrap mt-2 items-center">
                <p className="text-gray-500">Select Exempt Category :</p>
                {bid.exempt!.map((item: exempt, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-sm shadow py-1 px-4"
                  >
                    {getExemptfor(item.fees_for!)}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap mt-2 items-center">
                <p className="text-gray-500">Select Exempt Section : </p>
                {bid.exempt[0].is_fees_exempt_allowed! ? (
                  <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                    Exempt Fees
                  </div>
                ) : (
                  <></>
                )}
                {bid.exempt[0].is_bg_exempt_allowed! ? (
                  <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                    Exempt BG
                  </div>
                ) : (
                  <></>
                )}
                {bid.exempt[0].is_emd_exempt_allowed! ? (
                  <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                    Exempt EMD
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex gap-4">
                {bid.exempt[0].is_fees_exempt_allowed! && (
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="feesamount">Exempt Fees Amount</Label>
                    <Input
                      type="text"
                      className="w-full bg-gray-100"
                      value={bid?.exempt[0].feesamount.toString()}
                      disabled
                    />
                  </div>
                )}
                {bid.exempt[0].is_bg_exempt_allowed! && (
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="bgamount">Exempt BG Amount</Label>
                    <Input
                      type="text"
                      className="w-full bg-gray-100"
                      value={bid?.exempt[0].bgamount.toString()}
                      disabled
                    />
                  </div>
                )}
                {bid.exempt[0].is_emd_exempt_allowed! && (
                  <div className="grid items-center gap-1.5 w-full mt-4">
                    <Label htmlFor="emdamount">Exempt EMD Amount</Label>
                    <Input
                      type="text"
                      className="w-full bg-gray-100"
                      value={bid?.exempt[0].emdamount.toString()}
                      disabled
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-gray-500 mt-4 text-center">Fees Structure</p>
          <Separator />
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">Minimum Bid</Label>
              <Input
                id="minbid"
                type="text"
                className="w-full bg-gray-100"
                ref={minbid}
                disabled
                value={bid?.min_bid_amount.toString()}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="minbid">Min Bid Increment</Label>
              <Input
                id="minbid"
                type="text"
                className="w-full bg-gray-100"
                ref={minbidinc}
                disabled
                value={bid?.min_bid_increment.toString()}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="feesamount">Fees Amount</Label>
              <Input
                id="feesamount"
                type="text"
                className="w-full bg-gray-100"
                ref={feesamount}
                value={bid?.fees_amount.toString()}
                disabled
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="emdamount">EMD Amount</Label>
              <Input
                id="emdamount"
                type="text"
                className="w-full bg-gray-100"
                ref={emdamount}
                value={bid?.emd_amount.toString()}
                disabled
              />
            </div>

            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="bgamount">BG Amount</Label>
              <Input
                id="bgamount"
                type="text"
                className="w-full bg-gray-100"
                ref={bgamount}
                value={bid?.bg_amount.toString()}
                disabled
              />
            </div>
          </div>

          <p className="text-gray-500 mt-4 text-center">Document Required</p>
          <Separator />

          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="doctitle">Document Title</Label>
            <Input
              id="doctitle"
              type="text"
              className="w-full bg-gray-100"
              ref={doctitle}
              value={bid?.docone ?? ""}
              disabled
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="docdescription">Document Description</Label>
            <Textarea
              id="docdescription"
              className="w-full bg-gray-100 h-20 resize-none"
              ref={docdescription}
              value={bid?.doconedescription ?? ""}
              disabled
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
              className="w-full bg-gray-100"
              ref={filenumber}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="filesubject">File Subject</Label>
            <Textarea
              id="filesubject"
              className="w-full bg-gray-100 h-20 resize-none"
              ref={filesubject}
            />
          </div>

          <div className="flex gap-4 mt-4 items-center">
            <Label htmlFor="termfile">Terms & Conditions File</Label>
            <Button variant={"secondary"}>Upload File</Button>
            <p className="text-sm">No File Selected</p>
          </div>

          <div className="flex gap-4 flex-wrap items-center mt-4">
            <p className="text-gray-500">Select Bidder Category</p>
            {bid.is_woman == true ? (
              <>
                <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                  For Women
                </div>
              </>
            ) : (
              <></>
            )}
            {bid.is_reserved == true ? (
              <>
                <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                  For Reserved Category
                </div>
              </>
            ) : (
              <></>
            )}
            {bid.is_differently_abled == true ? (
              <>
                <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                  For Differently Abled
                </div>
              </>
            ) : (
              <></>
            )}
            {bid.is_msme == true ? (
              <>
                <div className="bg-gray-100 rounded-sm shadow py-1 px-4">
                  For MSME
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default BidDetailsView;
