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

import { formateDate } from "@/utils/methods";
import BackButton from "@/components/backbutton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import GetAllPaidRent from "@/action/rent_transact/getallpaid";

interface UserRentHistoryViewProps {
  id: number;
}

const UserRentHistoryView = (props: UserRentHistoryViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [rentTransact, setRentTransact] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const rentresponse = await GetAllPaidRent({});

      if (rentresponse.status) {
        setRentTransact(rentresponse.data ?? []);
      }

      console.log(rentresponse);

      setIsLoading(false);
    };

    init();
  }, [props.id]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Rent payment History
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
              <TableHead className="w-[180px]">User</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentTransact.map((rent_data: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {rent_data.user.firstName} - {rent_data.user.lastName} [
                  {rent_data.user.contactone}]
                </TableCell>

                <TableCell>{rent_data.shop.property.name}</TableCell>
                <TableCell>{rent_data.shop.shopNumber}</TableCell>
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
                  {rent_data.status == "PAID" ? (
                    <Button
                      onClick={() => {
                        router.push(
                          `/dashboard/rentrecept/${rent_data.user.id}/${rent_data.rentId}/${rent_data.transactionid}`
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
