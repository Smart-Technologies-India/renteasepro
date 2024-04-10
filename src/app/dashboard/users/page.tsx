"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponseType } from "@/models/response";
import { CreateUserSchema } from "@/schema/createuser";
import { Role, user } from "@prisma/client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

import createUser from "@/action/user/createuser";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BackButton from "@/components/backbutton";
import {
  AntDesignPlusCircleOutlined,
  Fa6SolidXmark,
  FluentMdl2Search,
  SolarAltArrowDownLinear,
} from "@/components/icons";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCookie } from "cookies-next";
import GetAllUser from "@/action/user/getallusers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/usepagination";
import Pagination from "@/components/pagination";

const CreateUserPage = () => {
  const initdata = async () => {};

  const router = useRouter();
  const [userBox, setuserBox] = useState(false);
  const windowwidth = useWindowSize();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [users, setUsers] = useState<user[]>([]);

  const [filterUser, setFilterUser] = useState<any[]>([]);

  const category: string[] = ["All", "Department", "Users"];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const [searchUserFilter, setSearchUserFilter] = useState<any[]>([]);
  // search and filter start from here

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchresult, setSearchresult] = useState<any[]>([]);

  const pagination = usePagination(filterUser);

  const paginationsearch = usePagination(searchresult);

  // serach and filter end here

  const filtershopbycategory = (category: string) => {
    if (category === "All") {
      setFilterUser(users);
    } else if (category === "Department") {
      const temp = users.filter((item: any) => {
        return item.role != Role.USER;
      });
      setFilterUser(temp);
    } else if (category === "Users") {
      const temp = users.filter((item: any) => {
        return item.role === Role.USER;
      });
      setFilterUser(temp);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(false);

      const usersresponse = await GetAllUser({});

      if (usersresponse.status) {
        setUsers(usersresponse.data!);
        setFilterUser(usersresponse.data ?? []);
      }

      if (usersresponse.status) {
        setUsers(usersresponse.data!);
      } else {
        toast.error(usersresponse.message);
      }

      setuserBox(false);
    };

    init();
  }, []);

  const searchchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchRef.current) {
      if (searchRef.current.value.length > 0) {
        setIsSearch(true);

        setSearchresult(
          filterUser.filter(
            (users: user) =>
              (users.firstName !== null ? users.firstName : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (users.lastName !== null ? users.lastName : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              (users.contactone !== null ? users.contactone : "")
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                ) ||
              users.role
                .toString()
                .toLowerCase()
                .includes(
                  searchRef.current?.value.toString().toLowerCase() ?? ""
                )
          )
        );
      } else {
        setIsSearch(false);
      }
    }
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    searchRef.current!.value = "";
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <BackButton />
        <h1 className="text-[#162f57] text-2xl font-semibold">Users</h1>
        <div className="grow"></div>
        <button
          className="flex items-center gap-2 bg-green-500 rounded-full text-white text-sm px-4 font-medium py-2"
          onClick={() => setuserBox(true)}
        >
          <AntDesignPlusCircleOutlined className="text-white text-xl" />
          <p>Add</p>
        </button>

        <div className="flex items-center bg-white rounded-md pl-2">
          <FluentMdl2Search />
          <input
            ref={searchRef}
            type="text"
            onChange={searchchange}
            className="bg-transparent outline-none focus:outline-none py-1 px-4"
            placeholder="Enter Search Text.."
          />
          {isSearch && (
            <button
              onClick={clearsearch}
              className=" p-2 text-black bg-white rounded-r"
            >
              <Fa6SolidXmark></Fa6SolidXmark>
            </button>
          )}
        </div>
      </div>
      <div className="bg-white p-2 mt-4 shadow rounded">
        <div className="flex">
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

        {users.length > 0 ? (
          <>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isSearch
                  ? paginationsearch.paginatedItems
                  : pagination.paginatedItems
                ).map((bid_tans: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{bid_tans.id}</TableCell>
                    <TableCell>
                      {bid_tans.firstName} {bid_tans.lastName}
                    </TableCell>
                    <TableCell>{bid_tans.contactone ?? "-"}</TableCell>
                    <TableCell>{bid_tans.role}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="gap-2 flex">
                            <p className="font-medium text-sm">View</p>
                            <SolarAltArrowDownLinear className="textx-2xl" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {/* <DropdownMenuItem
                            onClick={() => {
                              router.push(
                                `/dashboard/userprofile/viewprofile/${bid_tans.id}`
                              );
                            }}
                            className="cursor-pointer"
                          >
                            View user Docs
                          </DropdownMenuItem> */}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <div className=" mt-4 w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
              No Users Found
            </div>
          </>
        )}

        {isSearch
          ? paginationsearch.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={paginationsearch.ChangePerPage}
                  activePage={paginationsearch.activePage}
                  changeActivePage={paginationsearch.changeActivePage}
                  firstPage={paginationsearch.firstPage}
                  getMaxPage={paginationsearch.getMaxPage}
                  getTotalItemsLength={paginationsearch.getTotalItemsLength}
                  goToPage={paginationsearch.goToPage}
                  itemPerPage={paginationsearch.itemPerPage}
                  lastPage={paginationsearch.lastPage}
                  nextPage={paginationsearch.nextPage}
                  paginatedItems={paginationsearch.paginatedItems}
                  prevPage={paginationsearch.prevPage}
                  totalPages={paginationsearch.totalPages}
                ></Pagination>
              </div>
            )
          : pagination.paginatedItems.length > 0 && (
              <div className="p-4">
                <Pagination
                  ChangePerPage={pagination.ChangePerPage}
                  activePage={pagination.activePage}
                  changeActivePage={pagination.changeActivePage}
                  firstPage={pagination.firstPage}
                  getMaxPage={pagination.getMaxPage}
                  getTotalItemsLength={pagination.getTotalItemsLength}
                  goToPage={pagination.goToPage}
                  itemPerPage={pagination.itemPerPage}
                  lastPage={pagination.lastPage}
                  nextPage={pagination.nextPage}
                  paginatedItems={pagination.paginatedItems}
                  prevPage={pagination.prevPage}
                  totalPages={pagination.totalPages}
                ></Pagination>
              </div>
            )}
      </div>

      {windowwidth.width! > 768 ? (
        <Dialog open={userBox} onOpenChange={setuserBox}>
          <DialogTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
            </DialogHeader>
            {/* <ProfileForm /> */}
            <UserBox setUserBox={setuserBox} init={initdata} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={userBox} onOpenChange={setuserBox}>
          <DrawerTrigger asChild>
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Create User</DrawerTitle>
            </DrawerHeader>
            {/* <ProfileForm className="px-4" /> */}
            <div className="p-4">
              <UserBox setUserBox={setuserBox} init={initdata} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
export default CreateUserPage;

interface UserBoxProps {
  setUserBox: (val: boolean) => void;
  init: () => Promise<void>;
}
const UserBox = (props: UserBoxProps) => {
  const name = useRef<HTMLInputElement>(null);

  const userid: number = parseInt(getCookie("id") ?? "0");

  const [role, setRole] = useState<string | null>(null);

  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const repassword = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const result = safeParse(CreateUserSchema, {
      username: username.current?.value,
      password: password.current?.value,
      repassword: repassword.current?.value,
      role: role,
    });

    if (result.success) {
      const registerrespone: ApiResponseType<user | null> = await createUser({
        password: result.output.password,
        username: result.output.username,
        role: role as Role,
      });
      if (registerrespone.status) {
        toast.success(registerrespone.message);
        username.current!.value = "";
        password.current!.value = "";
        repassword.current!.value = "";
      } else {
        toast.error(registerrespone.message);
      }
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

  return (
    <>
      <div className="grid md:max-w-sm items-center w-full gap-1.5">
        <Label htmlFor="username">Username : </Label>
        <Input id="username" type="text" ref={username} />
      </div>
      <div className="grid md:max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="password">Password : </Label>
        <Input id="password" type="text" ref={password} />
      </div>
      <div className="grid md:max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="repassword">Re-Password : </Label>
        <Input id="repassword" type="text" ref={repassword} />
      </div>
      <div className="mt-4">
        <label htmlFor="role">Role</label>
        <Select
          onValueChange={(val) => {
            setRole(val);
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Role</SelectLabel>
              {/* <SelectItem value={"SYSTEM"}>SYSTEM</SelectItem> */}
              {/* <SelectItem value={"ADMIN"}>ADMIN</SelectItem> */}
              {/* <SelectItem value={"DYCOLLECTOR"}>DYCOLLECTOR</SelectItem> */}
              <SelectItem value={"ACCOUNTANT"}>ACCOUNTANT</SelectItem>
              <SelectItem value={"MANAGER"}>MANAGER</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full mt-4 text-center font-semibold text-white bg-black rounded-md block py-2 "
      >
        Create User
      </Button>
    </>
  );
};
