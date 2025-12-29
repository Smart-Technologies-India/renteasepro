"use client";
import GetRent from "@/action/rent/getrent";
import GetUserRent from "@/action/rent_transact/getuserrent";
import BackButton from "@/components/backbutton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { formateDate } from "@/utils/methods";
import { rent_transact } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customAlphabet } from "nanoid";
import AddOrderId from "@/action/rent_transact/addorderid";

const UserRentDetailsView = () => {
  const [field, setField] = useState<number[]>([]);
  const router = useRouter();
  const param = useParams();
  const id: number = parseInt(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0"
  );

  const [isPaying, setPaying] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(0);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<any>();
  const [rentTransact, setRentTransact] = useState<rent_transact[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const rentresponse = await GetRent({ id: id });
      if (rentresponse.status) {
        setRent(rentresponse.data);
      }

      const rentTransactresponse = await GetUserRent({ rentid: id });
      if (rentTransactresponse.status) {
        setRentTransact(rentTransactresponse.data as rent_transact[]);
      }
      setLoading(false);
    };
    init();
  }, [id]);

  const payfees = async () => {
    if (field.length == 0) {
      toast.error("Please select atleast one month to pay rent");
      setLoading(false);
      setPaying(false);
      return;
    }

    const nanoid = customAlphabet("1234567890abcdef", 10);

    const uniqueid = nanoid();
    const ids: string = field.join(",");

    await AddOrderId({
      rentid: field,
      orderid: uniqueid,
    });
    const name: string = `${rent.user.firstName} ${rent.user.lastName}`;

    router.push(
      `/payamount?xlmnx=${amount}&ynboy=${uniqueid}&zgvfz=${ids}_0_0_rent&name=${name}&email=${rent.user.email}&mobile=${rent.user.contactone}`
    );
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
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-[#162f57] text-2xl font-semibold">
            Rent Details
          </h1>
        </div>

        <div className="flex gap-4">
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
            <p className="text-gray-500 text-center">General Information</p>
            <Separator />
            <div className="grid gap-4 mt-4 grid-cols-2">
              <p className="text-xs leading-3">
                Shop Number <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent.shop.shopNumber}
                  {/* {rent.shop.shopNumber < new Date() ? "Ended" : "Running"} */}
                </span>
              </p>

              <p className="text-xs leading-3">
                Shop Size <br />
                <span className="text-sm text-gray-500 font-medium">
                  {/* {rent.shop.shopSize < new Date() ? "Ended" : "Running"} */}
                  {rent.shop.shopSize}
                </span>
              </p>

              <p className="text-xs leading-3">
                Start Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rent.rent_start_date))}
                </span>
              </p>

              <p className="text-xs leading-3">
                End Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {formateDate(new Date(rent.rent_end_date))}
                </span>
              </p>

              <p className="text-xs leading-3">
                Rent Amount <br />
                <span className="text-sm text-gray-500 font-medium">
                  &#8377;{rent.rent_amount}
                </span>
              </p>

              <p className="text-xs leading-3">
                Due Date <br />
                <span className="text-sm text-gray-500 font-medium">
                  {rent.due_date}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1 text-sm">
            <p className="text-gray-500 text-center">Rent Payment</p>

            <Separator />
            {rentTransact.length == 0 ? (
              <>
                <p className="p-1 bg-gray-100 rounded mt-4">No Rent Pending</p>
              </>
            ) : (
              <>
                <div className="mt-4 flex my-2">
                  <h1 className="">Pending Rent</h1>
                  <div className="grow"></div>
                  <p className="">
                    &#8377;
                    {rentTransact.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.amount,
                      0
                    )}{" "}
                    - ({rentTransact.length} Months)
                  </p>
                </div>
                <Separator />

                {rentTransact.map((item, index) => (
                  <div key={index} className="flex my-2 items-center gap-2">
                    <Checkbox
                      disabled={
                        index == 0
                          ? false
                          : !field?.includes(rentTransact[index - 1].id)
                      }
                      checked={field?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setField([...field, item.id]);
                        } else {
                          // setField(field.filter((id) => id !== item.id));
                          // remove the curretn checkbox and all the checkbox after it
                          setField(field.slice(0, index));
                        }

                        if (checked) {
                          setAmount(amount + item.amount);
                        } else {
                          // setAmount(amount - item.amount);
                          // remove the curent amount and all the amount after it
                          setAmount(
                            rentTransact
                              .slice(0, index)
                              .reduce((a, b) => a + b.amount, 0)
                          );
                        }
                      }}
                    />
                    <p>
                      {new Date(item.formonth).toLocaleString("default", {
                        month: "long",
                      })}
                      -
                      {new Date(item.formonth).toLocaleString("default", {
                        year: "numeric",
                      })}
                    </p>
                    <div className="grow"></div>
                    <p>&#8377;{item.amount}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between mt-2">
                  <p>Rent</p>
                  <p>&#8377;{amount}</p>
                </div>

                <div className="flex justify-between mt-2">
                  <p>Interest</p>
                  {/* <p>{parseInt((amount * 0.02).toString(), 0)}</p> */}
                  <p>&#8377;0</p>
                </div>

                <div className="flex justify-between mt-2">
                  <p>Penalty</p>
                  <p>&#8377;0</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Total</p>

                  <p>&#8377;{amount.toString()}</p>
                </div>

                {isPaying ? (
                  <Button
                    disabled
                    className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                  >
                    Loading....
                  </Button>
                ) : (
                  <Button
                    onClick={payfees}
                    className="w-full mt-4 bg-[#172e57] hover:bg-[#224688]"
                  >
                    Pay Rent
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRentDetailsView;
