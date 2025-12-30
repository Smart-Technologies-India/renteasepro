"use client";
import GetDailyRent from "@/action/dailyrent/getdailyrent";
import BackButton from "@/components/backbutton";
import { FluentMdl2Home } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDate, decryptURLData, encryptURLData } from "@/utils/methods";
import { daily_rent, daily_rent_transact, user } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";

const ShopBidHistoryView = () => {
  const router = useRouter();
  const param = useParams();
  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);

  const [userid, setUserid] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [dailyrent, setDailyRent] = useState<
    Array<daily_rent & { user: user; rent_transact: daily_rent_transact[] }>
  >([]);

  const init = async () => {
    setLoading(true);

    const dailyrent_response = await GetDailyRent({
      id: id,
    });

    if (dailyrent_response.status) {
      setDailyRent(dailyrent_response.data ?? []);
    }

    setLoading(false);
  };


  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);

      const dailyrent_response = await GetDailyRent({
        id: id,
      });

      if (dailyrent_response.status) {
        setDailyRent(dailyrent_response.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, [id]);

  // const [acceptBox, setAcceptBox] = useState(false);
  // const [rejectBox, setRejectBox] = useState(false);

  // const acceptBooking = async (id: number) => {
  //   const accept_response = await AccpectDailyRent({
  //     id: id,
  //     userid: userid,
  //   });
  //   if (accept_response.status) {
  //     toast.success("Booking Accepted Successfully.");
  //   } else {
  //     toast.error("Booking not Accepted. Please try again.");
  //   }
  //   setAcceptBox(false);
  //   await init();
  // };
  // const rejectBooking = async (id: number) => {
  //   const reject_response = await RejectDailyRent({
  //     id: id,
  //     userid: userid,
  //   });
  //   if (reject_response.status) {
  //     toast.success("Booking Rejected Successfully.");
  //   } else {
  //     toast.error("Booking not Rejected. Please try again.");
  //   }
  //   setRejectBox(false);
  //   await init();
  // };

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
                      <button
                        onClick={() => {
                          router.push(
                            `/dashboard/dailyshops/viewrent/${encryptURLData(rentdata.id.toString())}/${encryptURLData(rentdata.user.id.toString())}`
                          );
                        }}
                        className="cursor-pointer bg-blue-500 text-sm px-2 py-1 rounded-md text-white text-nowrap"
                      >
                        View
                      </button>
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
