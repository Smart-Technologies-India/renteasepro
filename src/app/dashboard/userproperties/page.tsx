"use client";

import { capitalcase, encryptURLData } from "@/utils/methods";
import { ShopStatus, shop, user } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import GetUser from "@/action/user/getuser";
import GetUserRendedShop from "@/action/bid/getapplyedshopformbid";
import { toast } from "react-toastify";
import IsProfileCompleted from "@/action/user/isprofilecompleted";
import { useRouter } from "next/navigation";
import { LucideArrowBigLeft, LucideArrowBigRight } from "@/components/icons";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";

const BidPropertiesView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userid, setUserid] = useState<number>(0);
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

      // Get authenticated user ID from server
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      
      const authenticatedUserId = authResponse.data;
      setUserid(authenticatedUserId);

      const isprofilecompleted = await IsProfileCompleted({
        id: authenticatedUserId,
      });

      if (!isprofilecompleted.status) {
        return router.push("/dashboard/userprofile/edit");
      }
      // const userresponse = await GetUser({ id: authenticatedUserId });
      // if (userresponse.status) {
      //   setUser(userresponse.data!);
      // }

      const rent_transaction = await GetUserRendedShop({ userid: authenticatedUserId });
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
        {shop.map((item: shop, index: number) => (
          <PropertiesDeatils
            key={index}
            id={item.id.toString()}
            status={item.status}
            count={item.shopNumber}
          />
        ))}
      </div>
    </>
  );
};

interface PropertiesDeatilsProps {
  count: string;
  status: string;
  id: string;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
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
    <Link href={`/dashboard/shops/details/${encryptURLData(props.id.toString())}`}>
      <div
        className={`border rounded-md grid place-items-center p-2 min-w-24 `}
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
    </Link>
  );
};
