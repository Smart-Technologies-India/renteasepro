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
import GetAllPaidRent from "@/action/rent_transact/getallpaid";

import numberWithIndianFormat, {
  formateDatePDF,
  longtext,
} from "@/utils/methods";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  usePDF,
} from "@react-pdf/renderer";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 1,
    textAlign: "center",
    fontFamily: "Oswald",
  },

  myflex: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },

  topleft: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    border: "1px solid #6b7280",
    textAlign: "center",
    width: "40px",
  },

  topmid: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    borderTop: "1px solid #6b7280",
    textAlign: "center",
    flexGrow: 1,
  },
  topmid2: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    borderTop: "1px solid #6b7280",
    textAlign: "center",
    width: "100px",
  },
  topright: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    borderTop: "1px solid #6b7280",
    textAlign: "center",
    width: "45px",
  },

  bottomleft: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    borderLeft: "1px solid #6b7280",
    textAlign: "center",
    width: "40px",
  },

  bottomright: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    textAlign: "center",
    width: "45px",
  },
  bottommid: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    textAlign: "center",
    flexGrow: 1,
  },
  bottommid2: {
    fontSize: "8px",
    fontWeight: "normal",
    color: "#374151",
    padding: "4px 4px",
    borderBottom: "1px solid #6b7280",
    borderRight: "1px solid #6b7280",
    textAlign: "center",
    width: "100px",
  },
});

