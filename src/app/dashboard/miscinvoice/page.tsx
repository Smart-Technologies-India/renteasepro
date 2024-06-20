"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

import {
  AntDesignPlusCircleOutlined,
  Fa6SolidXmark,
  FluentMdl2Search,
  IcBaselineCalendarMonth,
} from "@/components/icons";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usepagination";
import Pagination from "@/components/pagination";
import Link from "next/link";
import AllAccountCategorys from "@/action/account/getallaccountcategory";
import { capitalcase, removeDuplicates } from "@/utils/methods";
import AllInvoice from "@/action/invoice/getallinvoice";
import { misc_invoice } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const CreateAccountPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [allaccount, setAllAccount] = useState<misc_invoice[]>([]);

  const [filterAccount, setFilterAccount] = useState<any[]>([]);

  const [category, setCategory] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // search and filter start from here

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const pagination = usePagination(filterAccount);

  const paginationsearch = usePagination(searchresult);

  // const [startDate, setStartDate] = useState<Date>();
  const [filterDate, setFilterDate] = useState<DateRange>();
  const [startDPop, setStartDPop] = useState<boolean>(false);

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterAccount(allaccount);
    } else {
      const temp = allaccount.filter((item: any) => {
        return capitalcase(item.account_category_one.name) === category;
      });
      setFilterAccount(temp);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const accountinfo = await AllInvoice({});

      if (accountinfo.status) {
        setAllAccount(accountinfo.data!);
        setFilterAccount(accountinfo.data ?? []);
      } else {
        toast.error(accountinfo.message);
      }

      const accountcategory = await AllAccountCategorys({});

      let temp: string[] = [];

      accountcategory.data?.map((item: any) => {
        if (!temp.includes(item.name)) {
          temp.push(capitalcase(item.name));
        }
      });

      setCategory(["All", ...removeDuplicates(temp)]);
      setIsLoading(false);
    };

    init();
  }, []);

  const refresh = async () => {
    setIsLoading(true);

    const accountinfo = await AllInvoice({});

    if (accountinfo.status) {
      setAllAccount(accountinfo.data!);
      setFilterAccount(accountinfo.data ?? []);
    } else {
      toast.error(accountinfo.message);
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
              (account.customername !== null ? account.customername : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.customercontact !== null ? account.customercontact : "")
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
                ) ||
              (account.account_category_one.name !== null
                ? account.account_category_one.name
                : ""
              )
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (account.bankname !== null ? account.bankname : "")
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
        <h1 className="text-[#162f57] text-2xl font-semibold">Invoice</h1>
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

                  await refresh();

                  if (e.from && e.to) {
                    const temp = allaccount.filter((item: any) => {
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
        <Link
          href={"/dashboard/miscinvoice/add"}
          className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
        >
          <AntDesignPlusCircleOutlined className="text-white text-xl" />
          <p>Add</p>
        </Link>

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

      <div className="bg-white p-2 mt-4 shadow rounded">
        {isSearch ? (
          <></>
        ) : (
          <>
            <div className="flex overflow-x-scroll gap-2 border-b bg-gray-50 p-2 pb-2 rounded-md">
              {category.map((item: string, index: number) => (
                <p
                  key={index}
                  onClick={() => {
                    filtershopbycategory(item);
                    setSelectedCategory(item);
                  }}
                  className={`border rounded-full  px-2 py-1 text-sm   cursor-pointer shrink-0 ${
                    selectedCategory === item
                      ? "border-gray-500 text-gray-700 font-medium bg-white"
                      : "border-gray-300 text-gray-400 font-normal "
                  }`}
                >
                  {item}
                </p>
              ))}
            </div>
          </>
        )}

        {filterAccount.length > 0 ? (
          <>
            <Table className="mt-2">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-[100px]">Id</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Bankname</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isSearch
                  ? paginationsearch.paginatedItems
                  : pagination.paginatedItems
                ).map((accoutn_rec: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {accoutn_rec.id}
                    </TableCell>
                    <TableCell>{accoutn_rec.customername}</TableCell>
                    <TableCell>{accoutn_rec.customercontact}</TableCell>
                    <TableCell>{accoutn_rec.amount}</TableCell>
                    <TableCell>
                      {accoutn_rec.account_category_one.name}
                    </TableCell>
                    <TableCell>{accoutn_rec.bankname}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        onClick={() => {
                          router.push(
                            `/dashboard/miscinvoice/pdffile/${accoutn_rec.id}`
                          );
                        }}
                        className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
                      >
                        <p>View</p>
                      </Button>
                      <Button
                        onClick={() => {
                          router.push(
                            `/dashboard/miscinvoice/edit/${accoutn_rec.id}`
                          );
                        }}
                        className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <div className=" mt-4 w-full grid place-items-center text-xl text-gray-600">
              No account invoice Found
            </div>
          </>
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
    </div>
  );
};
export default CreateAccountPage;
