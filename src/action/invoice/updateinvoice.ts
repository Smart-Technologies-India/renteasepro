"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { AccountPaymentMode, misc_invoice } from "@prisma/client";

interface UpdateAcountPayload {
  id: number;
  customername?: string;
  customercontact?: string;
  customeraddress?: string;
  customergst?: string;
  customerplaceofsupply?: string;
  accountCategoryId?: number;
  accountCategoryIdTwo?: number;
  accountCategoryIdThree?: number;
  paymentmode?: AccountPaymentMode;
  transaction_date?: Date;
  amount?: string;
  amountTwo?: string;
  amountThree?: string;
  transactionid?: string;
  bankname?: string;
  remarks?: string;
  remarkOne?: string;
  remarkTwo?: string;
  remarkThree?: string;
  hsn?: string;
  cgst?: string;
  ugst?: string;
  igst?: string;
  cgst_percent?: string;
  createdById?: number;
}

const UpdateAcount = async (
  payload: UpdateAcountPayload
): Promise<ApiResponseType<misc_invoice | null>> => {
  try {
    const isexist = await prisma.misc_invoice.findUnique({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
    });

    if (!isexist)
      return {
        status: false,
        data: null,
        message: "Invoice not found",
        functionname: "UpdateAcount",
      };

    let data_to_update: any = {};

    if (payload.customername)
      data_to_update.customername = payload.customername;
    if (payload.customergst) data_to_update.customergst = payload.customergst;
    if (payload.customerplaceofsupply)
      data_to_update.customerplaceofsupply = payload.customerplaceofsupply;
    if (payload.accountCategoryId)
      data_to_update.accountCategoryOneId = payload.accountCategoryId;
    if (payload.paymentmode) data_to_update.paymentmode = payload.paymentmode;
    if (payload.amount) data_to_update.amount = payload.amount.toString();
    if (payload.transaction_date)
      data_to_update.transaction_date = payload.transaction_date;
    if (payload.createdById) data_to_update.createdById = payload.createdById;
    if (payload.hsn) data_to_update.hsn = payload.hsn;
    if (payload.cgst) data_to_update.cgst = payload.cgst;
    if (payload.ugst) data_to_update.ugst = payload.ugst;
    if (payload.igst) data_to_update.igst = payload.igst;
    if (payload.cgst_percent)
      data_to_update.cgst_percent = payload.cgst_percent;

    const misc_invoice = await prisma.misc_invoice.update({
      where: {
        id: parseInt(payload.id.toString()),
      },
      data: {
        ...data_to_update,
        ...(payload.accountCategoryIdTwo && {
          accountCategoryTwoId: payload.accountCategoryIdTwo,
          amount_two: payload.amountTwo?.toString(),
        }),
        ...(payload.accountCategoryIdThree && {
          accountCategoryThreeId: payload.accountCategoryIdThree,
          amount_three: payload.amountThree?.toString(),
        }),
        ...(payload.customercontact && {
          customercontact: payload.customercontact,
        }),
        ...(payload.bankname && { bankname: payload.bankname }),
        ...(payload.remarks && { remarks: payload.remarks }),
        ...(payload.transactionid && { transactionid: payload.transactionid }),
        ...(payload.customeraddress && {
          customeraddress: payload.customeraddress,
        }),
        ...(payload.remarkOne && { remark_cat_one: payload.remarkOne }),
        ...(payload.remarkTwo && { remark_cat_two: payload.remarkTwo }),
        ...(payload.remarkThree && { remark_cat_three: payload.remarkThree }),
      },
    });

    if (!misc_invoice)
      return {
        status: false,
        data: null,
        message: "Unable to update invoice",
        functionname: "UpdateAcount",
      };

    return {
      status: true,
      data: misc_invoice,
      message: "Invoice created successfully",
      functionname: "UpdateAcount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateAcount",
    };
    return response;
  }
};

export default UpdateAcount;
