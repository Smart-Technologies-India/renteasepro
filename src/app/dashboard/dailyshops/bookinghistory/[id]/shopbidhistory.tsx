"use client";

import AccpectDailyRent from "@/action/dailyrent/acceptdailyrent";
import GetDailyRent from "@/action/dailyrent/getdailyrent";
import RejectDailyRent from "@/action/dailyrent/rejectdailyrent";
import BackButton from "@/components/backbutton";
import { FluentMdl2Home } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate } from "@/utils/methods";
import {
  daily_rent,
  daily_rent_transact,
  rent_transact,
  user,
} from "@prisma/client";
import { Button } from "antd";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ShopBidHistoryViewProps {
  id: number;
}

const ShopBidHistoryView = (props: ShopBidHistoryViewProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [dailyrent, setDailyRent] = useState<
    Array<daily_rent & { user: user; rent_transact: daily_rent_transact[] }>
  >([]);

  const init = async () => {
    setLoading(true);

    const dailyrent_response = await GetDailyRent({
      id: parseInt(props.id.toString()),
    });

    if (dailyrent_response.status) {
      setDailyRent(dailyrent_response.data ?? []);
    }

    setLoading(false);
  };
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const dailyrent_response = await GetDailyRent({
        id: parseInt(props.id.toString()),
      });

      if (dailyrent_response.status) {
        setDailyRent(dailyrent_response.data ?? []);
        console.log(dailyrent_response);
      }

      setLoading(false);
    };
    init();
  }, [props.id]);

  const [acceptBox, setAcceptBox] = useState(false);
  const [rejectBox, setRejectBox] = useState(false);

  const acceptBooking = async (id: number) => {
    const accept_response = await AccpectDailyRent({
      id: id,
      userid: userid,
    });
    if (accept_response.status) {
      toast.success("Booking Accepted Successfully.");
    } else {
      toast.error("Booking not Accepted. Please try again.");
    }
    setAcceptBox(false);
    await init();
  };
  const rejectBooking = async (id: number) => {
    const reject_response = await RejectDailyRent({
      id: id,
      userid: userid,
    });
    if (reject_response.status) {
      toast.success("Booking Rejected Successfully.");
    } else {
      toast.error("Booking not Rejected. Please try again.");
    }
    setRejectBox(false);
    await init();
  };

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
          <p className="text-xl text-gray-600">Shop Booking History</p>
          <div className="grow"></div>
        </div>

        {dailyrent.length == 0 ? (
          <p className="text-sm mt-4 mb-2">No Rent History found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] p-2">Sr No.</TableHead>
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
              {dailyrent.map(
                (
                  rentdata: daily_rent & {
                    user: user;
                    rent_transact: daily_rent_transact[];
                  },
                  index
                ) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm p-2">{index + 1}</TableCell>
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
                      {rentdata.is_approved &&
                      rentdata.rent_transact.length > 0 ? (
                        <>
                          <button
                            onClick={() => {
                              router.push(
                                `/dashboard/dailyrentrecept/${rentdata.user.id}/${rentdata.id}/${rentdata.rent_transact[0].id}`
                              );
                            }}
                            className="cursor-pointer bg-blue-500 text-sm px-6 py-1 rounded-md text-white"
                          >
                            View Rent Receipt
                          </button>
                        </>
                      ) : rentdata.is_cancel == false &&
                        rentdata.is_approved == false ? (
                        <>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
                                Action
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">
                                    Actions
                                  </h4>
                                </div>
                                <div className="grid gap-2">
                                  <button
                                    className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
                                    onClick={() => setAcceptBox(true)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="bg-rose-500 text-white px-4 py-1 rounded-md text-sm"
                                    onClick={() => setRejectBox(true)}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>

                          <Dialog open={acceptBox} onOpenChange={setAcceptBox}>
                            <DialogTrigger asChild>
                              {/* <Button variant="outline">Edit Profile</Button> */}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Accept Booking</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to accept this booking?
                                </DialogDescription>
                              </DialogHeader>
                              {/* <ProfileForm /> */}
                              <div className="flex gap-2">
                                <button
                                  className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
                                  onClick={() => acceptBooking(rentdata.id)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-rose-500 text-white px-4 py-1 rounded-md text-sm"
                                  onClick={() => setAcceptBox(false)}
                                >
                                  Close
                                </button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={rejectBox} onOpenChange={setRejectBox}>
                            <DialogTrigger asChild>
                              {/* <Button variant="outline">Edit Profile</Button> */}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Reject Booking</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to reject this booking?
                                </DialogDescription>
                              </DialogHeader>
                              {/* <ProfileForm /> */}
                              <div className="flex gap-2">
                                <button
                                  className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
                                  onClick={() => rejectBooking(rentdata.id)}
                                >
                                  Reject
                                </button>
                                <button
                                  className="bg-rose-500 text-white px-4 py-1 rounded-md text-sm"
                                  onClick={() => setRejectBox(false)}
                                >
                                  Close
                                </button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      ) : (
                        <button
                          className="bg-gray-400 text-white px-4 py-1 rounded-md text-sm"
                          disabled
                        >
                          Action
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default ShopBidHistoryView;
