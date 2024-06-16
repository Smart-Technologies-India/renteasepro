"use client";

import GetBidsByShop from "@/action/bid/getbidsbyshop";
import BackButton from "@/components/backbutton";
import { FluentMdl2Home } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ShopBidHistoryViewProps {
  id: number;
}

const ShopBidHistoryView = (props: ShopBidHistoryViewProps) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const bids = await GetBidsByShop({
        shopid: parseInt(props.id.toString()),
      });

      if (bids.status) {
        setBids(bids.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, [props.id]);

  const getBidAmount = (bid: any[]): string => {
    let min_bid_amount = 0;
    bid.forEach((element) => {
      if (element.amount > min_bid_amount) {
        min_bid_amount = element.amount;
      }
    });
    return min_bid_amount.toString();
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
        <div className="flex gap-4 items-center">
          <BackButton />
          <FluentMdl2Home className="text-xl" />
          <p className="text-xl text-gray-600">Shop Bids History</p>
          <div className="grow"></div>
        </div>

        {bids.length == 0 ? (
          <p className="text-sm mt-4 mb-2">No Bid History found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Shop No.</TableHead>
                <TableHead>Bidders Count</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid, index) => (
                <TableRow key={index}>
                  <TableCell>{bid.shop.shopNumber}</TableCell>
                  <TableCell>{bid.bidderscount}</TableCell>
                  <TableCell>&#8377;{getBidAmount(bid.bid_transact)}</TableCell>
                  <TableCell>
                    {new Date(bid.bidstartdate).getDate()}-
                    {new Date(bid.bidstartdate).getMonth() + 1}-
                    {new Date(bid.bidstartdate).getFullYear()}
                  </TableCell>
                  <TableCell>
                    {new Date(bid.bidenddate).getDate()}-
                    {new Date(bid.bidenddate).getMonth() + 1}-
                    {new Date(bid.bidenddate).getFullYear()}
                  </TableCell>
                  <TableCell>{bid.status}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/bids/userbidinfo/${bid.id}`}
                      className="bg-green-500 hover:bg-green-500 py-1 px-4 rounded-md text-white"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default ShopBidHistoryView;
