"use client";

import { capitalcase } from "@/utils/methods";
import { shop, user } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import GetUser from "@/action/user/getuser";
import GetUserRendedShop from "@/action/bid/getapplyedshopformbid";
import { toast } from "react-toastify";
import IsProfileCompleted from "@/action/user/isprofilecompleted";
import { useRouter } from "next/navigation";

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

      const rent_transaction = await GetUserRendedShop({ userid: userid });
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
              <p className="text-lg p-2 border-b border-gray-300 font-medium">
                {capitalcase(selectedCategory)} Shops
              </p>

              <div className="flex p-2 gap-4 flex-wrap justify-start">
                {filtershop.map((item: shop, index: number) => (
                  <PropertiesDeatils
                    key={index}
                    id={item.id.toString()}
                    status={item.status}
                    count={item.shopNumber}
                  />
                ))}
              </div>
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

interface PropertiesDeatilsProps {
  count: string;
  status: string;
  id: string;
}

const PropertiesDeatils = (props: PropertiesDeatilsProps) => {
  return (
    <Link href={`/dashboard/shops/details/${props.id}`}>
      <div className="border p-2 rounded-md grid place-items-center px-4 py-2 min-w-28">
        <p className="text-xs">Shop No:</p>
        <p className="text-lg">{props.count}</p>
        <p className="text-sm">{props.status}</p>
      </div>
    </Link>
  );
};
