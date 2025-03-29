"use client";
import getUploadFileUser from "@/action/user/getuploadedfile";
import GetUser from "@/action/user/getuser";
import IsProfileCompleted from "@/action/user/isprofilecompleted";
import updateUser from "@/action/user/updateuser";
import UploadFileUser from "@/action/user/uploadfile";
import BackButton from "@/components/backbutton";
import {
  Fa6RegularPenToSquare,
  MaterialSymbolsLightErrorOutlineRounded,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UpdateUserSchema } from "@/schema/updateuser";
import { handleNumberChange, longtext } from "@/utils/methods";
import { UserDocType, user } from "@prisma/client";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { safeParse } from "valibot";

interface AdditionalFile {
  id: number;
  file: File | null;
  name: string;
}

async function uploadfile(
  file: File,
  uploadurl: string,
  userid: number,
  doc_type: UserDocType,
  filename?: string
) {
  const formData = new FormData();
  formData.append("file", file!);


  const uploadfile = await axios.post(uploadurl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (uploadfile.status != 200) {
    return toast.error("File upload failed");
  }

  const uploadfileResponse = await UploadFileUser({
    userId: userid,
    doc_type: doc_type,
    name: filename ? filename : file.name,
    path: uploadfile.data.filePath,
    createdById: userid,
  });

  if (!uploadfileResponse.status) {
    return toast.error("File upload failed");
  }
}

const UserBidsRunning = () => {
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);

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
    {
      id: "stsc",
      label: "For SC/ST",
    },
    {
      id: "tribal",
      label: "For Tribal",
    },
  ] as const;

  const [field, setField] = useState<string[]>([]);

  const [womenfile, setWomenFile] = useState<File | null>(null);
  const cWomenFile = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<File | null>(null);
  const cCategory = useRef<HTMLInputElement>(null);

  const [abled, setAbled] = useState<File | null>(null);
  const cAbled = useRef<HTMLInputElement>(null);

  const [msme, setMsme] = useState<File | null>(null);
  const cMsme = useRef<HTMLInputElement>(null);

  const [stsc, setStsc] = useState<File | null>(null);
  const cStsc = useRef<HTMLInputElement>(null);

  const [tribal, setTribal] = useState<File | null>(null);
  const cTribal = useRef<HTMLInputElement>(null);

  const [aadhar, setAadhar] = useState<File | null>(null);
  const cAadhar = useRef<HTMLInputElement>(null);

  const [pan, setPan] = useState<File | null>(null);
  const cPan = useRef<HTMLInputElement>(null);

  const [bankpassbook, setBankPassbook] = useState<File | null>(null);
  const cBankPassbook = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const cPhoto = useRef<HTMLInputElement>(null);

  const [additionalFile, setAdditionalFile] = useState<AdditionalFile[]>([]);

  interface FileGetResponse {
    status: boolean;
    path: string;
  }

  const [getAadhar, setGetAadhar] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getPan, setGetPan] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getBankPassbook, setGetBankPassbook] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getPhoto, setGetPhoto] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getWomenFile, setGetWomenFile] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getCategory, setGetCategory] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getAbled, setGetAbled] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getMsme, setGetMsme] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getStsc, setGetStsc] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

  const [getTribal, setGetTribal] = useState<FileGetResponse>({
    status: false,
    path: "",
  });

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
      const aadharresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.AADHAR,
      });

      if (aadharresponse.status) {
        setGetAadhar({
          status: true,
          path: aadharresponse.data?.path!,
        });
      }

      const panresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.PAN,
      });

      if (panresponse.status) {
        setGetPan({
          status: true,
          path: panresponse.data?.path!,
        });
      }

      const bankpassbookresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.BANK,
      });

      if (bankpassbookresponse.status) {
        setGetBankPassbook({
          status: true,
          path: bankpassbookresponse.data?.path!,
        });
      }

      const photoresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.PHOTO,
      });

      if (photoresponse.status) {
        setGetPhoto({
          status: true,
          path: photoresponse.data?.path!,
        });
      }

      const womenfileresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.WOMEN,
      });

      if (womenfileresponse.status) {
        setGetWomenFile({
          status: true,
          path: womenfileresponse.data?.path!,
        });
      }

      const categoryresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.RESERVED,
      });

      if (categoryresponse.status) {
        setGetCategory({
          status: true,
          path: categoryresponse.data?.path!,
        });
      }

      const abledresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.DIFFERENTLY_ABLED,
      });

      if (abledresponse.status) {
        setGetAbled({
          status: true,
          path: abledresponse.data?.path!,
        });
      }

      const msmeresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.MSME,
      });

      if (msmeresponse.status) {
        setGetMsme({
          status: true,
          path: msmeresponse.data?.path!,
        });
      }

      const stscresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.SC_ST,
      });

      if (stscresponse.status) {
        setGetStsc({
          status: true,
          path: stscresponse.data?.path!,
        });
      }

      const tribalresponse = await getUploadFileUser({
        userId: userid,
        doc_type: UserDocType.TRIBAL,
      });

      if (tribalresponse.status) {
        setGetTribal({
          status: true,
          path: tribalresponse.data?.path!,
        });
      }

      setTimeout(() => {
        emailRef.current!.value = userrespone.data?.email! ?? "";
        usernameRef.current!.value = userrespone.data?.username! ?? "";
        firstNameRef.current!.value = userrespone.data?.firstName! ?? "";
        lastNameRef.current!.value = userrespone.data?.lastName! ?? "";
        contactoneRef.current!.value = userrespone.data?.contactone! ?? "";
        contacttwoRef.current!.value = userrespone.data?.contacttwo! ?? "";
        addressRef.current!.value = userrespone.data?.address! ?? "";
        cityRef.current!.value = userrespone.data?.city! ?? "";
        aadharRef.current!.value = userrespone.data?.aadhar! ?? "";
        panRef.current!.value = userrespone.data?.pan! ?? "";
        banknameRef.current!.value = userrespone.data?.bankName! ?? "";
        accountnumberRef.current!.value =
          userrespone.data?.bankAccountNumber! ?? "";
        ifscRef.current!.value = userrespone.data?.ifscCode! ?? "";
      }, 1000);

      const isprofilecompleted = await IsProfileCompleted({
        id: userid,
      });

      if (isprofilecompleted.status) {
        setIsProfileCompleted(isprofilecompleted.status);
      }

      setLoading(false);
    };

    init();
  }, [userid]);

  const update = async () => {
    const result = safeParse(UpdateUserSchema, {
      firstName: firstNameRef.current?.value,
      lastName: lastNameRef.current?.value,
      contactone: contactoneRef.current?.value,
      email: emailRef.current?.value,
      aadhar: aadharRef.current?.value,
      pan: panRef.current?.value,
      address: addressRef.current?.value,
      city: cityRef.current?.value,
      bankName: banknameRef.current?.value,
      bankAccountNumber: accountnumberRef.current?.value,
      ifscCode: ifscRef.current?.value,
    });

    if (result.success) {
      if (getAadhar.status == false) {
        if (aadhar == null) {
          return toast.error("Please upload aadhar card", { theme: "light" });
        }
      }

      if (getPan.status == false) {
        if (pan == null) {
          return toast.error("Please upload pan card", { theme: "light" });
        }
      }

      if (getBankPassbook.status == false) {
        if (bankpassbook == null) {
          return toast.error("Please upload bank passbook", { theme: "light" });
        }
      }

      if (getPhoto.status == false) {
        if (photo == null) {
          return toast.error("Please upload photo", { theme: "light" });
        }
      }

      if (field.includes("forwomen") && womenfile == null) {
        return toast.error("Please upload Women Certificate", {
          theme: "light",
        });
      }

      if (field.includes("category") && category == null) {
        return toast.error("Please upload Category Certificate", {
          theme: "light",
        });
      }

      if (field.includes("abled") && abled == null) {
        return toast.error("Please upload Differently Abled Certificate", {
          theme: "light",
        });
      }

      if (field.includes("msme") && msme == null) {
        return toast.error("Please upload MSME Certificate", {
          theme: "light",
        });
      }

      if (field.includes("stsc") && stsc == null) {
        return toast.error("Please upload SC/ST Certificate", {
          theme: "light",
        });
      }

      if (field.includes("tribal") && tribal == null) {
        return toast.error("Please upload Tribal Certificate", {
          theme: "light",
        });
      }

      const updateuserresponse = await updateUser({
        id: userid,
        username: user?.username!,
        firstName: result.output.firstName,
        lastName: result.output.lastName,
        contactone: result.output.contactone,
        contacttwo: contacttwoRef.current?.value,
        email: result.output.email,
        city: result.output.city,
        address: result.output.address,
        aadhar: result.output.aadhar,
        pan: result.output.pan,
        bankName: result.output.bankName,
        bankAccountNumber: result.output.bankAccountNumber,
        ifscCode: result.output.ifscCode,
      });

      if (updateuserresponse.status) {
        if (getAadhar.status == false) {
          await uploadfile(
            aadhar!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.AADHAR
          );
        }

        if (getPan.status == false) {
          await uploadfile(
            pan!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.PAN
          );
        }

        if (getBankPassbook.status == false) {
          await uploadfile(
            bankpassbook!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.BANK
          );
        }

        if (getPhoto.status == false) {
          await uploadfile(
            photo!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.PHOTO
          );
        }

        if (field.includes("forwomen") && womenfile != null) {
          await uploadfile(
            womenfile!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.WOMEN
          );
        }

        if (field.includes("category") && category != null) {
          await uploadfile(
            category!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.RESERVED
          );
        }

        if (field.includes("abled") && abled != null) {
          await uploadfile(
            abled!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.DIFFERENTLY_ABLED
          );
        }

        if (field.includes("msme") && msme != null) {
          await uploadfile(
            msme!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.MSME
          );
        }

        if (field.includes("stsc") && stsc != null) {
          await uploadfile(
            stsc!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.SC_ST
          );
        }

        if (field.includes("tribal") && tribal != null) {
          await uploadfile(
            tribal!,
            process.env.UPLOAD_LINK ?? "",
            userid,
            UserDocType.TRIBAL
          );
        }

        for (let i = 0; i < additionalFile.length; i++) {
          if (additionalFile[i].file != null) {
            await uploadfile(
              additionalFile[i].file!,
              process.env.UPLOAD_LINK ?? "",
              userid,
              UserDocType.OTHER,
              additionalFile[i].name
            );
          }
        }

        toast.success(updateuserresponse.message);
        router.back();
      } else {
        toast.error(updateuserresponse.message);
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

  const checkIsUploaded = (value: string): boolean => {
    switch (value) {
      case "forwomen":
        return getWomenFile.status;
      case "category":
        return getCategory.status;
      case "abled":
        return getAbled.status;
      case "msme":
        return getMsme.status;
      case "stsc":
        return getStsc.status;
      case "tribal":
        return getTribal.status;
      default:
        return false;
    }
  };

  const refs = useRef([]);

  const adddocumet = () => {
    setAdditionalFile([
      ...additionalFile!,
      {
        id: additionalFile!.length + 1,
        file: null,
        name: "",
      },
    ]);
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
        <Fa6RegularPenToSquare className="text-xl" />
        <p className="text-xl text-gray-600">Edit Profile</p>
        <div className="grow"></div>
      </div>

      {!isProfileCompleted && (
        <div className="bg-rose-500 px-4 py-2 rounded bg-opacity-20 mt-4 flex items-center gap-2">
          <div>
            <MaterialSymbolsLightErrorOutlineRounded className="text-3xl text-rose-500" />
          </div>
          <p className="text-rose-500 text-center text-lg">
            Your Profile seems to be incomplete. Kindly complete your profile in
            order to proceed.
          </p>
        </div>
      )}

      <div className="bg-white p-4 rounded-md shadow-md mt-4">
        <p className="text-gray-500 text-center">Edit Profile</p>
        <Separator />
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 ">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="username">
              Username <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              className="w-full"
              ref={usernameRef}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 ">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="firstname">
              First Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="firstname"
              type="text"
              className="w-full"
              ref={firstNameRef}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="lastname">
              Last Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="lastname"
              type="text"
              className="w-full"
              ref={lastNameRef}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 ">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="contactone">
              Mobile Number <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="contactone"
              type="text"
              className="w-full"
              onChange={handleNumberChange}
              disabled
              ref={contactoneRef}
              maxLength={10}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="contacttwo">
              Alternate Contact Number
              <span className="text-[0.50rem] font-normal">(Optional)</span>
            </Label>
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
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 ">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="email">
              Email <span className="text-rose-500">*</span>
            </Label>
            <Input id="email" type="text" className="w-full" ref={emailRef} />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="city">
              City <span className="text-rose-500">*</span>
            </Label>
            <Input id="city" type="text" className="w-full" ref={cityRef} />
          </div>
        </div>
        <div className="grid items-center gap-1.5 w-full mt-4">
          <Label htmlFor="address">
            Address <span className="text-rose-500">*</span>
          </Label>
          <Textarea
            id="address"
            className="w-full h-28 resize-none"
            ref={addressRef}
          ></Textarea>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 ">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="aadhar">
              Aadhar <span className="text-rose-500">*</span>
            </Label>
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
            <Label htmlFor="pan">
              Pan <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="pan"
              type="text"
              className="w-full"
              maxLength={10}
              ref={panRef}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 ">
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="bankname">
              Bank Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="bankname"
              type="text"
              className="w-full"
              ref={banknameRef}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="accountnumber">
              Account Number <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="accountnumber"
              type="text"
              className="w-full"
              ref={accountnumberRef}
              onChange={handleNumberChange}
            />
          </div>
          <div className="grid items-center gap-1.5 w-full mt-4">
            <Label htmlFor="ifsccode">
              IFSC Code <span className="text-rose-500">*</span>
            </Label>
            <Input id="ifsccode" type="text" className="w-full" ref={ifscRef} />
          </div>
        </div>
        <div className="h-4"></div>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {getAadhar.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>
                  Aadhar Card <span className="text-rose-500">*</span>
                </p>
                <Link
                  target="_blank"
                  href={getAadhar.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <DocUploader
              title="Aadhar Card"
              file={aadhar}
              setFile={setAadhar}
              cFile={cAadhar}
            />
          )}

          {getPan.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>
                  Pan Card <span className="text-rose-500">*</span>
                </p>
                <Link
                  target="_blank"
                  href={getPan.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <DocUploader
              title="Pan Card"
              file={pan}
              setFile={setPan}
              cFile={cPan}
            />
          )}

          {getBankPassbook.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>
                  Bank Passbook <span className="text-rose-500">*</span>
                </p>
                <Link
                  target="_blank"
                  href={getBankPassbook.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <DocUploader
              title="Bank Passbook"
              file={bankpassbook}
              setFile={setBankPassbook}
              cFile={cBankPassbook}
            />
          )}

          {getPhoto.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>
                  Photo <span className="text-rose-500">*</span>
                </p>
                <Link
                  target="_blank"
                  href={getPhoto.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <DocUploader
              title="Photo"
              file={photo}
              setFile={setPhoto}
              cFile={cPhoto}
            />
          )}

          {getWomenFile.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Women</p>
                <Link
                  target="_blank"
                  href={getWomenFile.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}

          {getCategory.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Reserved Category</p>
                <Link
                  target="_blank"
                  href={getCategory.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}

          {getAbled.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Differently Abled</p>
                <Link
                  target="_blank"
                  href={getAbled.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}

          {getMsme.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For MSME</p>
                <Link
                  target="_blank"
                  href={getMsme.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}

          {getStsc.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For SC/ST</p>
                <Link
                  target="_blank"
                  href={getStsc.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}

          {getTribal.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Tribal</p>
                <Link
                  target="_blank"
                  href={getTribal.path}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </Link>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <p className="text-gray-500 mt-4">
          Select Your Category
          <span className="text-[0.50rem] font-normal">(Optional)</span>
        </p>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mt-1 items-center ">
            <Checkbox
              id={`${item.id.toString()}1`}
              checked={field.includes(item.id) || checkIsUploaded(item.id)}
              disabled={checkIsUploaded(item.id)}
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
          <DocUploader
            title="Aadhar Card/Pan Card/Passport"
            file={womenfile}
            setFile={setWomenFile}
            cFile={cWomenFile}
          />
        )}
        {field.includes("category") && (
          <DocUploader
            title="Caste Certificate"
            file={category}
            setFile={setCategory}
            cFile={cCategory}
          />
        )}
        {field.includes("abled") && (
          <DocUploader
            title="Disability Certificate"
            file={abled}
            setFile={setAbled}
            cFile={cAbled}
          />
        )}
        {field.includes("msme") && (
          <DocUploader
            title="MSME Certificate"
            file={msme}
            setFile={setMsme}
            cFile={cMsme}
          />
        )}
        {field.includes("stsc") && (
          <DocUploader
            title="SC/ST Certificate"
            file={stsc}
            setFile={setStsc}
            cFile={cStsc}
          />
        )}
        {field.includes("tribal") && (
          <DocUploader
            title="Scheduled Tribe Certificate"
            file={tribal}
            setFile={setTribal}
            cFile={cTribal}
          />
        )}

        {/* id: number;
  file: File | null;
  cFile: RefObject<HTMLInputElement>;
  name: string; */}

        {additionalFile?.map((addDoc: AdditionalFile, index: number) => {
          return (
            <OtherDocUploader
              key={index}
              index={index}
              setData={setAdditionalFile}
              getData={additionalFile}
            />
          );
        })}
        {/* <OtherDocUploader
          index={1}
          file={tribal}
          setFile={setTribal}
          cFile={cTribal}
        /> */}

        <div className="flex gap-2">
          <Button
            className="flex-1 w-full mt-4 bg-[#172e57] hover:bg-[#21427d]"
            onClick={adddocumet}
          >
            Add Additional Document
          </Button>
          {isCreating ? (
            <Button
              disabled
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d] flex-1"
            >
              Submit
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-[#172e57] hover:bg-[#21427d] flex-1"
              onClick={update}
            >
              Submit
            </Button>
          )}
        </div>
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileSize = selectedFile.size / (1024 * 1024);

      if (fileSize < 5) {
        if (
          selectedFile.type.startsWith("image/") ||
          selectedFile.type.startsWith("application/pdf")
        ) {
          props.setFile(selectedFile);
        } else {
          toast.error("Please select an image or pdf file.", {
            theme: "light",
          });
        }
      } else {
        toast.error("File size must be less than 5 MB.", { theme: "light" });
      }
    }
  };

  return (
    <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
      <Label htmlFor="termfile">{props.title}</Label>
      <div className="grow"></div>
      <p className="text-sm">
        {props.file != null ? longtext(props.file.name, 6) : "No File Selected"}
      </p>
      <Button
        onClick={() => props.cFile.current?.click()}
        variant={"secondary"}
        className="bg-gray-200 hover:bg-gray-300 h-8"
      >
        {props.file == null ? "Upload File" : "Change File"}
      </Button>
      {props.file != null && (
        <Link
          target="_blank"
          href={URL.createObjectURL(props.file!)}
          className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
        >
          View File
        </Link>
      )}

      <div className="hidden">
        <Input
          type="file"
          ref={props.cFile}
          accept="*/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

interface OtherDocUploaderProps {
  index: number;
  setData: React.Dispatch<React.SetStateAction<AdditionalFile[]>>;
  getData: AdditionalFile[];
}

const OtherDocUploader = (props: OtherDocUploaderProps) => {
  const cFile = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const fileSize = selectedFile.size / (1024 * 1024);

      if (fileSize < 5) {
        if (
          selectedFile.type.startsWith("image/") ||
          selectedFile.type.startsWith("application/pdf")
        ) {
          const updatedData = [...props.getData];
          updatedData[props.index] = {
            id: props.index,
            file: selectedFile,
            name: updatedData[props.index]?.name || "",
          };
          props.setData(updatedData);
        } else {
          toast.error("Please select an image or pdf file.", {
            theme: "light",
          });
        }
      } else {
        toast.error("File size must be less than 5 MB.", { theme: "light" });
      }
    }
  };

  return (
    <div className="flex gap-4 mt-2 items-center bg-gray-100 px-2 py-2 rounded-sm">
      <Input
        type="text"
        className="w-80 bg-white outline-none"
        placeholder="name of the document"
        disabled={props.getData[props.index].file != null}
        value={props.getData[props.index]?.name || ""}
        onChange={(e) => {
          const updatedData = [...props.getData];
          updatedData[props.index] = {
            ...updatedData[props.index],
            name: e.target.value,
          };
          props.setData(updatedData);
        }}
      />
      <div className="grow"></div>
      <p className="text-sm">
        {props.getData[props.index].file != null
          ? longtext(props.getData[props.index].file?.name!, 6)
          : "No File Selected"}
      </p>
      <Button
        onClick={() => {
          if (
            props.getData[props.index].name == "" ||
            props.getData[props.index].name == null ||
            props.getData[props.index].name == undefined
          ) {
            return toast.error("Please enter the name of the document", {
              theme: "light",
            });
          }
          cFile.current?.click();
        }}
        variant={"secondary"}
        className="bg-gray-200 hover:bg-gray-300 h-8"
      >
        {props.getData[props.index].file == null
          ? "Upload File"
          : "Change File"}
      </Button>
      {props.getData[props.index].file != null && (
        <Link
          target="_blank"
          href={URL.createObjectURL(props.getData[props.index].file!)}
          className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
        >
          View File
        </Link>
      )}

      {props.getData[props.index].file != null && (
        <Button
          onClick={() => {
            // remove only this component
            let updatedData = [...props.getData];
            updatedData.splice(props.index, 1);

            props.setData(updatedData);
          }}
          className="bg-red-400 hover:bg-red-600 h-8"
        >
          Remove
        </Button>
      )}

      <div className="hidden">
        <Input
          type="file"
          ref={cFile}
          accept="*/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
