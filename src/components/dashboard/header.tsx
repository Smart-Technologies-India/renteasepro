"use client";
import UpdateRentTrasact from "@/action/rent_transact/updaterenttransact";
import {
  IcBaselineRefresh,
  MaterialSymbolsCloseSmall,
  SolarHamburgerMenuOutline,
} from "../icons";
import { toast } from "react-toastify";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Button, Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (arg: (val: boolean) => boolean) => void;
  name: string;
  role: string;
}

const Navbar = (props: NavbarProps) => {
  const router = useRouter();
  const refreshrent = async () => {
    const response = await UpdateRentTrasact({});
    if (response.status) {
      toast.success("Rent Transact Updated");
    } else {
      toast.error(response.message);
    }
  };

  const logoutbtn = async () => {
    deleteCookie("id");
    return router.push("/");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "account",
      label: "My Account",
      type: "group",
    },
    {
      key: "changepassword",
      label: "Change Password",
      onClick: () => router.push("/dashboard/changepassword"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Log out",
      onClick: logoutbtn,
      danger: true,
    },
  ];

  return (
    <nav className="py-2 px-4 w-full bg-white flex items-center gap-2 shadow-sm fixed top-0 left-0 z-10 border-b border-gray-200">
      <div className="md:hidden">
        {props.isOpen ? (
          <Button
            type="text"
            icon={<MaterialSymbolsCloseSmall className="text-2xl" />}
            onClick={() => props.setIsOpen((val) => !val)}
            style={{ padding: '4px 8px' }}
          />
        ) : (
          <Button
            type="text"
            icon={<SolarHamburgerMenuOutline className="text-2xl" />}
            onClick={() => props.setIsOpen((val) => !val)}
            style={{ padding: '4px 8px' }}
          />
        )}
      </div>

      <div className="grow"></div>
      
      {["ADMIN", "MANAGER"].includes(props.role) && (
        <>
          <Button
            type="text"
            icon={<IcBaselineRefresh className="text-xl" />}
            onClick={refreshrent}
            className="md:flex hidden hover:rotate-180 transition-transform duration-300"
            style={{ padding: '4px 8px' }}
          />
          <div className="w-[1px] h-6 bg-gray-300 md:block hidden"></div>
        </>
      )}

      <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
        <Space className="cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-md transition-colors">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-sm leading-tight">{props.name}</p>
            <p className="text-xs text-gray-500 leading-tight">{props.role}</p>
          </div>
          <Avatar
            size={36}
            className="bg-[#172e57] shrink-0 font-semibold uppercase"
          >
            {props.name[0]}
          </Avatar>
        </Space>
      </Dropdown>
    </nav>
  );
};

export default Navbar;
