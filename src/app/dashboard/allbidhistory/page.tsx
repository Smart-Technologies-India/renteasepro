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

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { encryptURLData } from "@/utils/methods";

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
// import { toast } from "react-toastify";
// import UpdateRentRecoDate from "@/action/rent_transact/updaterentrecodate";
import { usePagination } from "@/hooks/usepagination";
import Pagination from "@/components/pagination";
import { DateRange } from "react-day-picker";
import AllBidTransact from "@/action/bid_transact/getallbidtransact";

const UserBidHistoryView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // const [rentTransact, setRentTransact] = useState<any[]>([]);

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
      const bidresponse = await AllBidTransact({});

      if (bidresponse.status) {
        setFilterAccount(bidresponse.data ?? []);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    const bidresponse = await AllBidTransact({});

    if (bidresponse.status) {
      setFilterAccount(bidresponse.data ?? []);
    }

    setIsLoading(false);
  };

  // const [startDate, setStartDate] = useState<Date>();
  // const [startDPop, setStartDPop] = useState<boolean>(false);

  // const updateRecoDate = async (id: number) => {
  //   if (startDate == null) {
  //     return toast.error("Please select the reconcilation date");
  //   }

  //   const response = await UpdateRentRecoDate({
  //     id: id,
  //     reco_date: startDate,
  //   });

  //   if (response.status) {
  //     toast.success("Reconcilation Date Added Successfully");
  //     const bidresponse = await AllBids({});

  //     if (bidresponse.status) {
  //       setFilterAccount(bidresponse.data ?? []);
  //     }
  //   } else {
  //     toast.error("Reconcilation Date Not Added Successfully");
  //   }
  // };

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          filterAccount.filter(
            (property) =>
              property.user.username
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.user.contactone
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              property.amount
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
          Bid payment History
        </h1>
        <div className="grow"></div>
        <div className="grid items-center gap-1.5">
          <Popover open={filterDPop} onOpenChange={setFilterDPop}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${
                  filterDate ? "" : "text-muted-foreground"
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
          <p className="mt-4 text-lg">No Bid Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Bidder Name</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isSearch
              ? paginationsearch.paginatedItems
              : pagination.paginatedItems
            ).map((bid_data: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bid_data.id}</TableCell>
                <TableCell>{bid_data.user.username}</TableCell>
                <TableCell>{bid_data.user.contactone}</TableCell>
                <TableCell>&#8377;{bid_data.amount}</TableCell>
                <TableCell>
                  {new Date(bid_data.createdAt).toDateString()}
                </TableCell>
                <TableCell>{bid_data.status}</TableCell>

                <TableCell>
                  <Button
                    onClick={() => {
                      return router.push(
                        `/dashboard/bidrecept/${encryptURLData(bid_data.user.id.toString())}/${encryptURLData(bid_data.bid.id.toString())}`
                      );
                    }}
                    className="cursor-pointer text-sm font-normal px-3 py-1 h-8"
                  >
                    View Bid Receipt
                  </Button>
                </TableCell>
                {/* <TableCell>
                  {bid_data.reconcilation == null ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="cursor-pointer text-sm font-normal px-3 py-1 h-8">
                          Add Date
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Select the Reconcilation Date?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Enter Accept Reason Below
                          </AlertDialogDescription>
                          <Popover open={startDPop} onOpenChange={setStartDPop}>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${
                                  !startDate ?? "text-muted-foreground"
                                }`}
                              >
                                <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                                {startDate ? (
                                  format(startDate, "PPP")
                                ) : (
                                  <span>Select start date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(e) => {
                                  setStartDate(e);
                                  setStartDPop(false);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => updateRecoDate(bid_data.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    formateDate(new Date(bid_data.reconcilation))
                  )}
                </TableCell> */}
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
export default UserBidHistoryView;
