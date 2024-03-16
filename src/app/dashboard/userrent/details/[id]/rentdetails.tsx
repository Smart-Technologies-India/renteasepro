"use client";
import GetRent from "@/action/rent/getrent";
import GetUserRent from "@/action/rent_transact/getuserrent";
import PayRent from "@/action/rent_transact/payrent";
import BackButton from "@/components/backbutton";
import { AntDesignCheckOutlined } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { formateDate } from "@/utils/methods";
import { rent_transact } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserRentDetailsViewProps {
  id: number;
}

const UserRentDetailsView = (props: UserRentDetailsViewProps) => {
  const [field, setField] = useState<number[]>([]);

  const [amount, setAmount] = useState<number>(0);

  const items = [
    {
      name: "January",
      status: true,
    },
    {
      name: "February",
      status: true,
    },
    {
      name: "March",
      status: true,
    },
    {
      name: "April",
      status: true,
    },
    {
      name: "May",
      status: true,
    },
    {
      name: "June",
      status: true,
    },
    {
      name: "July",
      status: true,
    },
    {
      name: "August",
      status: true,
    },
    {
      name: "September",
      status: false,
    },
    {
      name: "October",
      status: false,
    },
    {
      name: "November",
      status: false,
    },
    {
      name: "December",
      status: false,
    },
  ];

  const [isLoading, setLoading] = useState<boolean>(true);
  const [rent, setRent] = useState<any>();
  const [rentTransact, setRentTransact] = useState<rent_transact[]>([]);
  // GetUserRent

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const rentresponse = await GetRent({ id: parseInt(props.id.toString()) });
      if (rentresponse.status) {
        setRent(rentresponse.data);
      }
      const rentTransactresponse = await GetUserRent({ rentid: props.id });
      if (rentTransactresponse.status) {
        setRentTransact(rentTransactresponse.data as rent_transact[]);
      }
      setLoading(false);
    };
    init();
  }, [props.id]);

  const payfees = async () => {
    setLoading(true);
    const payrent_response = await PayRent({ rentid: field });
    if (payrent_response.status) {
      toast.success(payrent_response.message);
    }

    const rentresponse = await GetRent({ id: parseInt(props.id.toString()) });
    if (rentresponse.status) {
      setRent(rentresponse.data);
    }
    const rentTransactresponse = await GetUserRent({ rentid: props.id });
    if (rentTransactresponse.status) {
      setRentTransact(rentTransactresponse.data as rent_transact[]);
    }
    setField([]);
    setAmount(0);
    setLoading(false);
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6 sm:p-10">
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

            <div className="mt-4">
              <h1 className="">Shop Number:</h1>
              <p className="">{rent.shop.shopNumber}</p>
            </div>

            <div className="mt-4">
              <h1 className="">Shop Size:</h1>
              <p className="">{rent.shop.shopSize}</p>
            </div>

            <div className="mt-4">
              <h1 className="">Start Date:</h1>
              <p className="">{formateDate(new Date(rent.rent_end_date))}</p>
            </div>

            <div className="mt-4">
              <h1 className="">End Date:</h1>
              <p className="">{formateDate(new Date(rent.rent_start_date))}</p>
            </div>

            <div className="mt-4">
              <h1 className="">Rent Amount:</h1>
              <p className="">{rent.rent_amount}</p>
            </div>

            <div className="mt-4">
              <h1 className="">Due Date:</h1>
              <p className="">{rent.due_date}</p>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm p-4 my-2 flex-1">
            <p className="text-gray-500 text-center">Rent Payment</p>

            <Separator />
            {rentTransact.length == 0 ? (
              <>
                <p className="p-1 bg-gray-100 rounded mt-4">No Rent Pending</p>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <h1 className="">Pending Rent:</h1>
                  <p className="">
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
                    </p>
                    <div className="grow"></div>
                    <p>{item.amount}</p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between mt-2">
                  <p>Rent</p>
                  <p>{amount}</p>
                </div>

                <div className="flex justify-between mt-2">
                  <p>Interest</p>
                  <p>{parseInt((amount * 0.02).toString(), 0)}</p>
                </div>

                <div className="flex justify-between mt-2">
                  <p>Penalty</p>
                  <p>{parseInt((amount * 0.05).toString(), 0)}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Total</p>
                  <p>
                    {parseInt(
                      (amount + amount * 0.02 + amount * 0.05).toString(),
                      0
                    )}
                  </p>
                </div>

                <Button onClick={payfees} className="w-full mt-4">
                  Pay Fees
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="w-full bg-white rounded-sm shadow-sm mt-4">
          <div className="bg-white rounded-sm shadow-sm">
            <p className="text-xl p-2  font-semibold border-b border-gray-300">
              {" "}
              Rent History - 2022
            </p>

            <div className="grow grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 md:grid-cols-4 gap-2 flex-wrap justify-center items-center">
              {items.map((item, index) => (
                <PropertiesDeatils key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRentDetailsView;

interface PropertiesDeatilsProps {
  name: string;
  status: boolean;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  return (
    <>
      <div
        className={`p-2  flex flex-col  items-center justify-start px-4 py-2 min-w-28`}
      >
        <p className={`text-sm text-black`}>{props.name}</p>
        <div
          className={`text-sm h-7  mx-auto rounded-md mt-2 py-1 grid place-items-center w-10 border ${
            props.status
              ? "border-green-500 bg-green-500 bg-opacity-10"
              : "border-gray-100 bg-gray-100"
          }`}
        >
          {props.status && (
            <AntDesignCheckOutlined className="text-green-500 text-xl" />
          )}
        </div>
      </div>
    </>
  );
};
