"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { bid } from "@prisma/client";

interface AddFileBidPayload {
  id: number;
  t_and_c_upload?: string;
}

const AddFileBid = async (
  payload: AddFileBidPayload
): Promise<ApiResponseType<bid | null>> => {
  try {
    const bidExist = await prisma.bid.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!bidExist)
      return {
        status: false,
        data: null,
        message: "Bid not found",
        functionname: "AddFileBid",
      };

    const bid = await prisma.bid.update({
      where: {
        id: payload.id,
      },
      data: {
        t_and_c_upload: payload.t_and_c_upload,
      },
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Unable to create bid. Please try again.",
        functionname: "AddFileBid",
      };

    return {
      status: true,
      data: bid,
      message: "Bid data updated successfully",
      functionname: "AddFileBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AddFileBid",
    };
    return response;
  }
};

export default AddFileBid;
