"use client";

import {
  AntDesignDeleteOutlined,
  AntDesignEditOutlined,
  AntDesignEyeOutlined,
  AntDesignPlusCircleOutlined,
} from "@/components/icons";
import { useEffect, useRef, useState } from "react";

import { useWindowSize } from "@uidotdev/usehooks";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import CreateShopCategory from "@/action/shop_category/createshopcategory";
import { getCookie } from "cookies-next";
import { Status, shop_category, user_category } from "@prisma/client";
import AllShopCategorys from "@/action/shop_category/allshopcategory";
import AllUserCategorys from "@/action/user_category/allusercategory";
import CreateUserCategory from "@/action/user_category/createusercategory";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CahangeShopCategory from "@/action/shop_category/shopcateogrystatus";

const Category = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shops, setShops] = useState<shop_category[]>([]);
  const [users, setUsers] = useState<user_category[]>([]);
  const [shopBox, setShopBox] = useState(false);
  const [userBox, setUserBox] = useState(false);

  const windowwidth = useWindowSize();

  const initdata = async () => {
    setIsLoading(true);
    const shopcategoryresponse = await AllShopCategorys({});
    if (shopcategoryresponse.status) {
      setShops(shopcategoryresponse.data ?? []);
    }

    const usercategoryresponse = await AllUserCategorys({});
    if (usercategoryresponse.status) {
      setUsers(usercategoryresponse.data ?? []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const shopcategoryresponse = await AllShopCategorys({});
      if (shopcategoryresponse.status) {
        setShops(shopcategoryresponse.data ?? []);
      }

      const usercategoryresponse = await AllUserCategorys({});
      if (usercategoryresponse.status) {
        setUsers(usercategoryresponse.data ?? []);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const changeStatus = async (id: number, status: Status) => {
    const statusresponse = await CahangeShopCategory({
      id: id,
      status: status,
      userId: parseInt(getCookie("id") ?? "0"),
    });

    if (statusresponse.status) {
      // toast.success(statusresponse.message);
      const shopcategoryresponse = await AllShopCategorys({});
      if (shopcategoryresponse.status) {
        setShops(shopcategoryresponse.data ?? []);
      }
    } else {
      toast.error(statusresponse.message);
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
      <div className="p-6">
        <h1 className="text-[#162f57] text-2xl font-semibold">Edit Category</h1>

        <div className="flex mt-2">
          <h1 className="text-xl font-medium">Shop Types</h1>
          <div className="grow"></div>
          <button
            className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
            onClick={() => setShopBox(true)}
          >
            <AntDesignPlusCircleOutlined className="text-white text-xl" />
            <p>Add</p>
          </button>
        </div>

        {shops.length == 0 && (
          <>
            <p className="text-sm mb-2">No Shop Category Found</p>
          </>
        )}

        <div className="flex gap-4 mt-4 items-center flex-wrap">
          {shops.map((shop, index) => (
            <div
              className="bg-white px-4 py-2 rounded-full flex items-center gap-2"
              key={index}
            >
              <h1 className="mr-4">{shop.name}</h1>
              <Switch
                className="data-[state=checked]:bg-blue-500"
                checked={shop.status == "ACTIVE" ? true : false}
                onCheckedChange={async (val) => {
                  await changeStatus(shop.id, val ? "ACTIVE" : "INACTIVE");
                }}
              />

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-0 bg-transparent m-0 h-auto hover:bg-transparent">
                      <AntDesignEditOutlined className="text-black text-lg" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-0 m-0">
                    <p className="bg-black text-white py-1 px-4 text-sm rounded-md">
                      Edit
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-0 bg-transparent m-0 h-auto hover:bg-transparent">
                      <AntDesignEyeOutlined className="text-black text-lg" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-0 m-0">
                    <p className="bg-black text-white py-1 px-4 text-sm rounded-md">
                      View
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-0 bg-transparent m-0 h-auto hover:bg-transparent">
                      <AntDesignDeleteOutlined className="text-black text-lg" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-0 m-0">
                    <p className="bg-black text-white py-1 px-4 text-sm rounded-md">
                      Delete
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
          ))}
        </div>
        <Separator className="my-10" />
        <div>
          <div className="flex mt-2">
            <h1 className="text-xl font-medium">User Types</h1>
            <div className="grow"></div>
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm flex items-center gap-2  font-medium py-2"
              onClick={() => setUserBox(true)}
            >
              <AntDesignPlusCircleOutlined className="text-white text-xl" />
              <p>Add</p>
            </button>
          </div>

          {users.length == 0 && (
            <>
              <p className="text-sm mb-2">No User Category Found</p>
            </>
          )}

          <div className="flex gap-4 mt-4 items-center flex-wrap">
            {users.map((shop, index) => (
              <div
                className="bg-white px-4 py-2 rounded-full flex items-center gap-2"
                key={index}
              >
                <h1>{shop.name}</h1>
                {/* 
                <h1 className="mr-4">{shop.name}</h1>

             <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="p-0 bg-transparent m-0 h-auto hover:bg-transparent">
                        <AntDesignEditOutlined className="text-black text-lg" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="p-0 m-0">
                      <p className="bg-black text-white py-1 px-4 text-sm rounded-md">
                        Edit
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="p-0 bg-transparent m-0 h-auto hover:bg-transparent">
                        <AntDesignEyeOutlined className="text-black text-lg" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="p-0 m-0">
                      <p className="bg-black text-white py-1 px-4 text-sm rounded-md">
                        View
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="p-0 bg-transparent m-0 h-auto hover:bg-transparent">
                        <AntDesignDeleteOutlined className="text-black text-lg" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="p-0 m-0">
                      <p className="bg-black text-white py-1 px-4 text-sm rounded-md">
                        Delete
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {windowwidth.width! > 768 ? (
        <Dialog open={shopBox} onOpenChange={setShopBox}>
          <DialogTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Shop Category</DialogTitle>
              <DialogDescription>
                Write shop category name in order to create shop category.
              </DialogDescription>
            </DialogHeader>
            {/* <ProfileForm /> */}
            <ShopCategory setShopBox={setShopBox} init={initdata} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={shopBox} onOpenChange={setShopBox}>
          <DrawerTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Create Shop Category</DrawerTitle>
              <DrawerDescription>
                Write shop category name in order to create shop category.
              </DrawerDescription>
            </DrawerHeader>
            {/* <ProfileForm className="px-4" /> */}
            <div className="p-4">
              <ShopCategory setShopBox={setShopBox} init={initdata} />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {windowwidth.width! > 768 ? (
        <Dialog open={userBox} onOpenChange={setUserBox}>
          <DialogTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create User Category</DialogTitle>
              <DialogDescription>
                Write user category name in order to create user category.
              </DialogDescription>
            </DialogHeader>
            {/* <ProfileForm /> */}
            <UserCategory setUserBox={setUserBox} init={initdata} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={userBox} onOpenChange={setUserBox}>
          <DrawerTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Create Shop Category</DrawerTitle>
              <DrawerDescription>
                Write shop category name in order to create shop category.
              </DrawerDescription>
            </DrawerHeader>
            {/* <ProfileForm className="px-4" /> */}
            <div className="p-4">
              <UserCategory setUserBox={setUserBox} init={initdata} />
            </div>

            {/*  <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
export default Category;

interface ShopCategoryProps {
  setShopBox: (val: boolean) => void;
  init: () => Promise<void>;
}
const ShopCategory = (props: ShopCategoryProps) => {
  const name = useRef<HTMLInputElement>(null);

  const userid: number = parseInt(getCookie("id") ?? "0");

  const createshop = async () => {
    if (
      name.current?.value == "" ||
      name.current?.value == undefined ||
      name.current?.value == null
    ) {
      toast.error("Shop Category Name is required");
    } else {
      const shopcategory = await CreateShopCategory({
        name: name.current?.value ?? "",
        createdById: userid,
      });
      if (shopcategory.status) {
        toast.success(shopcategory.message);
      } else {
        toast.error(shopcategory.message);
      }
      await props.init();
      props.setShopBox(false);
    }
  };
  return (
    <>
      <div className="grid items-center gap-1.5 w-full">
        <Input
          type="text"
          ref={name}
          placeholder="Shop Category Name"
          className="w-full"
        />
      </div>
      <Button
        onClick={createshop}
        className="text-center font-semibold text-white rounded-md block py-2 w-full mt-2   bg-[#172e57] hover:bg-[#21427d]"
      >
        Create
      </Button>
    </>
  );
};

interface UserCategoryProps {
  setUserBox: (val: boolean) => void;
  init: () => Promise<void>;
}
const UserCategory = (props: UserCategoryProps) => {
  const name = useRef<HTMLInputElement>(null);

  const userid: number = parseInt(getCookie("id") ?? "0");

  const createshop = async () => {
    if (
      name.current?.value == "" ||
      name.current?.value == undefined ||
      name.current?.value == null
    ) {
      toast.error("Shop Category Name is required");
    } else {
      const shopcategory = await CreateUserCategory({
        name: name.current?.value ?? "",
        createdById: userid,
      });
      if (shopcategory.status) {
        toast.success(shopcategory.message);
      } else {
        toast.error(shopcategory.message);
      }
      await props.init();
      props.setUserBox(false);
    }
  };
  return (
    <>
      <div className="grid items-center gap-1.5 w-full">
        <Input
          type="text"
          ref={name}
          placeholder="Shop Category Name"
          className="w-full"
        />
      </div>
      <Button
        onClick={createshop}
        className="text-center font-semibold text-white rounded-md block py-2 w-full mt-2   bg-[#172e57] hover:bg-[#21427d]"
      >
        Create
      </Button>
    </>
  );
};
