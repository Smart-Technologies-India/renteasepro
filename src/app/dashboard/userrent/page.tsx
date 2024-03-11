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
import { getCookie } from "cookies-next";
import Link from "next/link";
import { RentStatus } from "@prisma/client";
import GetUserRent from "@/action/rent/getrentbyuser";
import { formateDate } from "@/utils/methods";

const UserRentPage = () => {
  const id: number = parseInt(getCookie("id") ?? "0");
  const [isLoading, setIsLoading] = useState(true);

  const category = ["All", "Running", "Completed"];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filterrent, setFilterRent] = useState<any[]>([]);

  const [rents, setRents] = useState<any[]>([]);

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterRent(rents);
    } else if (category === "Running") {
      const temp = rents.filter((item: any) => {
        return item.status === RentStatus.RUNNING;
      });
      setFilterRent(temp);
    } else if (category === "Completed") {
      const temp = rents.filter((item: any) => {
        return item.status === RentStatus.COMPLETED;
      });
      setFilterRent(temp);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const rentresponse = await GetUserRent({
        userid: id,
      });

      if (rentresponse.status) {
        setRents(rentresponse.data ?? []);
        setFilterRent(rentresponse.data ?? []);
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
    <div className="p-6 sm:p-10">
      <h1 className="text-[#162f57] text-2xl font-semibold">Your Rent</h1>
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

      {filterrent.length === 0 ? (
        <>
          <p className="mt-4 text-lg">No Rent Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Shop No.</TableHead>
              <TableHead>Rent Amount</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterrent.map((rent_data: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{rent_data.id}</TableCell>
                <TableCell>{rent_data.shop.shopNumber}</TableCell>
                <TableCell>{rent_data.rent_amount}</TableCell>
                <TableCell>
                  {formateDate(new Date(rent_data.rent_start_date))}
                </TableCell>
                <TableCell className="flex">
                  <Link
                    href={`/dashboard/userrent/details/${rent_data.id}`}
                    className="bg-green-500 hover:bg-green-500 py-2 px-4 rounded-md text-white text-sm font-medium cursor-pointer"
                  >
                    View
                  </Link>
                  <div className="w-4"></div>
                  <Link
                    href={`/dashboard/userrent/history/${rent_data.id}`}
                    className="bg-green-500 hover:bg-green-500 py-2 px-4 rounded-md text-white text-sm font-medium cursor-pointer"
                  >
                    History
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
export default UserRentPage;
