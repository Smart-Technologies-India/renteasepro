"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { misc_invoice } from "@prisma/client";
import prisma from "../../../prisma/database";

interface AllInvoicePayload {}

const AllInvoice = async (
  payload: AllInvoicePayload
): Promise<ApiResponseType<misc_invoice[] | null>> => {
  try {
    const account_invoice = await prisma.misc_invoice.findMany({
      where: {
        deletedAt: null,
        deletedBy: null,
      },
      include: {
        account_category_one: true,
        account_category_three: true,
        account_category_two: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!account_invoice)
      return {
        status: false,
        data: null,
        message: "Invalid id. Please try again.",
        functionname: "AllAccount",
      };

    return {
      status: true,
      data: account_invoice,
      message: "Invoice receipts data get successfully",
      functionname: "AllInvoice",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AllInvoice",
    };
    return response;
  }
};

export default AllInvoice;
