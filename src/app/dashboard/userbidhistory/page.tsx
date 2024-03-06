"use client";
import GetUserBid from "@/action/bid/getuserbid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { BidTransact } from "@prisma/client";
import Link from "next/link";

const UserBidHistoryPage = () => {
  const id: number = parseInt(getCookie("id") ?? "0");
  const [isLoading, setIsLoading] = useState(true);

  const [category, setCategory] = useState<string[]>([
    "All",
    "Pending",
    "Accepted",
    "Rejected",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filterbid, setFilterbid] = useState<any[]>([]);

  const [bids, setBids] = useState<any[]>([]);

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterbid(bids);
    } else if (category === "Pending") {
      const temp = bids.filter((item: any) => {
        return item.status === BidTransact.PENDING;
      });
      setFilterbid(temp);
    } else if (category === "Accepted") {
      const temp = bids.filter((item: any) => {
        return item.status === BidTransact.ACCEPTED;
      });
      setFilterbid(temp);
    } else if (category === "Rejected") {
      const temp = bids.filter((item: any) => {
        return item.status === BidTransact.REJECTED;
      });
      setFilterbid(temp);
    }
  };

  const init = async () => {
    setIsLoading(true);
    const bidresponse = await GetUserBid({
      userid: id,
    });

    if (bidresponse.status) {
      setBids(bidresponse.data ?? []);
      setFilterbid(bidresponse.data ?? []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6 sm:p-10">
      <h1 className="text-[#162f57] text-2xl font-semibold">
        Your Bid History
      </h1>
      <div className="mt-4 flex">
        {category.map((item: string, index: number) => (
          <p
            key={index}
            onClick={() => {
              filtershopbycategory(item);
              setSelectedCategory(item);
            }}
            className={`border-b-2 border-gray-300 px-4 py-2 text-sm font-medium cursor-pointer ${
              selectedCategory === item ? "border-green-500" : ""
            }`}
          >
            {item}
          </p>
        ))}
        <p className="border-b-2 border-gray-300 px-4 grow"></p>
      </div>

      {filterbid.length === 0 ? (
        <>
          <p className="mt-4 text-lg">No Bid Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Shop No.</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterbid.map((bid_tans: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bid_tans.bid.id}</TableCell>
                <TableCell>{bid_tans.shop.shopNumber}</TableCell>
                <TableCell>{bid_tans.amount}</TableCell>
                <TableCell>
                  {new Date(bid_tans.createdAt).toDateString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/bids/userbidinfo/${bid_tans.id}`}
                    className="bg-green-500 hover:bg-green-500 py-2 px-4 rounded-md text-white text-sm font-medium cursor-pointer"
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
  );
};
export default UserBidHistoryPage;
