"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { AccountPaymentMode, account_receipt } from "@prisma/client";

interface CreateAcountPayload {
  customername: string;
  customercontact?: string;
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
  createdById: number;
}

const CreateAccount = async (
  payload: CreateAcountPayload
): Promise<ApiResponseType<account_receipt | null>> => {
  try {
    let data_to_update: any = {
      customername: payload.customername,
      accountCategoryOneId: payload.accountCategoryId,
      paymentmode: payload.paymentmode,
      transaction_date: payload.transaction_date,
      amount: payload.amount.toString(),
      createdById: payload.createdById,
    };

    const account_receipt = await prisma.account_receipt.create({
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
        ...(payload.remarks && { remarks: payload.remarks }),
        ...(payload.transactionid && {
          transactionid: payload.transactionid,
        }),
        ...(payload.bankname && { bankname: payload.bankname }),
        ...(payload.customercontact && {
          customercontact: payload.customercontact,
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
