"use client";

import { capitalcase } from "@/utils/methods";
import { ShopStatus, shop, user } from "@prisma/client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import GetUserRendedShop from "@/action/bid/getapplyedshopformbid";
import { toast } from "react-toastify";
import IsProfileCompleted from "@/action/user/isprofilecompleted";
import { useRouter } from "next/navigation";
import { LucideArrowBigLeft, LucideArrowBigRight } from "@/components/icons";
import { customAlphabet } from "nanoid";
import GetUserRent from "@/action/rent_transact/getuserrent";
import GetPandingRentShopByUserId from "@/action/rent/getpadingrentshopbyuserid";

const BidPropertiesView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const userid: number = parseInt(getCookie("id") ?? "0");
  const router = useRouter();

  // const [user, setUser] = useState<user>();

  const [shops, setShops] = useState<shop[]>([]);

  const [category, setCategory] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filtershop, setFilterShop] = useState<shop[]>([]);

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterShop(shops);
    } else {
      const temp = shops.filter((item: any) => {
        return (
          item.property.name.toString().toLowerCase() === category.toLowerCase()
        );
      });
      setFilterShop(temp);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const isprofilecompleted = await IsProfileCompleted({
        id: userid,
      });

      if (!isprofilecompleted.status) {
        return router.push("/dashboard/userprofile/edit");
      }
      // const userresponse = await GetUser({ id: userid });
      // if (userresponse.status) {
      //   setUser(userresponse.data!);
      // }

      const rent_transaction = await GetPandingRentShopByUserId({
        userid: userid,
      });

      console.log(rent_transaction);

      if (!rent_transaction.status)
        return toast.error(rent_transaction.message);

      const propertry = rent_transaction.data?.map((item: any) => {
        return item.shop.property.name;
      });

      // remove dubplicate property name
      const unique = propertry?.filter(
        (v: any, i: any, a: any) => a.indexOf(v) === i
      );

      setCategory(["All", ...unique]);

      const shopdata = rent_transaction.data?.map((item: any) => {
        return item.shop;
      });

      // remove dubplicate shop
      const uniqueShop = shopdata?.filter(
        (v: any, i: any, a: any) => a.indexOf(v) === i
      );

      setShops(uniqueShop);

      setFilterShop(uniqueShop ?? []);

      setIsLoading(false);
    };
    init();
  }, [userid, router]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-[#162f57] text-2xl font-semibold">
        Property Details
      </h1>

      {filtershop.length >= 1 ? (
        <>
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
          <div className="w-full bg-white rounded-sm shadow-sm mt-4">
            <div className="bg-white rounded-sm shadow-sm">
              <ShowShops
                shops={filtershop}
                name={capitalcase(selectedCategory) + " Shops"}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm mt-4 mb-2">You Have No Rented Property .</p>
      )}
    </div>
  );
};

export default BidPropertiesView;

const ShowShops = (props: { shops: shop[]; name: string }) => {
  const count = 20;
  const [skip, setSkip] = useState(0);
  const [shop, setShop] = useState<shop[]>(props.shops.slice(0, count));

  const next = () => {
    if (skip + count < props.shops.length) {
      setSkip(skip + count);
      setShop(props.shops.slice(skip + count, skip + count + count));
    }
  };
  const prev = () => {
    if (skip - count >= 0) {
      setSkip(skip - count);
      setShop(props.shops.slice(skip - count, skip));
    }
  };

  useEffect(() => {
    setSkip(0);
    setShop(props.shops.slice(0, count));
  }, [props.shops]);
  return (
    <>
      <div className="flex  border-b border-gray-300 pr-4 items-center gap-2">
        <p className="text-lg p-2 font-medium">{props.name}</p>
        <div className="grow"></div>

        <button
          className="bg-white text-2xl rounded-full border border-black"
          onClick={prev}
        >
          <LucideArrowBigLeft />
        </button>

        <button
          className="bg-white text-2xl rounded-full border border-black"
          onClick={next}
        >
          <LucideArrowBigRight />
        </button>
      </div>
      <div className="flex p-2 gap-4 flex-wrap justify-start">
        {shop.map((item: any, index: number) => {
          const pending = item.rent[0].rent_transact.filter(
            (item: any) =>
              item.status === "MONTHCROSS" ||
              item.status === "DUE" ||
              item.status === "LATE"
          );

          const amount = pending.reduce(
            (acc: number, item: any) => acc + item.amount,
            0
          );

          const ids = pending.map((item: any) => item.id.toString());

          return (
            <PropertiesDeatils
              key={index}
              id={item.id.toString()}
              status={item.status}
              count={item.shopNumber}
              field={ids}
              amount={amount}
            />
          );
        })}
      </div>
    </>
  );
};

interface PropertiesDeatilsProps {
  count: string;
  status: string;
  id: string;
  amount: number;
  field: string[];
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  const router = useRouter();

  const getColor = (value: ShopStatus): string => {
    switch (value) {
      case ShopStatus.VACANT:
        return "border-green-500 bg-gradient-to-r from-green-400 to-green-500";
      case ShopStatus.AUCTION:
        return "border-yellow-500 bg-gradient-to-r from-yellow-400 to-yellow-500";
      case ShopStatus.MAINTENANCE:
        return "border-blue-500 bg-gradient-to-r from-blue-400 to-blue-500";
      case ShopStatus.RENTED:
        return "border-red-500 bg-gradient-to-r from-red-400 to-red-500";
      case ShopStatus.UNAVAILABLE:
        return "border-purple-500 bg-gradient-to-r from-purple-400 to-purple-500";
      default:
        return "border-green-500 bg-gradient-to-r from-green-400 to-green-500";
    }
  };
  return (
    <div
      className={`border rounded-md grid place-items-center p-2 min-w-24 `}
      onClick={async () => {
        // const rentTransactresponse = await GetUserRent({ rentid: props.id });
        // if (rentTransactresponse.status) {
        //   console.log(rentTransactresponse.data);
        // }
        const nanoid = customAlphabet("1234567890abcdef", 10);
        const uniqueid = nanoid();
        const ids: string = props.field.join(",");
        router.push(
          `/payamount?xlmnx=${props.amount}&ynboy=${uniqueid}&zgvfz=${ids}_0_0_rent`
        );
      }}
    >
      <p className="text-xs">Shop No:</p>
      <p className="text-lg">{props.count}</p>
      <p
        className={`text-sm   text-white px-2 rounded ${getColor(
          props.status as ShopStatus
        )}`}
      >
        {props.status}
      </p>
    </div>
  );
};
