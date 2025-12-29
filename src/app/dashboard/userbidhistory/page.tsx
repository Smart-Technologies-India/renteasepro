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
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { BidTransact } from "@prisma/client";
import { capitalcase } from "@/utils/methods";
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
import { SolarAltArrowDownLinear } from "@/components/icons";
import { useRouter } from "next/navigation";
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
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import RejectUserBid from "@/action/bid_transact/rejactuserbid";
import IsProfileCompleted from "@/action/user/isprofilecompleted";

const UserBidHistoryPage = () => {
  const [userid, setUserid] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [category, setCategory] = useState<string[]>([
    "All",
    "Pending",
    "Accepted",
    "Rejected",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filterbid, setFilterbid] = useState<any[]>([]);

  const [bids, setBids] = useState<any[]>([]);

  const [bidid, setBidid] = useState<number>(0);
  const [isBox, setIsBox] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterbid(bids);
    } else if (category === "Pending") {
      const temp = bids.filter((item: any) => {
        return item.status === BidTransact.PENDING;
      });
      setFilterbid(temp);
    } else if (category === "Accepted") {
      const temp = bids.filter((item: any) => {
        return item.status === BidTransact.ACCEPTED;
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
    const init = async () => {
      setIsLoading(true);
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);

      const isprofilecompleted = await IsProfileCompleted({
        id: authResponse.data,
      });

      if (!isprofilecompleted.status) {
        return router.push("/dashboard/userprofile/edit");
      }
      const bidresponse = await GetUserBid({
        userid: authResponse.data,
      });

      if (bidresponse.status) {
        setBids(bidresponse.data ?? []);
        setFilterbid(bidresponse.data ?? []);
      }

      setIsLoading(false);
    };

    init();
  }, [userid]);

  const recjectBid = async () => {
    if (rejectReason == "" || rejectReason == undefined || rejectReason == null)
      return toast.error("Please Enter Reject Reason");

    const response = await RejectUserBid({
      id: bidid,
      reason: rejectReason,
    });

    if (response.status) {
      toast.success("Bid Rejected Successfully");
      setIsLoading(true);
      const bidresponse = await GetUserBid({
        userid: userid,
      });

      if (bidresponse.status) {
        setBids(bidresponse.data ?? []);
        setFilterbid(bidresponse.data ?? []);
      }

      setIsLoading(false);
    } else {
      toast.error(response.message);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-[#162f57] text-2xl font-semibold">
        Your Bid History
      </h1>
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

      {filterbid.length === 0 ? (
        <>
          <p className="mt-4 text-lg">No Bid Found</p>
        </>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Property Name</TableHead>
              <TableHead>Shop No.</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterbid.map((bid_tans: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bid_tans.id}</TableCell>
                <TableCell>{bid_tans.shop.property.name}</TableCell>
                <TableCell>{bid_tans.shop.shopNumber}</TableCell>
                <TableCell>&#8377;{bid_tans.amount}</TableCell>
                <TableCell>
                  {new Date(bid_tans.createdAt).toDateString()}
                </TableCell>
                <TableCell>{capitalcase(bid_tans.status)}</TableCell>
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
                              `/dashboard/shops/details/${bid_tans.shop.id}`
                            );
                          }}
                          className="cursor-pointer"
                        >
                          View
                        </DropdownMenuItem>

                        {bid_tans.status === BidTransact.PENDING && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setBidid(bid_tans.id);
                              setIsBox(true);
                            }}
                          >
                            Not Interested
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <AlertDialog open={isBox} onOpenChange={setIsBox}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to reject?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Enter Reject Reason Below
                        </AlertDialogDescription>
                        <TextArea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter Reject Reason"
                          className="resize-none h-24 mt-2"
                        ></TextArea>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={recjectBid}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default UserBidHistoryPage;
