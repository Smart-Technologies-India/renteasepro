"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { formateDate, encryptURLData } from "@/utils/methods";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Fa6SolidXmark,
  FluentMdl2Search,
  IcBaselineCalendarMonth,
} from "@/components/icons";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { usePagination } from "@/hooks/usepagination";
import Pagination from "@/components/pagination";
import { DateRange } from "react-day-picker";
import GetAllDailyPaidRent from "@/action/rent_transact/getalldailyrent";

const UserRentHistoryView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // pagination start here
  const [filterAccount, setFilterAccount] = useState<any[]>([]);

  // const [startDate, setStartDate] = useState<Date>();
  const [filterDate, setFilterDate] = useState<DateRange>();
  const [filterDPop, setFilterDPop] = useState<boolean>(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);
  const pagination = usePagination(filterAccount);
  const paginationsearch = usePagination(searchresult);

  // pagination end here
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const rentresponse = await GetAllDailyPaidRent({});

      if (rentresponse.status) {
        setFilterAccount(rentresponse.data ?? []);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    const rentresponse = await GetAllDailyPaidRent({});

    if (rentresponse.status) {
      setFilterAccount(rentresponse.data ?? []);
    }

    setIsLoading(false);
  };

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          filterAccount.filter(
            (account: any) =>
              (account.user.firstName !== null ? account.user.firstName : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.user.lastName !== null ? account.user.lastName : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.user.firstName + " " + account.user.lastName !== null
                ? account.user.firstName + " " + account.user.lastName
                : ""
              )
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.daily_shop.property.name !== null
                ? account.daily_shop.property.name
                : ""
              )
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.daily_shop.name !== null ? account.daily_shop.name : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.amount !== null ? account.amount : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                )
          )
        );
      } else {
        setIsSearch(false);
      }
    }
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    searchRef.current!.value = "";
  };

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
        <div className="grow"></div>
        <div className="grid items-center gap-1.5">
          <Popover open={filterDPop} onOpenChange={setFilterDPop}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${
                  filterDate ?? "text-muted-foreground"
                }`}
              >
                <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                {filterDate?.from ? (
                  filterDate.to ? (
                    <>
                      {format(filterDate.from, "LLL dd, y")} -{" "}
                      {format(filterDate.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filterDate.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filterDate?.from}
                selected={filterDate}
                onSelect={async (e) => {
                  if (e == undefined || e == null) return;
                  setFilterDate(e);

                  if (e.from == undefined || e.to == undefined) return;
                  setFilterDPop(false);

                  await refresh();

                  if (e.from && e.to) {
                    const temp = filterAccount.filter((item: any) => {
                      const itemDate = new Date(item.updatedAt);
                      const fromDate = new Date(e.from!);
                      const toDate = new Date(e.to!);

                      // Set the time component to midnight for comparison
                      itemDate.setHours(0, 0, 0, 0);
                      fromDate.setHours(0, 0, 0, 0);
                      toDate.setHours(0, 0, 0, 0);

                      return itemDate >= fromDate && itemDate <= toDate;
                    });
                    setFilterAccount(temp);
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center bg-white rounded-md pl-2">
          <FluentMdl2Search />
          <input
            ref={searchRef}
            type="text"
            onChange={searchchange}
            className="bg-transparent outline-none focus:outline-none py-1 px-4"
            placeholder="Enter Search Text.."
          />
          {isSearch && (
            <button
              onClick={clearsearch}
              className=" p-2 text-black bg-white rounded-r"
            >
              <Fa6SolidXmark></Fa6SolidXmark>
            </button>
          )}
        </div>
      </div>

      {filterAccount.length <= 0 ? (
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
              {/* <TableHead>Month</TableHead> */}
              <TableHead>Paid Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>View</TableHead>
              <TableHead>View Booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isSearch
              ? paginationsearch.paginatedItems
              : pagination.paginatedItems
            ).map((rent_data: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {rent_data.user.firstName} - {rent_data.user.lastName} [
                  {rent_data.user.contactone}]
                </TableCell>

                <TableCell>{rent_data.daily_shop.property.name}</TableCell>
                <TableCell>{rent_data.daily_shop.name}</TableCell>
                {/* <TableCell>
                  {formateDate(new Date(rent_data.event_from_date))} -{" "}
                  {formateDate(new Date(rent_data.event_to_date))}
                </TableCell> */}
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
                          `/dashboard/dailyrentrecept/${encryptURLData(rent_data.user.id.toString())}/${encryptURLData(rent_data.daily_rent.id.toString())}/${encryptURLData(rent_data.id.toString())}`
                        );
                      }}
                      className="cursor-pointer text-sm font-normal px-3 py-1 h-8"
                    >
                      View Rent Receipt
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      router.push(
                        `/dashboard/dailyshops/viewrent/${rent_data.daily_rent.id}/${rent_data.user.id}`
                      );
                    }}
                    className="cursor-pointer bg-blue-500 text-sm px-2 py-1 rounded-md text-white text-nowrap"
                  >
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {isSearch
        ? paginationsearch.paginatedItems.length > 0 && (
            <div className="p-4">
              <Pagination
                ChangePerPage={paginationsearch.ChangePerPage}
                activePage={paginationsearch.activePage}
                changeActivePage={paginationsearch.changeActivePage}
                firstPage={paginationsearch.firstPage}
                getMaxPage={paginationsearch.getMaxPage}
                getTotalItemsLength={paginationsearch.getTotalItemsLength}
                goToPage={paginationsearch.goToPage}
                itemPerPage={paginationsearch.itemPerPage}
                lastPage={paginationsearch.lastPage}
                nextPage={paginationsearch.nextPage}
                paginatedItems={paginationsearch.paginatedItems}
                prevPage={paginationsearch.prevPage}
                totalPages={paginationsearch.totalPages}
              ></Pagination>
            </div>
          )
        : pagination.paginatedItems.length > 0 && (
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
  );
};
export default UserRentHistoryView;
