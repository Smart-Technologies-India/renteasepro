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
import { BidTransact } from "@prisma/client";
import GetFromBidId from "@/action/bid_transact/getfrombidid";
import BackButton from "@/components/backbutton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Fa6SolidXmark,
  FluentMdl2Search,
  SolarAltArrowDownLinear,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import setWinner from "@/action/bid_transact/setwinner";
import { toast } from "react-toastify";
import isHigherBid from "@/action/bid_transact/ishigerbid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePagination } from "@/hooks/usepagination";
import Pagination from "@/components/pagination";

interface BidHistoryViewProps {
  id: number;
}
const BidHistoryView = (props: BidHistoryViewProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const category: string[] = ["All", "Pending", "Accepted", "Rejected"];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filterbid, setFilterbid] = useState<any[]>([]);

  const [bids, setBids] = useState<any[]>([]);

  const [alldone, setAllDone] = useState<boolean>(false);

  // search and filter start from here

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const pagination = usePagination(filterbid);

  const paginationsearch = usePagination(searchresult);

  // serach and filter end here

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterbid(bids);
    } else if (category === "Pending") {
      const temp = bids.filter((item: any) => {
        return (
          item.status === BidTransact.PENDING ||
          item.status === BidTransact.USERNOTINTERESTED
        );
      });
      setFilterbid(temp);
    } else if (category === "Accepted") {
      const temp = bids.filter((item: any) => {
        return (
          item.status === BidTransact.ACCEPTED ||
          item.status === BidTransact.WINNINGBID
        );
      });
      setFilterbid(temp);
    } else if (category === "Rejected") {
      const temp = bids.filter((item: any) => {
        return item.status === BidTransact.REJECTED;
      });
      setFilterbid(temp);
    }
  };

  useEffect(() => {
    const setall = (bidslist: any[]) => {
      let bidstatuslist: string[] = bidslist.map((item: any) => {
        return item.status;
      });

      if (bidstatuslist.includes(BidTransact.PENDING)) {
        setAllDone(false);
      } else {
        setAllDone(true);
      }
    };

    const init = async () => {
      setIsLoading(true);
      const bidresponse = await GetFromBidId({
        id: props.id,
      });

      if (bidresponse.status) {
        setBids(bidresponse.data ?? []);
        setFilterbid(bidresponse.data ?? []);
      }

      setall(bidresponse.data ?? []);
      setIsLoading(false);
    };
    init();
  }, [props.id]);

  const [bidid, setBidid] = useState<number>(0);

  const [isHigherBidBox, setIsHigherBidBox] = useState<boolean>(false);
  const [isOrderBox, setIsOrderBox] = useState<boolean>(false);
  const [isEndBox, setIsEndBox] = useState<boolean>(false);

  const setWinning = async (id: number, isend: boolean) => {
    const ishigherbid = await isHigherBid({ id: id });
    if (!ishigherbid.status) {
      toast.error(ishigherbid.message);
      return;
    }

    if (!isend) return setIsEndBox(true);

    if (ishigherbid.data) {
      setIsOrderBox(true);
      // const response = await setWinner({ id: id });
      // if (response.status) {
      //   toast.success(response.message);
      // } else {
      //   toast.error(response.message);
      // }

      // setIsLoading(true);
      // const bidresponse = await GetFromBidId({
      //   id: props.id,
      // });

      // if (bidresponse.status) {
      //   setBids(bidresponse.data ?? []);
      //   setFilterbid(bidresponse.data ?? []);
      // }

      // setIsLoading(false);
    } else {
      setIsHigherBidBox(true);
    }
  };

  const setaswinnder = async () => {
    const response = await setWinner({ id: bidid });
    if (response.status) {
      toast.success(response.message);
      router.push(
        `/dashboard/shops/createrent/${response.data?.shopId}/${response.data?.userId}/${response.data?.id}`
      );
    } else {
      toast.error(response.message);
    }

    setIsLoading(true);
    const bidresponse = await GetFromBidId({
      id: props.id,
    });

    if (bidresponse.status) {
      setBids(bidresponse.data ?? []);
      setFilterbid(bidresponse.data ?? []);
    }

    setIsLoading(false);
  };

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          filterbid.filter(
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
      <div className="items-center flex gap-4">
        <BackButton />
        <h1 className="text-[#162f57] text-2xl font-semibold">Bidders List</h1>
        <div className="grow"></div>

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
        <div className="flex">
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

        {(isSearch && paginationsearch.paginatedItems.length == 0) ||
        (!isSearch && pagination.paginatedItems.length == 0) ? (
          <>
            <p className="mt-4 text-lg">No Bid Found</p>
          </>
        ) : (
          <>
            <Table className="mt-4">
              <TableHeader className="bg-[#f2f6f9]">
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
                ).map((bid_tans: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{bid_tans.id}</TableCell>
                    <TableCell>{bid_tans.user.username}</TableCell>
                    <TableCell>{bid_tans.user.contactone}</TableCell>
                    <TableCell>&#8377;{bid_tans.amount}</TableCell>
                    <TableCell>
                      {new Date(bid_tans.createdAt).toDateString()}
                    </TableCell>
                    <TableCell>{bid_tans.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="gap-2 flex">
                            <p className="font-medium text-sm">View</p>
                            <SolarAltArrowDownLinear className="textx-2xl" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(
                                  `/dashboard/userprofile/viewprofile/${bid_tans.user.id}/${bid_tans.id}`
                                );
                              }}
                              className="cursor-pointer"
                            >
                              View user Docs
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                return router.push(
                                  `/dashboard/bidrecept/${bid_tans.user.id}/${bid_tans.bid.id}`
                                );
                              }}
                              className="cursor-pointer"
                            >
                              View Bid Receipt
                            </DropdownMenuItem>
                            {alldone &&
                            bid_tans.status == BidTransact.ACCEPTED ? (
                              <>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const end_date = bid_tans.bid.bidenddate;
                                    const current_date = new Date();
                                    const is_end = end_date < current_date;
                                    setBidid(bid_tans.id);
                                    setWinning(bid_tans.id, is_end);
                                  }}
                                >
                                  Approve as Winner
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <></>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialog
                        open={isHigherBidBox}
                        onOpenChange={setIsHigherBidBox}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This is not the higest bid. Are you sure you want
                              to approve this bid as winner and generate rent
                              order?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={setaswinnder}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog
                        open={isOrderBox}
                        onOpenChange={setIsOrderBox}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve this bid as
                              winner and generate rent order?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={setaswinnder}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog open={isEndBox} onOpenChange={setIsEndBox}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Warning! Bid has not ended yet.
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Kindly wait till the bid ends to approve the
                              winner.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          </>
        )}
      </div>
    </div>
  );
};
export default BidHistoryView;
