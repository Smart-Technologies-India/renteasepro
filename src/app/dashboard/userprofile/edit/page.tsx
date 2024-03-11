"use client";
import GetUser from "@/action/user/getuser";
import BackButton from "@/components/backbutton";
import { Fa6RegularPenToSquare } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { handleNumberChange, longtext } from "@/utils/methods";
import { user } from "@prisma/client";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const UserBidsRunning = () => {
  //   file upload section start here
  const items = [
    {
      id: "forwomen",
      label: "For Women",
    },
    {
      id: "category",
      label: "For Reserved Category",
    },
    {
      id: "abled",
      label: "For Differently Abled",
    },
    {
      id: "msme",
      label: "For MSME",
    },
  ] as const;

  const [field, setField] = useState<string[]>([]);

  const [womenfile, setWomenFile] = useState<File | null>(null);
  const cWomenFile = useRef<HTMLInputElement>(null);

  const [aadhar, setAadhar] = useState<File | null>(null);
  const cAadhar = useRef<HTMLInputElement>(null);

  const [pan, setPan] = useState<File | null>(null);
  const cPan = useRef<HTMLInputElement>(null);

  const [bankpassbook, setBankPassbook] = useState<File | null>(null);
  const cBankPassbook = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const cPhoto = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setFun: (value: SetStateAction<File | null>) => void
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 5) {
      if (value!.target.files![0].type.startsWith("image/")) {
        setFun((val) => value!.target.files![0]);
      } else {
        toast.error("Please select a file.", { theme: "light" });
      }
    } else {
      toast.error("File size must be less then 5 mb", { theme: "light" });
    }
  };
  //   file upload section end here

  const userid: number = parseInt(getCookie("id") ?? "0");

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<user>();

  const usernameRef = useRef<HTMLInputElement>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const contactoneRef = useRef<HTMLInputElement>(null);
  const contacttwoRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const aadharRef = useRef<HTMLInputElement>(null);
  const panRef = useRef<HTMLInputElement>(null);
  const banknameRef = useRef<HTMLInputElement>(null);
  const accountnumberRef = useRef<HTMLInputElement>(null);
  const ifscRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userrespone = await GetUser({
        id: userid,
      });
      if (userrespone.status) {
        setUser(userrespone.data!);
      }

      setLoading(false);
    };

    init();
  }, [userid]);

  const update = async () => {};

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6 sm:p-10">
      <div className="flex gap-2 items-center">
        <BackButton />
        <Fa6RegularPenToSquare className="text-xl" />
        <p className="text-xl text-gray-600">Edit Profile</p>
        <div className="grow"></div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md mt-6">
        <p className="text-gray-500 text-center">Edit Profile</p>
        <Separator />
        <div className="flex gap-4">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              className="w-full"
              ref={usernameRef}
              disabled
              value={user?.username}
            />
          </div>
          {/* <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              type="text"
              className="w-full"
              ref={lastNameRef}
            />
          </div> */}
        </div>
        <div className="flex gap-4">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              type="text"
              className="w-full"
              ref={firstNameRef}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              type="text"
              className="w-full"
              ref={lastNameRef}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="contactone">Contact One</Label>
            <Input
              id="contactone"
              type="text"
              className="w-full"
              onChange={handleNumberChange}
              ref={contactoneRef}
              maxLength={10}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="contacttwo">Contact Two</Label>
            <Input
              id="contacttwo"
              type="text"
              className="w-full"
              onChange={handleNumberChange}
              ref={contacttwoRef}
              maxLength={10}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="text" className="w-full" ref={emailRef} />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="city">City</Label>
            <Input id="city" type="text" className="w-full" ref={cityRef} />
          </div>
        </div>

        <div className="grid items-center gap-1.5 w-full mt-4">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            className="w-full h-28 resize-none"
            ref={addressRef}
          ></Textarea>
        </div>

        <div className="flex gap-4">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="aadhar">Aadhar</Label>
            <Input
              id="aadhar"
              type="text"
              className="w-full"
              ref={aadharRef}
              maxLength={12}
              onChange={handleNumberChange}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="pan">Pan</Label>
            <Input id="pan" type="text" className="w-full" ref={panRef} />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="bankname">Bank Name</Label>
            <Input
              id="bankname"
              type="text"
              className="w-full"
              ref={banknameRef}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="accountnumber">Acount Number</Label>
            <Input
              id="accountnumber"
              type="text"
              className="w-full"
              ref={accountnumberRef}
              onChange={handleNumberChange}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="ifsccode">IFSC Code</Label>
            <Input id="ifsccode" type="text" className="w-full" ref={ifscRef} />
          </div>
        </div>
        <div className="h-4"></div>
        <Separator />

        <div className="flex gap-4">
          <div className="flex-1">
            <DocUploader
              title="Aadhar Card"
              file={aadhar}
              setFile={setAadhar}
              cFile={cAadhar}
            />
          </div>
          <div className="flex-1">
            <DocUploader
              title="Pan Card"
              file={pan}
              setFile={setPan}
              cFile={cPan}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <DocUploader
              title="Bank Passbook"
              file={bankpassbook}
              setFile={setBankPassbook}
              cFile={cBankPassbook}
            />
          </div>
          <div className="flex-1">
            <DocUploader
              title="Photo"
              file={photo}
              setFile={setPhoto}
              cFile={cPhoto}
            />
          </div>
        </div>

        <p className="text-gray-500 mt-4">Select Your Category</p>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mt-1 items-center ">
            <Checkbox
              id={`${item.id.toString()}1`}
              checked={field.includes(item.id)}
              onCheckedChange={(value) => {
                if (value) {
                  setField((prev) => [...prev, item.id]);
                } else {
                  setField((prev) => prev.filter((x) => x !== item.id));
                }
              }}
            />

            <Label
              className="text-sm font-normal cursor-pointer"
              htmlFor={`${item.id.toString()}1`}
            >
              {item.label}
            </Label>
          </div>
        ))}

        {field.includes("forwomen") && (
          <div className="flex gap-4 mt-4 items-center">
            <Label htmlFor="termfile">Aadhar Card</Label>
            <Button
              onClick={() => cWomenFile.current?.click()}
              variant={"secondary"}
            >
              {womenfile == null ? "Upload File" : "Change File"}
            </Button>
            {womenfile != null && (
              <Link
                target="_blank"
                href={URL.createObjectURL(womenfile!)}
                className="bg-gray-100 text-black py-1 px-4 rounded-md text-sm h-10 grid place-items-center"
              >
                View File
              </Link>
            )}
            <p className="text-sm">
              {womenfile != null
                ? longtext(womenfile.name, 20)
                : "No File Selected"}
            </p>

            <div className="hidden">
              <Input
                type="file"
                ref={cWomenFile}
                accept="*/*"
                onChange={(val) => handleFileChange(val, setWomenFile)}
              />
            </div>
          </div>
        )}

        <Button className="w-full mt-4" onClick={update}>
          Submit
        </Button>
      </div>
    </div>
  );
};
export default UserBidsRunning;

