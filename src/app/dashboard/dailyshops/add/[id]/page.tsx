"use client";

import GetDailyProperty from "@/action/daily_property/getdailyproperty";
import CreateDailyShop from "@/action/dailyshop/createdailyshop";
import AllShopCategorys from "@/action/shop_category/allshopcategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateUnitSchema } from "@/schema/createunit";
import { daily_property, shop_category } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { decryptURLData } from "@/utils/methods";

const AddShopPage = () => {
  const router = useRouter();
  const param = useParams();

  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);

  const [userid, setUserid] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [shop_category, setShopCategory] = useState<shop_category[]>([]);

  const [property, setProperty] = useState<daily_property | null>(null);

  const name = useRef<HTMLInputElement>(null);
  const capacity = useRef<HTMLInputElement>(null);
  const rate_per_day = useRef<HTMLInputElement>(null);
  const rate_prep_day = useRef<HTMLInputElement>(null);
  const rate_handover_day = useRef<HTMLInputElement>(null);
  const deposit_per_day = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const propsResponse = await GetDailyProperty({ id: id });
      if (propsResponse.status) {
        setProperty(propsResponse.data);
      }

      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }
      setUserid(authResponse.data);
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
    const result = safeParse(CreateUnitSchema, {
      id: id,
      shopCategoryId: 10,
      name: name.current?.value!,
      capacity: parseInt(capacity.current?.value!),
      rate_per_day: rate_per_day.current?.value!,
      rate_prep_day: rate_prep_day.current?.value!,
      rate_handover_day: rate_handover_day.current?.value!,
      deposit_per_day: deposit_per_day.current?.value!,
    });

    if (result.success) {
      const createshop = await CreateDailyShop({
        propertyId: id,
        // shopCategoryId: shopcategory,
        creadtedById: userid,
        name: name.current?.value!,
        capacity: parseInt(capacity.current?.value!),
        rate_per_day: rate_per_day.current?.value!,
        rate_prep_day: rate_prep_day.current?.value!,
        rate_handover_day: rate_handover_day.current?.value!,
        deposit_per_day: deposit_per_day.current?.value!,
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
                value={property?.name}
              />
            </div>
            {/* <div className="grid items-center gap-1.5 w-full mt-4"> */}
            {/* <Label htmlFor="category">
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
              </Select> */}
            {/* </div> */}
          </div>

          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="name">
                Unit Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                className="w-full bg-white"
                ref={name}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="capacity">
                Unit Capacity
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="capacity"
                type="text"
                className="w-full bg-white"
                ref={capacity}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="rate_per_day">
                Rate/Day <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="rate_per_day"
                type="text"
                className="w-full bg-white"
                ref={rate_per_day}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="rate_prep_day">
                Rate/Prep Day
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="rate_prep_day"
                type="text"
                className="w-full bg-white"
                ref={rate_prep_day}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="rate_handover_day">
                Rate Handover Day <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="rate_handover_day"
                type="text"
                className="w-full bg-white"
                ref={rate_handover_day}
              />
            </div>
            <div className="grid items-center gap-1.5 w-full mt-4">
              <Label htmlFor="deposit_per_day">
                Deposit/Day
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="deposit_per_day"
                type="text"
                className="w-full bg-white"
                ref={deposit_per_day}
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
