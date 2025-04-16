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
import { daily_property, daily_rent, daily_shop, user } from "@prisma/client";
import { formateDate } from "@/utils/methods";
import { useRouter } from "next/navigation";
import IsProfileCompleted from "@/action/user/isprofilecompleted";
import GetUserBookingHistory from "@/action/dailyrent/getuserbookinghistory";
import Link from "next/link";

const UserBookingPage = () => {
  const id: number = parseInt(getCookie("id") ?? "0");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [booking, setBooking] = useState<
    Array<
      daily_rent & {
        daily_shop: daily_shop & { property: daily_property };
        user: user;
      }
    >
  >([]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const isprofilecompleted = await IsProfileCompleted({
        id: id,
      });

      if (!isprofilecompleted.status) {
        return router.push("/dashboard/userprofile/edit");
      }
      const booking_response = await GetUserBookingHistory({
        userid: id,
      });

      if (booking_response.status && booking_response.data) {
        setBooking(booking_response.data);
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
      <h1 className="text-[#162f57] text-2xl font-semibold">Booking History</h1>

      {booking.length === 0 ? (
        <>
          <p className="mt-4 text-lg">No Bookig Data Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Property Name</TableHead>
              <TableHead>Unit Name.</TableHead>
              <TableHead>From Date.</TableHead>
              <TableHead>To Date.</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {booking.map(
              (
                val: daily_rent & {
                  daily_shop: daily_shop & { property: daily_property };
                  user: user;
                },
                index: number
              ) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{val.id}</TableCell>
                  <TableCell>{val.daily_shop.property.name}</TableCell>
                  <TableCell>{val.daily_shop.name}</TableCell>
                  <TableCell>
                    {formateDate(new Date(val.event_from_date))}
                  </TableCell>
                  <TableCell>
                    {formateDate(new Date(val.event_to_date))}
                  </TableCell>

                  <TableCell className="p-2">
                    &#8377;
                    {parseInt(val.deposit_amount) +
                      parseInt(val.event_amount) +
                      (val.handover_day
                        ? parseInt(val.handover_day_amount ?? "0")
                        : 0) +
                      (val.prep_day_amount
                        ? parseInt(val.prep_day_amount ?? "0")
                        : 0)}
                  </TableCell>

                  <TableCell>
                    {val.is_approved == true
                      ? "Accepted"
                      : val.is_cancel == true
                      ? "Cancel"
                      : "Pending"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/dailyshops/viewrent/${val.id}/${val.userId}`}
                      className="bg-blue-500 text-white rounded-md text-sm px-4 grid place-items-center h-8  hover:bg-blue-600"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default UserBookingPage;
