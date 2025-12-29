"use client";
import getOtherUploadFilesUser from "@/action/user/getotheruploadedfiles";
import getUploadFileUser from "@/action/user/getuploadedfile";
import GetUser from "@/action/user/getuser";
import { IcBaselineAccountCircle } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { UserDocType, user } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import { toast } from "react-toastify";

const UserBidsRunning = () => {
  const [userid, setUserid] = useState<number>(0);

  const [pdffile, setPdffile] = useState<string | null>(null);

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<user>();

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

  interface AdditionalFile {
    name: string;
    path: string;
  }

  const [additionalFile, setAdditionalFile] = useState<AdditionalFile[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // Get authenticated user ID from server
      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        router.push("/login");
        return;
      }
      
      const authenticatedUserId = authResponse.data;
      setUserid(authenticatedUserId);
      
      const userrespone = await GetUser({
        id: authenticatedUserId,
      });
      if (userrespone.status) {
        setUser(userrespone.data!);
      }

      const aadharresponse = await getUploadFileUser({
        userId: userrespone.data?.id!,
        doc_type: UserDocType.AADHAR,
      });

      if (aadharresponse.status) {
        setGetAadhar({
          status: true,
          path: aadharresponse.data?.path!,
        });
      }

      const panresponse = await getUploadFileUser({
        userId: userrespone.data?.id!,
        doc_type: UserDocType.PAN,
      });

      if (panresponse.status) {
        setGetPan({
          status: true,
          path: panresponse.data?.path!,
        });
      }

      const bankpassbookresponse = await getUploadFileUser({
        userId: userrespone.data?.id!,
        doc_type: UserDocType.BANK,
      });

      if (bankpassbookresponse.status) {
        setGetBankPassbook({
          status: true,
          path: bankpassbookresponse.data?.path!,
        });
      }

      const photoresponse = await getUploadFileUser({
        userId: userrespone.data?.id!,
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
      const additionalfileresponse = await getOtherUploadFilesUser({
        userId: userid,
      });

      if (additionalfileresponse.status) {
        setAdditionalFile(
          additionalfileresponse.data?.map((file) => ({
            name: file.name,
            path: file.path,
          })) ?? []
        );
      }

      setLoading(false);
    };

    init();
  }, [userid]);

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <IcBaselineAccountCircle className="text-3xl" />
        <p className="text-sm font-semibold text-gray-600">User Profile</p>
        <div className="grow"></div>
        <Link
          href={"/dashboard/userprofile/edit"}
          className="text-white bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 rounded-sm px-2 h-8 text-sm grid place-items-center"
        >
          Edit Profile
        </Link>
      </div>
      <div className="bg-white p-4 rounded-md shadow-md mt-6">
        <p className="text-gray-500 text-center">User Basic Information</p>
        <Separator />
        <div className="mt-2 flex flex-col lg:flex-row gap-2 ">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Username</h1>
            <p className="text-sm font-semibold">{user?.username ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Email:</h1>
            <p className="text-sm font-semibold">{user?.email ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col lg:flex-row gap-2 ">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">First Name</h1>
            <p className="text-sm font-semibold">{user?.firstName ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Last Name:</h1>
            <p className="text-sm font-semibold">{user?.lastName ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col lg:flex-row gap-2 ">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Mobile Number</h1>
            <p className="text-sm font-semibold">{user?.contactone ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Alternate Contact Number</h1>
            <p className="text-sm font-semibold">{user?.contacttwo ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col lg:flex-row gap-2 ">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Aadhar</h1>
            <p className="text-sm font-semibold">{user?.aadhar ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Pan</h1>
            <p className="text-sm font-semibold">{user?.pan ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col lg:flex-row gap-2 ">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Address</h1>
            <p className="text-sm font-semibold">{user?.address ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">City</h1>
            <p className="text-sm font-semibold">{user?.city ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col lg:flex-row gap-2 ">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Bank Name</h1>
            <p className="text-sm font-semibold">{user?.bankName ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Bank Amount Number</h1>
            <p className="text-sm font-semibold">
              {user?.bankAccountNumber ?? "-"}
            </p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Ifsc Code</h1>
            <p className="text-sm font-semibold">{user?.ifscCode ?? "-"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {getAadhar.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>Aadhar Card</p>
                <button
                  onClick={() => {
                    setPdffile(getAadhar.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getPan.status ? (
            <>
              <div className="flex gap-4 items-center  bg-gray-100 p-2 rounded justify-between">
                <p>Pan Card</p>
                <button
                  onClick={() => {
                    setPdffile(getPan.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getBankPassbook.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>Bank Passbook</p>
                <button
                  onClick={() => {
                    setPdffile(getBankPassbook.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getPhoto.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>Photo</p>
                <button
                  onClick={() => {
                    setPdffile(getPhoto.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getWomenFile.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Women</p>
                <button
                  onClick={() => {
                    setPdffile(getWomenFile.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getCategory.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Reserved Category</p>
                <button
                  onClick={() => {
                    setPdffile(getCategory.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getAbled.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Differently Abled</p>
                <button
                  onClick={() => {
                    setPdffile(getAbled.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getMsme.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For MSME</p>
                <button
                  onClick={() => {
                    setPdffile(getMsme.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getStsc.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For SC/ST</p>
                <button
                  onClick={() => {
                    setPdffile(getStsc.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {getTribal.status ? (
            <>
              <div className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between">
                <p>For Tribal</p>
                <button
                  onClick={() => {
                    setPdffile(getTribal.path);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                >
                  View File
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          {additionalFile.map((file, index) => (
            <div
              key={index}
              className="flex gap-4 items-center bg-gray-100 p-2 rounded justify-between"
            >
              <p>{file.name}</p>
              <button
                onClick={() => {
                  setPdffile(file.path);
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 500);
                }}
                className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </button>
            </div>
          ))}
        </div>
      </div>

      {pdffile !== null && (
        <>
          <div className="w-full my-4">
            {pdffile.endsWith(".pdf") && (
              <embed
                src={pdffile}
                className="w-full h-[calc(100vh-50px)]"
                type="application/pdf"
              />
            )}

            {pdffile.endsWith(".jpg") ||
            pdffile.endsWith(".jpeg") ||
            pdffile.endsWith(".png") ? (
              <div className="relative w-full">
                <img src={pdffile} alt="image" className="w-full" />
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default UserBidsRunning;
