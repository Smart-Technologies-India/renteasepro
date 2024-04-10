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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateShopSchema } from "@/schema/createshop";
import { Floors, shop_category } from "@prisma/client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

interface AddShopPageProps {
  id: number;
  name: string;
}

const AddShopPage = (props: AddShopPageProps) => {
  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [shop_category, setShopCategory] = useState<shop_category[]>([]);

  const [shopcategory, setshopcategory] = useState<number>(0);
  const [floor, setFloor] = useState<Floors>(Floors.GROUND);

  const shopnumber = useRef<HTMLInputElement>(null);
  const size = useRef<HTMLInputElement>(null);
  const meter = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const shop_categoryresponse = await AllShopCategorys({});
      if (shop_categoryresponse.status) {
        setShopCategory(shop_categoryresponse.data ?? []);
      }

      setLoading(false);
    };
    init();
  }, []);

  const create = async () => {
    setIsCreating(true);
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
        creadtedById: userid,
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

    setIsCreating(false);
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
        {/*<h1 className="text-[#162f57] text-2xl font-semibold">Add a Shop </h1> */}

        <div className="bg-white rounded-sm shadow-sm p-4">
          <p className="text-gray-500 text-xl">Add a Shop</p>

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
              <Label htmlFor="category">
                Select Shop Category <span className="text-rose-500">*</span>
              </Label>
              <Select
                onValueChange={(val) => {
                  setshopcategory(parseInt(val));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Shop Category" />
                </SelectTrigger>
                <SelectContent className="h-64">
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
              <Label htmlFor="shopnumber">
                Shop Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="shopnumber"
                type="text"
                className="w-full bg-gray-100"
                ref={shopnumber}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="floornumber">
                Floor Number <span className="text-rose-500">*</span>
              </Label>
              <Select
                onValueChange={(val: Floors) => {
                  setFloor(val);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent className="h-64">
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
              <Label htmlFor="size">
                Shop Size <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="size"
                type="text"
                className="w-full bg-gray-100"
                ref={size}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="meter">
                Meter Number{" "}
                <span className="text-[0.50rem] font-normal">(Optional)</span>
              </Label>
              <Input
                id="meter"
                type="text"
                className="w-full bg-gray-100"
                ref={meter}
              />
            </div>
          </div>

          {isCreating ? (
            <Button
              disabled
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d]"
            >
              Submit
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d]"
              onClick={create}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
export default AddShopPage;
