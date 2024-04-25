"use client";

import monthCrossRent from "@/action/report/monthcrossrent";
import getRentEnding from "@/action/report/rentending";
import BackButton from "@/components/backbutton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate } from "@/utils/methods";
import Link from "next/link";
import { useEffect, useState } from "react";

const ShopBidHistoryView = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const bids = await monthCrossRent({});

      if (bids.status) {
        setBids(bids.data ?? []);
      }
      setLoading(false);
    };
    init();
  }, []);

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
          <p className="text-xl text-gray-600">Month Corss Rent</p>
          <div className="grow"></div>
        </div>

        {bids.length == 0 ? (
          <p className="text-sm mt-4 mb-2">No Bid History found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Property Name.</TableHead>
                <TableHead>Shop No.</TableHead>
                <TableHead>Rent Amount</TableHead>
                <TableHead>Rent Count</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid, index) => (
                <TableRow key={index}>
                  <TableCell>{bid.shop.property.name}</TableCell>
                  <TableCell>{bid.shop.shopNumber}</TableCell>
                  <TableCell>&#8377;{bid.rent.rent_amount}</TableCell>
                  <TableCell>{bid.count}</TableCell>
                  <TableCell>
                    {formateDate(new Date(bid.rent.rent_start_date))}
                  </TableCell>
                  <TableCell>
                    {formateDate(new Date(bid.rent.rent_end_date))}
                  </TableCell>
                  <TableCell>{bid.status}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/shops/details/${bid.id}`}
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
