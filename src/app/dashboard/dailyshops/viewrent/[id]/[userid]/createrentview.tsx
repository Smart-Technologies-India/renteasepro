/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  shop_category,
  user,
} from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { addDays, eachDayOfInterval, format, isAfter, subDays } from "date-fns";
import { default as MulSelect } from "react-select";
import GetDailyShop from "@/action/dailyshop/getdailyshop";
import CreateDailyRent from "@/action/dailyrent/createdailyrent";
import { CreateDailyRentSchema } from "@/schema/createdailyrent";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker, Modal, Space } from "antd";
import GetDailyRent from "@/action/dailyrent/getdailyrent";
import { customAlphabet } from "nanoid";
import GetUser from "@/action/user/getuser";
import GetDailyRentById from "@/action/dailyshop/getdailyrent";
import { formateDate } from "@/utils/methods";
import BackButton from "@/components/backbutton";

const { RangePicker } = DatePicker;

interface CreateRentProps {
  rentid: number;
  userid: number;
}

const CreateRentPage = (props: CreateRentProps) => {
  const router = useRouter();
  const createuserid: number = parseInt(getCookie("id") ?? "0");

  // const [isCreating, setIsCreating] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [shopData, setShopData] = useState<any>();
  const [rentData, setRentData] = useState<
    | (daily_rent & {
        daily_shop: daily_shop & {
          property: daily_property;
          shop_category: shop_category;
          daily_rent_transact: daily_rent_transact[];
        };
      })
    | null
  >();

  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const dailyrentresponse = await GetDailyRentById({
        id: props.rentid,
      });

      if (dailyrentresponse.status && dailyrentresponse.data) {
        setRentData(dailyrentresponse.data);

        const userresponse = await GetUser({ id: createuserid });
        if (userresponse.status) {
          setUser(userresponse.data!);
        }

        const shopresponse = await GetDailyShop({
          id: dailyrentresponse.data.shopId,
        });
        if (shopresponse.status) {
          setShopData(shopresponse.data ?? null);
        }
      }

      setLoading(false);
    };
    init();
  }, []);

  interface MonthType {
    isDisable: boolean;
    amount: string;
    month: string;
  }

  const [open, setOpen] = useState(false);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-sm shadow-sm p-4">
          <div className="flex items-center gap-2">
            <BackButton />
            <p className="text-gray-500 text-xl gap-4">View rent for Unit</p>
            <div className="grow"></div>
            {rentData?.daily_shop.daily_rent_transact.filter(
              (val: daily_rent_transact) => val.status == "PAID"
            ).length == 1 ? (
              <button
                onClick={() => {
                  const nanoid = customAlphabet("1234567890abcdef", 10);
                  const uniqueid = nanoid();
                  router.push(
                    `/payamount?xlmnx=${rentData?.deposit_amount!}&ynboy=${uniqueid}&zgvfz=${
                      rentData?.daily_shop.daily_rent_transact[1]?.id
                    }_0_0_deposit&name=${user?.firstName}-${
                      user?.lastName
                    }&email=${user?.email}&mobile=${user?.contactone}`
                  );
                }}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                Pay Deposit
              </button>
            ) : null}

            {rentData?.daily_shop.daily_rent_transact.filter(
              (val: daily_rent_transact) => val.status == "PAID"
            ).length != 0 && (
              <button
                onClick={() => {
                  router.push(
                    `/dashboard/dailyrentrecept/${user?.id}/${props.rentid}/${rentData?.daily_shop.daily_rent_transact[0]?.id}`
                  );
                }}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
              >
                View Receipt
              </button>
            )}
            <button
              onClick={() => setOpen(true)}
              className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
            >
              Terms & Condition
            </button>
          </div>

          <div className="flex gap-4">
            <div className="grid w-full mt-4">
              <Label htmlFor="propertes">Property</Label>
              <p>{shopData?.property?.name}</p>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shopNumber">Unit Name</Label>
              <p>{shopData?.name}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label>
                Rent start to end date <span className="text-rose-500">*</span>
              </Label>
              <p>
                From {formateDate(new Date(rentData?.event_from_date!))} to{" "}
                {formateDate(new Date(rentData?.event_to_date!))}
              </p>
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="user">
                Purpose <span className="text-rose-500">*</span>
              </Label>
              <p>{rentData?.event_reason}</p>
            </div>
          </div>

          {user && (
            <div className="grid items-center gap-1.5 w-full mt-4 bg-gray-100 p-2 rounded-md">
              <Label htmlFor="user">
                User Details <span className="text-rose-500">*</span>
              </Label>
              <div className="">
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Contact: {user.contactone}</p>
                <p>Email: {user.email}</p>
              </div>
            </div>
          )}

          <div className=" w-full mt-4 bg-gray-100 p-2 rounded-md">
            <Label htmlFor="user">
              Payment Details <span className="text-rose-500">*</span>
            </Label>

            <div className="flex w-full">
              <p>Price</p>
              <div className="grow"></div>
              <p>{rentData?.event_amount}</p>
            </div>
            <div className="flex w-full">
              <p>Pre-Preparation Charge</p>
              <div className="grow"></div>
              <p> {rentData?.prep_day_amount}</p>
            </div>
            <div className="flex w-full">
              <p>Venue-Handover Charge</p>
              <div className="grow"></div>
              <p>{rentData?.handover_day_amount}</p>
            </div>
            <div className="flex w-full">
              <p>Deposit</p>
              <div className="grow"></div>
              <p>{rentData?.deposit_amount}</p>
            </div>
            <div className="w-full h-[1px] bg-gray-500"></div>
            <div className="flex w-full">
              <p>Total</p>
              <div className="grow"></div>
              <p>
                {parseFloat(rentData?.event_amount ?? "0") +
                  parseFloat(rentData?.prep_day_amount ?? "0") +
                  parseFloat(rentData?.handover_day_amount ?? "0") +
                  parseFloat(rentData?.deposit_amount ?? "0")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Terms & Condition"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        className="my-10 h-[600px] overflow-y-scroll"
      >
        <p className="text-sm  font-normal my-2 text-rose-500">
          1. The DNHPDA reserves the right to cancel the allotment of space at
          Kala-Kendra, Auditorium and Banquet Hall in case of any government
          functions without assigning any reason thereof.
        </p>

        <p className="text-sm text-gray-800 font-normal my-2">
          2. The applicant shall ensure that they shall maintain the floor and
          premises of the Banquet hall clean by avoiding littering of food
          materials over the wooden floors, by sufficient provision of waste
          bins etc.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          3. The applicant shall be responsible for maintaining cleanliness and
          hygiene during and after completion of function at the allotted space
          area and all used premises. If the same is not maintained and
          cleanness is not observed by the component authority, and penalty
          shall be levied amounting to Rs. 5000/- and the security deposit
          submitted to the department shall be forfeited without any further
          explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          4. The applicant shall not stick any adhesive based posters in the
          entire premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          5. The applicant shall ensure that there shall not be any damages to
          the assets such as Auditorium and Banquet Hall/Exhibition Hall space,
          Acoustic wall panels, lighting components, floor carpets, stage
          platform, mic podiums, projectors, lighting Components and its
          accessories, Audio sound system and accessories, seating chairs, V.I.P
          chairs, recliners, electrical connections, main stage accessories,
          viewers chairs at Pavilion area, seating steps at Open air
          Amphitheatre area etc. of the allotted space area/ premises.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          6. The penalty of Rs. 100/- per Sq. Mt is imposed in case the
          applicant has not taken the permission and approval from the competent
          authority for utilizing the extra open space (Outer space) occupied
          for function other than allotment space.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          7. Havan, Pooja, Outdoor cooking, Tandoor etc. is prohibited in the
          Extra Open Space (Outer Space).
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          8. The entire premises shall be available from 7:00 AM to 10:00 PM
          only.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          9. The applicant shall obey the timing orders and failing to do so,
          shall lead to forfeiture of the deposit submitted by the applicant.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          10. Havan, Pooja, Katha, Crackers etc. shall not be allowed and is
          strictly prohibited in Auditorium Hall, Banquet hall, Exhibition Hall,
          Bride room and Groom Room. The same shall only be allowed in Open Air
          Amphitheatre with all the preventive measures.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          11. Eating and drinking is strictly prohibited inside the Auditorium
          Halls and if found, the applicant shall have to pay a penalty amount
          of Rs. 5000/- to the concerned department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          12. After receiving or informing the applicant about the Allotment
          Order, the payment should be done within a week by the applicant. If
          the applicant fails to do so, the booked date / allotted date shall be
          considered as cancelled without any intimation and same shall be
          allotted to the other applicant in the queue.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          13. If the applicant has to change their booked date / allotted date,
          25% shifting charges shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          14. If the applicant has to cancel their booked date / allotted date,
          50% Cancellation charges shall be applied and the remaining amount
          shall be transferred to the applicant by the department.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          15. If the applicant has to cancel their booked date / allotted date
          before 1 week, in that case 100% Cancellation charge shall be applied.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          16. Smoking, drinking of alcohol, non-vegetarian food, chewing of
          tobacco is strictly prohibited in the entire premises and if found,
          you shall have to pay a penalty amount of Rs. 5000/- and also the
          security deposit submitted to the department shall be forfeited
          without any further explanation.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          17. Violation or lapses found in any of the above conditions by the
          applicant, the competent authority has the right to take necessary
          action or by imposing the penalty as assigned thereof.
        </p>
        <p className="text-sm text-gray-800 font-normal my-2">
          18. The applicant shall manage all the parking arrangements of their
          guests by their own and shall not park the vehicles at service roads /
          main road. The applicant must not tamper with any of the car park
          systems, including access control, ventilation, fire protection,
          surveillance and communications in the parking area.
        </p>
      </Modal>
    </>
  );
};

export default CreateRentPage;
