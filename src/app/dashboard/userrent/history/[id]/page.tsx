"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { decryptURLData, formateDate, encryptURLData } from "@/utils/methods";
import GetFromRent from "@/action/rent_transact/getfromrent";
import BackButton from "@/components/backbutton";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const UserRentHistoryView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const param = useParams();
  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );

  const id: number = parseInt(encid);

  const [rentTransact, setRentTransact] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const rentresponse = await GetFromRent({
        rentid: id,
      });

      if (rentresponse.status) {
        setRentTransact(rentresponse.data ?? []);
      }

      setIsLoading(false);
    };

    init();
  }, [id]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <BackButton />
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Your Rent History
        </h1>
      </div>

      {rentTransact.length === 0 ? (
        <>
          <p className="mt-4 text-lg">No Rent Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Transaction Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentTransact.map((rent_data: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{rent_data.id}</TableCell>

                <TableCell>
                  {new Date(rent_data.formonth).toLocaleString("default", {
                    month: "long",
                  })}
                </TableCell>
                <TableCell>{rent_data.amount}</TableCell>
                <TableCell>
                  {rent_data.status == "PAID"
                    ? formateDate(new Date(rent_data.transaction_date))
                    : "-"}
                </TableCell>
                <TableCell>
                  {rent_data.status == "PAID" ? rent_data.transactionid : "-"}
                </TableCell>
                <TableCell>{rent_data.status}</TableCell>
                <TableCell>
                  {rent_data.status == "PAID" ? (
                    <Button
                      onClick={() => {
                        router.push(
                          `/dashboard/rentrecept/${encryptURLData(rent_data.user.id.toString())}/${encryptURLData(rent_data.rentId.toString())}/${encryptURLData(rent_data.transactionid)}`
                        );
                      }}
                      className="cursor-pointer"
                    >
                      View Rent Receipt
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default UserRentHistoryView;
