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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { IcBaselineCalendarMonth } from "@/components/icons";
import AllInvoice from "@/action/invoice/getallinvoice";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Separator } from "@/components/ui/separator";
import GetAllRentTransact from "@/action/rent_transact/getallrenttransact";
import GetAllPaidRent from "@/action/rent_transact/getallpaid";
import numberWithIndianFormat from "@/utils/methods";

const GstTable = () => {
  const [isLoading, setIsLoading] = useState(true);

  // pagination start here
  const [filterAccount, setFilterAccount] = useState<any[]>([]);

  const [filterDate, setFilterDate] = useState<DateRange>();
  const [startDPop, setStartDPop] = useState<boolean>(false);

  const [filterDateTwo, setFilterDateTwo] = useState<DateRange>();
  const [startDPopTwo, setStartDPopTwo] = useState<boolean>(false);

  const [filterAccountTwo, setFilterAccountTwo] = useState<any[]>([]);

  const refreshInvoice = async () => {
    setIsLoading(true);
    const invoiceresponse = await AllInvoice({});

    if (invoiceresponse.status) {
      setFilterAccount(invoiceresponse.data!);
    }

    setIsLoading(false);
  };

  const refreshRent = async () => {
    setIsLoading(true);

    const rentresponse = await GetAllPaidRent({});
    if (rentresponse.status) {
      setFilterAccountTwo(rentresponse.data!);
    }
    setIsLoading(false);
  };

  // pagination end here
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const invoiceresponse = await AllInvoice({});

      if (invoiceresponse.status) {
        setFilterAccount(invoiceresponse.data!);
      }

      const rentresponse = await GetAllPaidRent({});
      if (rentresponse.status) {
        setFilterAccountTwo(rentresponse.data!);
      }
      setIsLoading(false);
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
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-[#162f57] text-2xl font-semibold">Invoice GST</h1>
        <div className="grow"></div>
        <div className="grid items-center gap-1.5">
          <Popover open={startDPop} onOpenChange={setStartDPop}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${
                  !filterDate ?? "text-muted-foreground"
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
                  setStartDPop(false);

                  await refreshInvoice();

                  if (e.from && e.to) {
                    console.log(filterAccount);
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

                    // console.log(temp);

                    if (temp.length > 0) {
                      setFilterAccount(temp);
                    } else {
                      setFilterAccount([]);
                    }
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
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
              <TableHead className="w-[180px]">HSN</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>CGST</TableHead>
              <TableHead>UGST</TableHead>
              <TableHead>IGST</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {filterAccount[0].hsn}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccount.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) + parseFloat(currentValue.amount)
                    );
                  }, 0)
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccount.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) + parseFloat(currentValue.cgst)
                    );
                  }, 0)
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccount.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) + parseFloat(currentValue.ugst)
                    );
                  }, 0)
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccount.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) + parseFloat(currentValue.igst)
                    );
                  }, 0)
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccount.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) + parseFloat(currentValue.cgst)
                    );
                  }, 0) +
                    filterAccount.reduce((accumulator, currentValue) => {
                      return (
                        parseFloat(accumulator) + parseFloat(currentValue.ugst)
                      );
                    }, 0) +
                    filterAccount.reduce((accumulator, currentValue) => {
                      return (
                        parseFloat(accumulator) + parseFloat(currentValue.igst)
                      );
                    }, 0)
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      <div className="w-full h-[1px] bg-gray-800 mt-6"></div>

      {/* second section start from here */}

      <div className="flex gap-2 items-center mt-6">
        <h1 className="text-[#162f57] text-2xl font-semibold">Rent GST</h1>
        <div className="grow"></div>
        <div className="grid items-center gap-1.5">
          <Popover open={startDPopTwo} onOpenChange={setStartDPopTwo}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${
                  !filterDateTwo ?? "text-muted-foreground"
                }`}
              >
                <IcBaselineCalendarMonth className="mr-2 h-4 w-4" />
                {filterDateTwo?.from ? (
                  filterDateTwo.to ? (
                    <>
                      {format(filterDateTwo.from, "LLL dd, y")} -{" "}
                      {format(filterDateTwo.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filterDateTwo.from, "LLL dd, y")
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
                defaultMonth={filterDateTwo?.from}
                selected={filterDateTwo}
                onSelect={async (e) => {
                  if (e == undefined || e == null) return;
                  setFilterDateTwo(e);

                  if (e.from == undefined || e.to == undefined) return;
                  setStartDPopTwo(false);
                  await refreshRent();

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

                    if (temp.length > 0) {
                      setFilterAccount(temp);
                    } else {
                      setFilterAccount([]);
                    }
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filterAccountTwo.length <= 0 ? (
        <>
          <p className="mt-4 text-lg">No Rent Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Count</TableHead>
              <TableHead>Invoice Amount</TableHead>
              <TableHead>Taxable Amount</TableHead>
              <TableHead>CGST</TableHead>
              <TableHead>UGST</TableHead>
              <TableHead>IGST</TableHead>
              <TableHead>Tax to be Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {filterAccountTwo.length}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccountTwo.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) + parseFloat(currentValue.amount)
                    );
                  }, 0)
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccountTwo
                    .flatMap((arr: any) => arr.amount)
                    .reduce((acc: any, curr: any) => acc + curr, 0) -
                    (filterAccountTwo
                      .flatMap((arr: any) => arr.amount)
                      .reduce((acc: any, curr: any) => acc + curr, 0) *
                      18) /
                      118
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  (filterAccountTwo
                    .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                    .reduce((acc: any, curr: any) => acc + curr, 0) *
                    18) /
                    118 /
                    2
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  (filterAccountTwo
                    .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                    .reduce((acc: any, curr: any) => acc + curr, 0) *
                    18) /
                    118 /
                    2
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccountTwo.reduce((accumulator, currentValue) => {
                    return parseFloat(accumulator) + 0;
                  }, 0)
                )}
              </TableCell>
              <TableCell>
                {numberWithIndianFormat(
                  filterAccountTwo.reduce((accumulator, currentValue) => {
                    return (
                      parseFloat(accumulator) +
                      parseFloat((currentValue.amount * 0.9).toFixed(2))
                    );
                  }, 0) +
                    filterAccountTwo.reduce((accumulator, currentValue) => {
                      return (
                        parseFloat(accumulator) +
                        parseFloat((currentValue.amount * 0.9).toFixed(2))
                      );
                    }, 0) +
                    filterAccountTwo.reduce((accumulator, currentValue) => {
                      return parseFloat(accumulator) + 0;
                    }, 0)
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default GstTable;
