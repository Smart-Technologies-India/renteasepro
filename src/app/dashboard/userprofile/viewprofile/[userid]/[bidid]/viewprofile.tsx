"use client";
import GetUser from "@/action/user/getuser";
import { IcBaselineAccountCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserDocType, bid_transact, user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import AcceptBidTran from "@/action/bid_transact/acceptbidtran";
import RejectBidTran from "@/action/bid_transact/rejectbidtran";
import GetBidTran from "@/action/bid_transact/getbidtransact";
import getUploadFileUser from "@/action/user/getuploadedfile";
import Link from "next/link";
import BackButton from "@/components/backbutton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { longtext } from "@/utils/methods";
import Image from "next/image";

interface UserProfileProps {
  userid: number;
  bidid: number;
}

const UserProfile = (props: UserProfileProps) => {
  const [pdffile, setPdffile] = useState<string | null>(null);

  const template: { [key: string]: string }[] = [
    {
      key: "Valid Document",
      value: "Document found to be valid and verified.",
    },
    {
      key: "Invalid Document",
      value: "Document found to be Invalid/Incomplete.",
    },
    {
      key: "Missing Document",
      value: "Shortfall of Document found.",
    },
    {
      key: "Invalid Bidder",
      value: "Bidder found to be invalid for the bid.",
    },
  ];
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<user>();
  const [bidTransact, setBidTransact] = useState<bid_transact>();

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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const userrespone = await GetUser({
        id: props.userid,
      });
      if (userrespone.status) {
        setUser(userrespone.data!);
      }

      const bidtransact = await GetBidTran({
        id: props.bidid,
      });

      if (bidtransact.status) {
        setBidTransact(bidtransact.data!);
      }

      if (userrespone.status) {
        setUser(userrespone.data!);
      }
      const aadharresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.AADHAR,
      });

      if (aadharresponse.status) {
        setGetAadhar({
          status: true,
          path: aadharresponse.data?.path!,
        });
      }

      const panresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.PAN,
      });

      if (panresponse.status) {
        setGetPan({
          status: true,
          path: panresponse.data?.path!,
        });
      }

      const bankpassbookresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.BANK,
      });

      if (bankpassbookresponse.status) {
        setGetBankPassbook({
          status: true,
          path: bankpassbookresponse.data?.path!,
        });
      }

      const photoresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.PHOTO,
      });

      if (photoresponse.status) {
        setGetPhoto({
          status: true,
          path: photoresponse.data?.path!,
        });
      }
      const womenfileresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.WOMEN,
      });

      if (womenfileresponse.status) {
        setGetWomenFile({
          status: true,
          path: womenfileresponse.data?.path!,
        });
      }

      const categoryresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.RESERVED,
      });

      if (categoryresponse.status) {
        setGetCategory({
          status: true,
          path: categoryresponse.data?.path!,
        });
      }

      const abledresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.DIFFERENTLY_ABLED,
      });

      if (abledresponse.status) {
        setGetAbled({
          status: true,
          path: abledresponse.data?.path!,
        });
      }

      const msmeresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.MSME,
      });

      if (msmeresponse.status) {
        setGetMsme({
          status: true,
          path: msmeresponse.data?.path!,
        });
      }

      const stscresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.SC_ST,
      });

      if (stscresponse.status) {
        setGetStsc({
          status: true,
          path: stscresponse.data?.path!,
        });
      }

      const tribalresponse = await getUploadFileUser({
        userId: props.userid,
        doc_type: UserDocType.TRIBAL,
      });

      if (tribalresponse.status) {
        setGetTribal({
          status: true,
          path: tribalresponse.data?.path!,
        });
      }

      setLoading(false);
    };

    init();
  }, [props.userid, props.bidid]);

  const [acceptReason, setAcceptReason] = useState<string>("");
  const acceptBid = async () => {
    if (acceptReason == "" || acceptReason == undefined || acceptReason == null)
      return toast.error("Please Enter Accept Reason");

    const response = await AcceptBidTran({
      id: props.bidid,
      reason: acceptReason ?? "",
    });

    if (response.status) {
      toast.success("Bid Accepted Successfully");
      router.back();
    } else {
      toast.error(response.message);
    }
  };
  const [rejectReason, setRejectReason] = useState<string>("");
  const recjectBid = async () => {
    if (rejectReason == "" || rejectReason == undefined || rejectReason == null)
      return toast.error("Please Enter Reject Reason");

    const response = await RejectBidTran({
      id: props.bidid,
      reason: rejectReason,
    });

    if (response.status) {
      toast.success("Bid Rejected Successfully");
      router.back();
    } else {
      toast.error(response.message);
    }
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
        <IcBaselineAccountCircle className="text-3xl" />
        <p className="text-sm font-semibold text-gray-600">User Profile</p>
        <div className="grow"></div>
      </div>
      <div className="bg-white p-4 rounded-md shadow-md mt-6">
        <p className="text-gray-500 text-center">User Basic Information</p>
        <Separator />
        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Username</h1>
            <p className="text-sm font-semibold">{user?.username ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Email:</h1>
            <p className="text-sm font-semibold">{user?.email ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">First Name</h1>
            <p className="text-sm font-semibold">{user?.firstName ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Last Name:</h1>
            <p className="text-sm font-semibold">{user?.lastName ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Mobile Number</h1>
            <p className="text-sm font-semibold">{user?.contactone ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Alternate Contact Number</h1>
            <p className="text-sm font-semibold">{user?.contacttwo ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Aadhar</h1>
            <p className="text-sm font-semibold">{user?.aadhar ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Pan</h1>
            <p className="text-sm font-semibold">{user?.pan ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">Address</h1>
            <p className="text-sm font-semibold">{user?.address ?? "-"}</p>
          </div>

          <div className="rounded-md py-1 px-4 bg-gray-100 flex-1">
            <h1 className="text-sm text-black">City</h1>
            <p className="text-sm font-semibold">{user?.city ?? "-"}</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
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
        </div>

        {bidTransact?.status == "USERNOTINTERESTED" && (
          <div className="rounded-md py-1 px-4 bg-rose-50 flex-1 mt-2">
            <h1 className="text-sm text-black">User is not Intrested</h1>
            <p className="text-sm font-semibold">{bidTransact?.userremarks}</p>
          </div>
        )}
        {bidTransact?.status == "REJECTED" && (
          <div className="rounded-md py-1 px-4 bg-rose-50 flex-1 mt-2">
            <h1 className="text-sm text-black">Rejected Reason</h1>
            <p className="text-sm font-semibold">
              {bidTransact?.rejectedreason}
            </p>
          </div>
        )}

        {bidTransact?.status == "ACCEPTED" && (
          <div className="rounded-md py-1 px-4 bg-green-50 flex-1 mt-2">
            <h1 className="text-sm text-black">Accepted Reason</h1>
            <p className="text-sm font-semibold">{bidTransact?.biddocreason}</p>
          </div>
        )}

        {(bidTransact?.status == "PENDING" ||
          bidTransact?.status == "USERNOTINTERESTED") && (
          <div className="flex gap-4 mt-4">
            <div className="grow"></div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 w-28">
                  Accept
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to accept?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter Accept Reason Below
                  </AlertDialogDescription>
                  <TextArea
                    value={acceptReason}
                    onChange={(e) => setAcceptReason(e.target.value)}
                    placeholder="Enter Accept Reason"
                    className="resize-none h-24 mt-2"
                  ></TextArea>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={acceptBid}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>

                <Separator />
                <p className="text-sm">Suggestions</p>
                <div className="flex gap-2 flex-wrap">
                  {template.map((item, index) => (
                    <div key={index}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() =>
                                setAcceptReason((val) => val + " " + item.value)
                              }
                              className="h-auto text-xs bg-gray-200 text-black py-2 px-4 hover:bg-gray-300"
                            >
                              {item.key}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="p-0 m-0">
                            <p className="bg-black text-white py-1 px-4 text-xs rounded-md">
                              {longtext(item.value, 20)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-rose-500 hover:bg-rose-600 w-28">
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to reject?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter Reject Reason Below
                  </AlertDialogDescription>
                  <TextArea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter Reject Reason"
                    className="resize-none h-24 mt-2"
                  ></TextArea>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={recjectBid}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>

                <Separator />
                <p className="text-sm">Suggestions</p>
                <div className="flex gap-2">
                  {template.map((item, index) => (
                    <div key={index}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() =>
                                setRejectReason((val) => val + " " + item.value)
                              }
                              className="h-auto text-xs bg-gray-200 text-black py-2 px-4 hover:bg-gray-300"
                            >
                              {item.key}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="p-0 m-0">
                            <p className="bg-black text-white py-1 px-4 text-xs rounded-md">
                              {longtext(item.value, 20)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
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

export default UserProfile;
