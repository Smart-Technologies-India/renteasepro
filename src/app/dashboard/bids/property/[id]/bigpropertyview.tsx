"use client";

import GetProperty from "@/action/property/getproperty";
import getShopsByStatus from "@/action/shop/getshopbystatus";
import { capitalcase } from "@/utils/methods";
import { ShopStatus, property, shop, user } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";

interface BidPropertiesViewProps {
  id: number;
}

const BidPropertiesView = (props: BidPropertiesViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<shop[]>([]);

  const userid: number = parseInt(getCookie("id") ?? "0");

  const [property, setProperty] = useState<property>();

  const [category, setCategory] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filtershop, setFilterShop] = useState<shop[]>([]);

  const [user, setUser] = useState<user>();

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterShop(shops);
    } else {
      const temp = shops.filter((item: any) => {
        return capitalcase(item.shop_category.name) === category;
      });
      setFilterShop(temp);
    }
  };

  const init = async () => {
    setIsLoading(true);

    const propertyresponse = await GetProperty({
      id: parseInt(props.id.toString()),
    });

    if (propertyresponse.status) {
      setProperty(propertyresponse.data!);
    }

    const shopresponse = await getShopsByStatus({
      status: ShopStatus.AUCTION,
    });
    if (shopresponse.status) {
      setShops(shopresponse.data ?? []);
      setFilterShop(shopresponse.data ?? []);
    }

    let temp: string[] = [];

    shopresponse.data?.map((item: any) => {
      if (!temp.includes(item.shop_category.name)) {
        temp.push(capitalcase(item.shop_category.name));
      }
    });

    setCategory(["All", ...temp]);

    const userresponse = await GetUser({ id: userid });
    if (userresponse.status) {
      setUser(userresponse.data!);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6 sm:p-10">
      <div className="flex gap-4 items-center">
        <BackButton />
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Property Details
        </h1>
      </div>
      <p className="text-sm mt-4 mb-2">
        Get started by selecting shop and applaying for bidog.
      </p>
      {user?.role === "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div className="bg-white rounded-sm shadow-sm">
            <p className="text-xl p-2 border-b border-gray-300 font-semibold">
              Property Details
            </p>
            <p className="px-2 text-sm">{property?.name}</p>
            <p className="px-2 text-sm">{property?.address}</p>
            <p className="px-2 text-sm">{property?.locality}</p>
            <p className="px-2 text-sm">
              {property?.city}-{property?.pincode}
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-sm">
            <iframe
              src={`https://maps.google.com/maps?q=${property?.latitude},${property?.longitude}&output=embed`}
              width="400"
              height="300"
              loading="lazy"
              className="border-0 w-full h-full rounded-sm"
            ></iframe>
          </div>
        </div>
      )}

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

          <div className="flex p-2 gap-4">
            <div className="grow flex gap-2 overflow-x-hidden justify-start items-center">
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
      </div>
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
