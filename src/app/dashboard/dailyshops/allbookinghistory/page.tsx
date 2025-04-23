"use client";

import GetAllDailyRent from "@/action/dailyrent/getalldailyrent";
import BackButton from "@/components/backbutton";
import { FluentMdl2Home } from "@/components/icons";
import Pagination from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/usepagination";
import { formateDate } from "@/utils/methods";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  user,
} from "@prisma/client";
import { Button } from "antd";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AllBookingHistory = () => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [dailyrent, setDailyRent] = useState<
    Array<
      daily_rent & {
        user: user;
        rent_transact: daily_rent_transact[];
        daily_shop: daily_shop & { property: daily_property };
      }
    >
  >([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const dailyrent_response = await GetAllDailyRent({});

      if (dailyrent_response.status) {
        setDailyRent(dailyrent_response.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, []);

  const pagination = usePagination(dailyrent);

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
          <p className="text-xl text-gray-600">Unit Booking History</p>
          <div className="grow"></div>
        </div>

        {pagination.paginatedItems.length == 0 ? (
          <p className="text-sm mt-4 mb-2">No Rent History found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] p-2">Sr No.</TableHead>
                <TableHead className="p-2">Property Name</TableHead>
                <TableHead className="p-2">Unit Name</TableHead>
                <TableHead className="p-2">Name</TableHead>
                <TableHead className="p-2">Contact</TableHead>
                <TableHead className="p-2">Start Date</TableHead>
                <TableHead className="p-2">End Date</TableHead>
                <TableHead className="p-2">Total Amount</TableHead>

                <TableHead className="p-2">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.map(
                (
                  rentdata: daily_rent & {
                    user: user;
                    rent_transact: daily_rent_transact[];
                    daily_shop: daily_shop & { property: daily_property };
                  },
                  index
                ) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm p-2">{index + 1}</TableCell>
                    <TableCell className="p-2">
                      {rentdata.daily_shop.property.name}
                    </TableCell>
                    <TableCell className="p-2">
                      {rentdata.daily_shop.name}
                    </TableCell>
                    <TableCell className="p-2">
                      {rentdata.user.firstName + " " + rentdata.user.lastName}
                    </TableCell>
                    <TableCell className="p-2">
                      {rentdata.user.contactone}
                    </TableCell>
                    <TableCell className="whitespace-nowrap  p-2">
                      {formateDate(new Date(rentdata.event_from_date))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap  p-2">
                      {formateDate(new Date(rentdata.event_to_date))}
                    </TableCell>
                    <TableCell className="p-2">
                      {parseInt(rentdata.deposit_amount) +
                        parseInt(rentdata.event_amount) +
                        (rentdata.handover_day
                          ? parseInt(rentdata.handover_day_amount ?? "0")
                          : 0) +
                        (rentdata.prep_day_amount
                          ? parseInt(rentdata.prep_day_amount ?? "0")
                          : 0)}
                    </TableCell>

                    <TableCell className="p-2">{rentdata.status}</TableCell>

                    <TableCell className="text-right p-2">
                      {rentdata.rent_transact.length > 0 ? (
                        <button
                          onClick={() => {
                            router.push(
                              `/dashboard/dailyrentrecept/${rentdata.user.id}/${rentdata.id}/${rentdata.rent_transact[0].id}`
                            );
                          }}
                          className="cursor-pointer bg-blue-500 text-sm px-2 py-1 rounded-md text-white text-nowrap"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500">No Receipt</p>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}

        {pagination.paginatedItems.length > 0 && (
          <div className="p-4">
            <Pagination
              ChangePerPage={pagination.ChangePerPage}
              activePage={pagination.activePage}
              changeActivePage={pagination.changeActivePage}
              firstPage={pagination.firstPage}
              getMaxPage={pagination.getMaxPage}
              getTotalItemsLength={pagination.getTotalItemsLength}
              goToPage={pagination.goToPage}
              itemPerPage={pagination.itemPerPage}
              lastPage={pagination.lastPage}
              nextPage={pagination.nextPage}
              paginatedItems={pagination.paginatedItems}
              prevPage={pagination.prevPage}
              totalPages={pagination.totalPages}
            ></Pagination>
          </div>
        )}
      </div>
    </>
  );
};

export default AllBookingHistory;
