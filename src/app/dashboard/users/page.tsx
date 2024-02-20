"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiResponseType } from "@/models/response";
import { CreateUserSchema } from "@/schema/createuser";
import { Role, user } from "@prisma/client";
import { useRef, useState } from "react";
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

const CreateUserPage = () => {
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
    <div className=" grid place-items-center">
      <div className="bg-white p-4 rounded-md shadow-md mt-6">
        <h1 className="text-2xl font-semibold mt-6 mb-2 border-b border-gray-300 pb-2 text-center">
          Create User
        </h1>
        <div className="grid max-w-sm items-center gap-1.5 w-80">
          <Label htmlFor="username">Username : </Label>
          <Input id="username" type="text" ref={username} />
        </div>
        <div className="grid max-w-sm items-center gap-1.5 w-80 mt-4">
          <Label htmlFor="password">Password : </Label>
          <Input id="password" type="text" ref={password} />
        </div>
        <div className="grid max-w-sm items-center gap-1.5 w-80 mt-4">
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
      </div>
    </div>
  );
};
export default CreateUserPage;
