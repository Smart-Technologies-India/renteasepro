import { usePathname, useRouter } from "next/navigation";
import {
  AntDesignShopOutlined,
  Fa6RegularBuilding,
  Fa6RegularFileLines,
  FluentMdl2Home,
  FluentMdl2ViewDashboard,
  MaterialSymbolsCloseSmall,
  MaterialSymbolsLogout,
  MaterialSymbolsPersonRounded,
  RiAuctionLine,
  RiMoneyRupeeCircleLine,
  SolarLogout2Bold,
} from "../icons";
import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import logout from "@/action/user/logout";
import { Button } from "../ui/button";
import { Role } from "@prisma/client";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  role: Role;
}

const Sidebar = (props: SidebarProps) => {
  const path = usePathname();
  const router = useRouter();

  const logoutbtn = async () => {
    const response = await logout({});
    if (response.status) {
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div
      className={`fixed gap-2 top-0 left-0 z-10 shrink-0 w-52 h-screen flex flex-col bg-gradient-to-t from-[#172e57] to-[#162f57] md:translate-x-0 py-6 ${
        props.isOpen ? "translate-x-0" : "-translate-x-52"
      }  transition-transform duration-300 ease-in-out`}
    >
      <p className="text-xl font-semibold text-white text-center">
        RentEasePro
      </p>
      <div className="h-4"></div>

      <MenuTab
        icco={<FluentMdl2ViewDashboard className="text-gray-300 w-6" />}
        name="Dashboard"
        path={path}
        pathcheck={"/dashboard"}
      />

      {/* <MenuTab
        icco={<Fa6RegularBuilding className="text-gray-300  w-6" />}
        name="Organisation"
        path={path}
        pathcheck={"/dashboard/organisation"}
      /> */}

      <MenuTab
        icco={<FluentMdl2Home className="text-gray-300  w-6" />}
        name="Properties"
        path={path}
        pathcheck={"/dashboard/properties"}
      />

      <MenuTab
        icco={<Fa6RegularFileLines className="text-gray-300  w-6" />}
        name="Reports"
        path={path}
        pathcheck={"/dashboard/reports"}
      />

      <MenuTab
        icco={<RiAuctionLine className="text-gray-300  w-6" />}
        name="Bids"
        path={path}
        pathcheck={"/dashboard/bids"}
      />
      <MenuTab
        icco={<RiMoneyRupeeCircleLine className="text-gray-300  w-6" />}
        name="Rents"
        path={path}
        pathcheck={"/dashboard/rents"}
      />

      {["ADMIN"].includes(props.role) && (
        <MenuTab
          icco={<MaterialSymbolsPersonRounded className="text-gray-300  w-6" />}
          name="Users"
          path={path}
          pathcheck={"/dashboard/users"}
        />
      )}

      {/* <MenuTab
        icco={<AntDesignShopOutlined className="text-gray-300  w-6" />}
        name="Shops"
        path={path}
        pathcheck={"/dashboard/shops"}
      /> */}

      <div className="grow"></div>
      <button
        className="text-white md:hidden text-left px-4 flex items-center gap-2"
        onClick={() => props.setIsOpen(false)}
      >
        <MaterialSymbolsCloseSmall className="text-2xl" />
        <p>Close</p>
      </button>

      <Button
        onClick={logoutbtn}
        className={`flex justify-start gap-4 rounded-none px-4 py-2 hover:bg-rose-500 hover:border-l-2 hover:border-rose-500 bg-transparent hover:bg-opacity-20 `}
      >
        <SolarLogout2Bold className="text-gray-300  w-6" />
        <p className="text-gray-300 text-sm">Logout</p>
      </Button>
    </div>
  );
};

export default Sidebar;

interface MenuTabProps {
  name: string;
  path: string;
  pathcheck: string;
  icco: React.ReactNode;
}
const MenuTab = (props: MenuTabProps) => {
  return (
    <Link
      href={props.pathcheck}
      className={`flex gap-2 px-4 items-center py-2 ${
        props.path == props.pathcheck
          ? "border-l-2 border-green-500 bg-white bg-opacity-10"
          : ""
      }`}
    >
      {props.icco}
      <p
        className={` text-sm ${
          props.path == props.pathcheck
            ? "font-semibold text-white"
            : " font-normal text-gray-300"
        }`}
      >
        {props.name}
      </p>
    </Link>
  );
};
