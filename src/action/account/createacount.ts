"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { AccountPaymentMode, account_receipt } from "@prisma/client";

interface CreateAcountCategoryPayload {
  customername: string;
  customercontact: string;
  accountCategoryId: number;
  paymentmode: AccountPaymentMode;
  transaction_date: Date;
  amount: number;
  transactionid: string;
  bankname: string;
  remarks: string;
  createdById: number;
}

const CreateAccountCategory = async (
  payload: CreateAcountCategoryPayload
): Promise<ApiResponseType<account_receipt | null>> => {
  try {
    const account_receipt = await prisma.account_receipt.create({
      data: {
        customername: payload.customername,
        customercontact: payload.customercontact,
        accountCategoryId: payload.accountCategoryId,
        paymentmode: payload.paymentmode,
        transaction_date: payload.transaction_date,
        amount: payload.amount,
        transactionid: payload.transactionid,
        bankname: payload.bankname,
        remarks: payload.remarks,
        createdById: payload.createdById,
      },
    });

    if (!account_receipt)
      return {
        status: false,
        data: null,
        message: "Account Category not created",
        functionname: "CreateAccountCategory",
      };

    return {
      status: true,
      data: account_receipt,
      message: "Account Category created successfully",
      functionname: "CreateAccountCategory",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateAccountCategory",
    };
    return response;
  }
};

export default CreateAccountCategory;
