"use client";

import CreateShop from "@/action/shop/createshop";
import AllShopCategorys from "@/action/shop_category/allshopcategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateShopSchema } from "@/schema/createshop";
import { Floors, shop_category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

interface AddShopPageProps {
  id: number;
  name: string;
}

const AddShopPage = (props: AddShopPageProps) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [shop_category, setShopCategory] = useState<shop_category[]>([]);

  const [shopcategory, setshopcategory] = useState<number>(0);
  const [floor, setFloor] = useState<Floors>(Floors.GROUND);

  const shopnumber = useRef<HTMLInputElement>(null);
  const size = useRef<HTMLInputElement>(null);
  const meter = useRef<HTMLInputElement>(null);

  const init = async () => {
    setLoading(true);
    const shop_categoryresponse = await AllShopCategorys({});
    if (shop_categoryresponse.status) {
      setShopCategory(shop_categoryresponse.data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const create = async () => {
    const result = safeParse(CreateShopSchema, {
      id: parseInt(props.id.toString()),
      shopCategoryId: shopcategory,
      shopNumber: shopnumber.current?.value,
      shopSize: size.current?.value,
      floor: floor,
    });

    if (result.success) {
      const createshop = await CreateShop({
        propertyId: parseInt(props.id.toString()),
        shopCategoryId: shopcategory,
        creadtedById: 1,
        floor: floor,
        shopNumber: shopnumber.current?.value!,
        shopSize: size.current?.value!,
        meterno: meter.current?.value,
      });

      if (!createshop.status) return toast.error(createshop.message);
      toast.success("Shop added successfully");
      router.back();
    } else {
      let errorMessage = "";
      if (result.issues[0].input) {
        errorMessage = result.issues[0].message;
      } else {
        errorMessage = result.issues[0].path![0].key + " is required";
      }
      toast.error(errorMessage);
    }
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
        <h1 className="text-[#162f57] text-2xl font-semibold">Add a Shop </h1>
        <p className="text-sm mt-4 mb-2">
          Get started by addding your shop&apos;s details below.
        </p>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500">GENERAL INFORMATION</p>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="propertes">Select Property</Label>
              <Input
                id="propertes"
                type="text"
                className="w-full bg-gray-100"
                disabled
                value={props.name}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="category">Select Shop Category</Label>
              <Select
                onValueChange={(val) => {
                  setshopcategory(parseInt(val));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Shop Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {shop_category.map((val) => (
                      <SelectItem key={val.id} value={val.id.toString()}>
                        {val.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="shopnumber">Shop Number</Label>
              <Input
                id="shopnumber"
                type="text"
                className="w-full bg-gray-100"
                ref={shopnumber}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="floornumber">Floor Number</Label>
              <Select
                onValueChange={(val: Floors) => {
                  setFloor(val);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Floors.OUTSIDE}>
                      {Floors.OUTSIDE}
                    </SelectItem>
                    <SelectItem value={Floors.GROUND}>
                      {Floors.GROUND}
                    </SelectItem>
                    <SelectItem value={Floors.FIRST}>{Floors.FIRST}</SelectItem>
                    <SelectItem value={Floors.SECOND}>
                      {Floors.SECOND}
                    </SelectItem>
                    <SelectItem value={Floors.THIRD}>{Floors.THIRD}</SelectItem>
                    <SelectItem value={Floors.FOURTH}>
                      {Floors.FOURTH}
                    </SelectItem>
                    <SelectItem value={Floors.FIFTH}>{Floors.FIFTH}</SelectItem>
                    <SelectItem value={Floors.SIXTH}>{Floors.SIXTH}</SelectItem>
                    <SelectItem value={Floors.SEVENTH}>
                      {Floors.SEVENTH}
                    </SelectItem>
                    <SelectItem value={Floors.EIGHTH}>
                      {Floors.EIGHTH}
                    </SelectItem>
                    <SelectItem value={Floors.NINTH}>{Floors.NINTH}</SelectItem>
                    <SelectItem value={Floors.TENTH}>{Floors.TENTH}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="size">Shop Size</Label>
              <Input
                id="size"
                type="text"
                className="w-full bg-gray-100"
                ref={size}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="meter">Meter Number</Label>
              <Input
                id="meter"
                type="text"
                className="w-full bg-gray-100"
                ref={meter}
              />
            </div>
          </div>
          <Button className="w-full mt-4" onClick={create}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};
export default AddShopPage;
