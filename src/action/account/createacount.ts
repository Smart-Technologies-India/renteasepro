"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { AccountPaymentMode, account_receipt } from "@prisma/client";

interface CreateAcountPayload {
  customername: string;
  customercontact: string;
  accountCategoryId: number;
  accountCategoryIdTwo?: number;
  accountCategoryIdThree?: number;
  paymentmode: AccountPaymentMode;
  transaction_date: Date;
  amount: number;
  amountTwo?: number;
  amountThree?: number;
  transactionid: string;
  bankname: string;
  remarks: string;
  createdById: number;
}

const CreateAccount = async (
  payload: CreateAcountPayload
): Promise<ApiResponseType<account_receipt | null>> => {
  try {
    // customername: payload.customername,
    // customercontact: payload.customercontact,
    // accountCategoryOneId: payload.accountCategoryId,
    // accountCategoryTwoId: payload.accountCategoryIdTwo,
    // accountCategoryThreeId: payload.accountCategoryIdThree,
    // paymentmode: payload.paymentmode,
    // transaction_date: payload.transaction_date,
    // amount: parseInt(payload.amount.toString()),
    // amount_two: parseInt(payload.amountTwo?.toString() || "0"),
    // amount_three: parseInt(payload.amountThree?.toString() || "0"),
    // transactionid: payload.transactionid,
    // bankname: payload.bankname,
    // remarks: payload.remarks,
    // createdById: payload.createdById,
    let data_to_update: any = {
      customername: payload.customername,
      customercontact: payload.customercontact,
      accountCategoryOneId: payload.accountCategoryId,
      paymentmode: payload.paymentmode,
      transaction_date: payload.transaction_date,
      amount: parseInt(payload.amount.toString()),
      transactionid: payload.transactionid,
      bankname: payload.bankname,
      remarks: payload.remarks,
      createdById: payload.createdById,
    };
    const account_receipt = await prisma.account_receipt.create({
      data: {
        ...data_to_update,
        ...(payload.accountCategoryIdTwo && {
          accountCategoryTwoId: payload.accountCategoryIdTwo,
          amount_two: parseInt(payload.amountTwo?.toString() || "0"),
        }),
        ...(payload.accountCategoryIdThree && {
          accountCategoryThreeId: payload.accountCategoryIdThree,
          amount_three: parseInt(payload.amountThree?.toString() || "0"),
        }),
      },
    });

    if (!account_receipt)
      return {
        status: false,
        data: null,
        message: "Account Category not created",
        functionname: "CreateAccount",
      };

    return {
      status: true,
      data: account_receipt,
      message: "Account Category created successfully",
      functionname: "CreateAccount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateAccount",
    };
    return response;
  }
};

export default CreateAccount;
