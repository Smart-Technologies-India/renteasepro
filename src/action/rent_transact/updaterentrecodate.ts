"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface UpdateRentRecoDatePayload {
  id: number;
  reco_date: Date;
}

const UpdateRentRecoDate = async (
  payload: UpdateRentRecoDatePayload
): Promise<ApiResponseType<rent_transact | null>> => {
  try {
    const isExist = await prisma.rent_transact.findFirst({
      where: {
        id: payload.id,
        status: "PAID",
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!isExist)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "UpdateRentRecoDate",
      };

    const udpatedata = await prisma.rent_transact.update({
      where: {
        id: payload.id,
      },
      data: {
        reconcilation: payload.reco_date,
      },
    });

    if (!udpatedata)
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "UpdateRentRecoDate",
      };

    return {
      status: true,
      data: udpatedata,
      message: "Rent Transact data get successfully",
      functionname: "UpdateRentRecoDate",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateRentRecoDate",
    };
    return response;
  }
};

export default UpdateRentRecoDate;
