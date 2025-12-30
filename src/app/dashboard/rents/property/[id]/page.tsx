"use client";

import GetProperty from "@/action/property/getproperty";
import GetShopsByProperty from "@/action/shop/getshopfromproperty";
import { LucideArrowBigLeft, LucideArrowBigRight } from "@/components/icons";
import { capitalcase, removeDuplicates, decryptURLData, encryptURLData } from "@/utils/methods";
import { ShopStatus, property, shop } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RentPropertiesView = () => {
  const router = useRouter();
  const param = useParams();

  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);

  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<shop[]>([]);

  const [property, setProperty] = useState<property>();

  const [category, setCategory] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [filtershop, setFilterShop] = useState<shop[]>([]);

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

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      const propertyresponse = await GetProperty({
        id: id,
      });

      if (propertyresponse.status) {
        setProperty(propertyresponse.data!);
      }

      // const shopresponse = await getShopsByStatus({
      //   status: ShopStatus.RENTED,
      // });

      const shopresponse = await GetShopsByProperty({
        propertyid: id,
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

      setCategory(["All", ...removeDuplicates(temp)]);

      setIsLoading(false);
    };

    init();
  }, [id]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
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
    </div>
  );
};

export default RentPropertiesView;

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
    <Link href={`/dashboard/shops/details/${encryptURLData(props.id.toString())}`} target="_blank">
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
