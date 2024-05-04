"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { AccountPaymentMode, misc_invoice } from "@prisma/client";

interface CreateAcountPayload {
  customername: string;
  customercontact?: string;
  customeraddress?: string;
  customergst: string;
  customerplaceofsupply: string;
  accountCategoryId: number;
  accountCategoryIdTwo?: number;
  accountCategoryIdThree?: number;
  paymentmode: AccountPaymentMode;
  transaction_date: Date;
  amount: string;
  amountTwo?: string;
  amountThree?: string;
  transactionid?: string;
  bankname?: string;
  remarks?: string;
  remarkOne?: string;
  remarkTwo?: string;
  remarkThree?: string;
  hsn: string;
  cgst: string;
  ugst: string;
  igst: string;
  cgst_percent: string;
  createdById: number;
}

const CreateInvoice = async (
  payload: CreateAcountPayload
): Promise<ApiResponseType<misc_invoice | null>> => {
  try {
    let data_to_update: any = {
      customername: payload.customername,
      customergst: payload.customergst,
      customerplaceofsupply: payload.customerplaceofsupply,
      accountCategoryOneId: payload.accountCategoryId,
      paymentmode: payload.paymentmode,
      amount: payload.amount.toString(),
      transaction_date: payload.transaction_date,
      createdById: payload.createdById,
      hsn: payload.hsn,
      cgst: payload.cgst,
      ugst: payload.ugst,
      igst: payload.igst,
      cgst_percent: payload.cgst_percent,
    };
    const misc_invoice = await prisma.misc_invoice.create({
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
        message: "Invoice not created",
        functionname: "CreateInvoice",
      };

    return {
      status: true,
      data: misc_invoice,
      message: "Invoice created successfully",
      functionname: "CreateInvoice",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateInvoice",
    };
    return response;
  }
};

export default CreateInvoice;
