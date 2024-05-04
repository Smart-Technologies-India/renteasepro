"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { misc_invoice } from "@prisma/client";
import prisma from "../../../prisma/database";

interface GetInvoicePayload {
  id: number;
}

const GetInvoice = async (
  payload: GetInvoicePayload
): Promise<ApiResponseType<misc_invoice | null>> => {
  try {
    const account_invoice = await prisma.misc_invoice.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        account_category_one: true,
        account_category_two: true,
        account_category_three: true,
      },
    });

    if (!account_invoice)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "GetInvoice",
      };

    return {
      status: true,
      data: account_invoice,
      message: "User Invoice data get successfully",
      functionname: "GetInvoice",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetInvoice",
    };
    return response;
  }
};

export default GetInvoice;