interface DocUploaderProps {
  title: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  cFile: React.RefObject<HTMLInputElement>;
}

const DocUploader = (props: DocUploaderProps) => {
  const handleFileChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setFun: (value: SetStateAction<File | null>) => void
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 5) {
      if (value!.target.files![0].type.startsWith("image/")) {
        setFun((val) => value!.target.files![0]);
      } else {
        toast.error("Please select a file.", { theme: "light" });
      }
    } else {
      toast.error("File size must be less then 5 mb", { theme: "light" });
    }
  };

  return (
    <div className="flex gap-4 mt-4 items-center">
      <Label htmlFor="termfile">{props.title}</Label>
      <Button
        onClick={() => props.cFile.current?.click()}
        variant={"secondary"}
      >
        {props.file == null ? "Upload File" : "Change File"}
      </Button>
      {props.file != null && (
        <Link
          target="_blank"
          href={URL.createObjectURL(props.file!)}
          className="bg-gray-100 text-black py-1 px-4 rounded-md text-sm h-10 grid place-items-center"
        >
          View File
        </Link>
      )}
      <p className="text-sm">
        {props.file != null
          ? longtext(props.file.name, 20)
          : "No File Selected"}
      </p>

      <div className="hidden">
        <Input
          type="file"
          ref={props.cFile}
          accept="*/*"
          onChange={(val) => handleFileChange(val, props.setFile)}
        />
      </div>
    </div>
  );
};
