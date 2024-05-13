"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { AccountPaymentMode, account_receipt } from "@prisma/client";

interface UpdateAcountPayload {
  id: number;
  customername?: string;
  customercontact?: string;
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
  createdById?: number;
}

const UpdateAccount = async (
  payload: UpdateAcountPayload
): Promise<ApiResponseType<account_receipt | null>> => {
  try {
    const isexist = await prisma.account_receipt.findUnique({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
      },
    });

    if (!isexist)
      return {
        status: false,
        data: null,
        message: "Account not found",
        functionname: "UpdateAccount",
      };
    let data_to_update: any = {};

    if (payload.customername)
      data_to_update.customername = payload.customername;
    if (payload.accountCategoryId)
      data_to_update.accountCategoryOneId = payload.accountCategoryId;
    if (payload.paymentmode) data_to_update.paymentmode = payload.paymentmode;
    if (payload.transaction_date)
      data_to_update.transaction_date = payload.transaction_date;
    if (payload.amount) data_to_update.amount = payload.amount;
    if (payload.createdById) data_to_update.createdById = payload.createdById;
    if (payload.bankname) data_to_update.bankname = payload.bankname;
    if (payload.remarks) data_to_update.remarks = payload.remarks;
    if (payload.transactionid)
      data_to_update.transactionid = payload.transactionid;
    if (payload.customercontact)
      data_to_update.customercontact = payload.customercontact;

    const account_receipt = await prisma.account_receipt.update({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
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
      },
    });

    if (!account_receipt)
      return {
        status: false,
        data: null,
        message: "Unable to update Account",
        functionname: "UpdateAccount",
      };

    return {
      status: true,
      data: account_receipt,
      message: "Account updated successfully",
      functionname: "UpdateAccount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateAccount",
    };
    return response;
  }
};

export default UpdateAccount;