const GstTable = () => {
  const [isLoading, setIsLoading] = useState(true);

  // pagination start here
  const [filterAccount, setFilterAccount] = useState<any[]>([]);

  const [filterDate, setFilterDate] = useState<DateRange>();
  const [startDPop, setStartDPop] = useState<boolean>(false);

  const [filterDateTwo, setFilterDateTwo] = useState<DateRange>();
  const [startDPopTwo, setStartDPopTwo] = useState<boolean>(false);

  const [filterAccountTwo, setFilterAccountTwo] = useState<any[]>([]);

  const generateInvoiceGSTPDF = (invoices: any[]) => {
    const InvoiceGST = (
      <Document>
        <Page style={styles.body} size={"A4"} wrap>
          <View>
            <Text
              style={{
                fontSize: "16px",
                color: "#1f2937",
                textAlign: "center",
                fontWeight: "normal",
                textDecoration: "underline",
              }}
            >
              GST Report
            </Text>
          </View>

          <View
            style={{
              marginTop: "10px",
            }}
          ></View>

          <View style={styles.myflex}>
            <Text style={styles.topleft}>Date</Text>
            <Text style={styles.topmid}>Person Name</Text>
            <Text style={styles.topmid2}>GSTN Number</Text>
            <Text style={styles.topright}>Invoice Number</Text>
            <Text style={styles.topright}>Taxable Value</Text>
            <Text style={styles.topright}>IGST</Text>
            <Text style={styles.topright}>CGST</Text>
            <Text style={styles.topright}>UTGST</Text>
            <Text style={styles.topright}>Invoice Value</Text>
          </View>

          {invoices.map((value: any, index: number) => {
            return (
              <View key={index} style={styles.myflex}>
                <Text style={styles.bottomleft}>
                  {formateDatePDF(value?.transaction_date)}
                </Text>
                <Text style={styles.bottommid}>
                  {longtext(value?.customername, 30)}
                </Text>
                <Text style={styles.bottommid2}>{value?.customergst}</Text>
                <Text style={styles.bottomright}>
                  {(value?.gstinvoice ?? "0").toString().padStart(4, "0")}
                </Text>
                <Text style={styles.bottomright}>{value?.amount}</Text>
                <Text style={styles.bottomright}>{value?.igst}</Text>
                <Text style={styles.bottomright}>{value?.cgst}</Text>
                <Text style={styles.bottomright}>{value?.ugst}</Text>
                <Text style={styles.bottomright}>
                  {numberWithIndianFormat(
                    parseFloat(
                      (
                        parseFloat(value?.amount.toString() ?? "0") +
                        parseFloat(value?.amount_two ?? "0") +
                        parseFloat(value?.amount_three ?? "0") +
                        parseFloat(value?.cgst.toString() ?? "0") +
                        parseFloat(value?.ugst.toString() ?? "0") +
                        parseFloat(value?.igst.toString() ?? "0")
                      ).toFixed(0)
                    )
                  )}
                </Text>
              </View>
            );
          })}
        </Page>
      </Document>
    );

    return InvoiceGST;
  };

  const generateRentGSTPDF = (invoices: any[]) => {
    const RentGST = (
      <Document>
        <Page style={styles.body} size={"A4"} wrap>
          <View>
            <Text
              style={{
                fontSize: "16px",
                color: "#1f2937",
                textAlign: "center",
                fontWeight: "normal",
                textDecoration: "underline",
              }}
            >
              GST Report
            </Text>
          </View>

          <View
            style={{
              marginTop: "10px",
            }}
          ></View>

          <View style={styles.myflex}>
            <Text style={styles.topleft}>Date</Text>
            <Text style={styles.topmid}>Person Name</Text>
            <Text style={styles.topmid2}>GSTN Number</Text>
            <Text style={styles.topright}>Invoice Number</Text>
            <Text style={styles.topright}>Taxable Value</Text>
            <Text style={styles.topright}>IGST</Text>
            <Text style={styles.topright}>CGST</Text>
            <Text style={styles.topright}>UTGST</Text>
            <Text style={styles.topright}>Invoice Value</Text>
          </View>

          {invoices.map((value: any, index: number) => {
            return (
              <View key={index} style={styles.myflex}>
                <Text style={styles.bottomleft}>
                  {formateDatePDF(value?.transaction_date)}
                </Text>
                <Text style={styles.bottommid}>
                  {longtext(value?.user.username, 30)}
                </Text>
                <Text style={styles.bottommid2}>unregistered</Text>
                <Text style={styles.bottomright}>
                  {(
                    parseFloat(value?.amount) -
                    ((parseInt(value?.amount) * 18) / 118 / 2) * 2
                  ).toFixed(2)}
                </Text>
                <Text style={styles.bottomright}>{value?.amount}</Text>
                <Text style={styles.bottomright}>0</Text>
                <Text style={styles.bottomright}>
                  {((parseInt(value?.amount) * 18) / 118 / 2).toFixed(2)}
                </Text>
                <Text style={styles.bottomright}>
                  {((parseInt(value?.amount) * 18) / 118 / 2).toFixed(2)}
                </Text>
                <Text style={styles.bottomright}>
                  {(value?.gstinvoice ?? "0").toString().padStart(4, "0")}
                </Text>
              </View>
            );
          })}
        </Page>
      </Document>
    );

    return RentGST;
  };

  // invoice gst start from here

  const [invoiceGst, setInvoiceGst] = usePDF({
    document: generateInvoiceGSTPDF(filterAccount),
  });

  const [rentGst, setRentGst] = usePDF({
    document: generateRentGSTPDF(filterAccountTwo),
  });
  // invoice gst start end here

  const refreshInvoice = async () => {
    setIsLoading(true);
    const invoiceresponse = await AllInvoice({});

    if (invoiceresponse.status) {
      setFilterAccount(invoiceresponse.data!);
    }

    setTimeout(() => {
      setInvoiceGst(generateInvoiceGSTPDF(invoiceresponse.data!));
    }, 1500);

    setIsLoading(false);
  };

  const refreshRent = async () => {
    setIsLoading(true);

    const rentresponse = await GetAllPaidRent({});
    if (rentresponse.status) {
      setFilterAccountTwo(rentresponse.data!);
    }

    setTimeout(() => {
      setRentGst(generateRentGSTPDF(rentresponse.data!));
    }, 1500);

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
      setTimeout(() => {
        setInvoiceGst(generateInvoiceGSTPDF(invoiceresponse.data!));
      }, 1500);

      const rentresponse = await GetAllPaidRent({});
      if (rentresponse.status) {
        setFilterAccountTwo(rentresponse.data!);
      }
      console.log(rentresponse.data!);

      setTimeout(() => {
        setRentGst(generateRentGSTPDF(rentresponse.data!));
      }, 1500);
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
        <a
          download
          href={invoiceGst.url!}
          className="bg-[#162e57] hover:bg-[#162e57] text-white text-sm px-4 py-1 h-9 rounded-md grid place-items-center"
        >
          Download
        </a>
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
                    const temp = filterAccount.filter((item: any) => {
                      const itemDate = new Date(item.transaction_date);
                      const fromDate = new Date(e.from!);
                      const toDate = new Date(e.to!);

                      // Set the time component to midnight for comparison
                      itemDate.setHours(0, 0, 0, 0);
                      fromDate.setHours(0, 0, 0, 0);
                      toDate.setHours(0, 0, 0, 0);

                      return itemDate >= fromDate && itemDate <= toDate;
                    });

                    // console.log(temp);

                    console.log(temp);
                    if (temp.length > 0) {
                      setFilterAccount(temp);
                      setIsLoading(true);
                      setTimeout(() => {
                        setInvoiceGst(generateInvoiceGSTPDF(temp));
                        setIsLoading(false);
                      }, 1500);
                    } else {
                      setFilterAccount([]);
                      setIsLoading(true);
                      setTimeout(() => {
                        setInvoiceGst(generateInvoiceGSTPDF([]));
                        setIsLoading(false);
                      }, 1500);
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
        <a
          download
          href={rentGst.url!}
          className="bg-[#162e57] hover:bg-[#162e57] text-white text-sm px-4 py-1 h-9 rounded-md grid place-items-center"
        >
          Download
        </a>
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
                    const temp = filterAccountTwo.filter((item: any) => {
                      const itemDate = new Date(item.transaction_date);
                      const fromDate = new Date(e.from!);
                      const toDate = new Date(e.to!);

                      // Set the time component to midnight for comparison
                      itemDate.setHours(0, 0, 0, 0);
                      fromDate.setHours(0, 0, 0, 0);
                      toDate.setHours(0, 0, 0, 0);

                      return itemDate >= fromDate && itemDate <= toDate;
                    });

                    if (temp.length > 0) {
                      setFilterAccountTwo(temp);
                      setIsLoading(true);
                      setTimeout(() => {
                        setRentGst(generateRentGSTPDF(temp));
                        setIsLoading(false);
                      }, 1500);
                    } else {
                      setFilterAccountTwo([]);
                      setTimeout(() => {
                        setRentGst(generateRentGSTPDF([]));
                        setIsLoading(false);
                      }, 1500);
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
                  (filterAccountTwo
                    .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                    .reduce((acc: any, curr: any) => acc + curr, 0) *
                    18) /
                    118 /
                    2 +
                    (filterAccountTwo
                      .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                      .reduce((acc: any, curr: any) => acc + curr, 0) *
                      18) /
                      118 /
                      2 +
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
