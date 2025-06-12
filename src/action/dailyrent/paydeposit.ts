"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface PayDepositPayload {
  id: number;
  transactionid: string;
  bankname: string;
  orderid: string;
  startdate: Date;
  approvedById: number;
}

const PayDeposit = async (
  payload: PayDepositPayload
): Promise<ApiResponseType<rent_transact[] | null>> => {
  try {
    const updatedata = await prisma.daily_rent_transact.update({
      where: {
        id: payload.id,
      },
      data: {
        transactionid: payload.transactionid,
        status: "PAID",
        transaction_date: payload.startdate,
        paymentmode: "OFFLINE",
        orderid: payload.orderid,
        bankname: payload.bankname,
        remarks: "offline deposit",
      },
      include: {
        user: true,
        daily_rent: true,
      },
    });

    await prisma.daily_rent.update({
      where: {
        id: updatedata.daily_rent.id,
      },
      data: {
        status: "UPCOMING",
      },
    });

    return {
      status: true,
      data: null,
      message: "Rent paid successfully",
      functionname: "PayDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "PayDeposit",
    };
    return response;
  }
};

export default PayDeposit;
