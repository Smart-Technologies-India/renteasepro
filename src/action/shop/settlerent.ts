"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { shop } from "@prisma/client";
import prisma from "../../../prisma/database";

interface SettlerentPayload {
  shopid: number;
  rentid: number;
  userid: number;
  currentuser: number;

  fd_amount?: number;
  letoff_amount?: number;
  offline_amount?: number;
  transaction_date?: string;
  paymentmode?: string;
  transactionid?: string;
  bankname?: string;
  remark: string;
}

const Settlerent = async (
  payload: SettlerentPayload
): Promise<ApiResponseType<shop | null>> => {
  try {
    const shopdata = await prisma.shop.findFirst({
      where: {
        id: parseInt(payload.shopid.toString()),
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (!shopdata)
      return {
        status: false,
        data: null,
        message: "Shop not found. Please try again.",
        functionname: "Settlerent",
      };

    const updateshop = await prisma.shop.update({
      where: {
        id: shopdata.id,
      },
      data: {
        status: "VACANT",
      },
    });

    if (!updateshop)
      return {
        status: false,
        data: null,
        message: "Unable to update shop. Please try again.",
        functionname: "Settlerent",
      };

    const updaterent = await prisma.rent.update({
      where: {
        id: parseInt(payload.rentid.toString()),
      },
      data: {
        status: "COMPLETED",
      },
    });

    if (!updaterent)
      return {
        status: false,
        data: null,
        message: "Unable to update rent. Please try again.",
        functionname: "Settlerent",
      };

    const updaterenttransect = await prisma.rent_transact.updateMany({
      where: {
        userId: parseInt(payload.userid.toString()),
        rentId: parseInt(payload.rentid.toString()),
        shopId: parseInt(payload.shopid.toString()),
        OR: [
          {
            status: "DUE",
          },
          {
            status: "INACTIVE",
          },
        ],
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedById: payload.currentuser,
      },
    });

    if (!updaterenttransect)
      return {
        status: false,
        data: null,
        message: "Unable to update rent transact. Please try again.",
        functionname: "Settlerent",
      };

    const settlerent = await prisma.rentclose.create({
      data: {
        shopId: payload.shopid,
        rentId: payload.rentid,
        userId: payload.userid,
        fd_amount: payload.fd_amount ?? 0,
        letoff_amount: payload.letoff_amount ?? 0,
        offline_amount: payload.offline_amount ?? 0,
        bankname: payload.bankname,
        paymentmode: payload.paymentmode,
        transactionid: payload.transactionid,
        transaction_date: payload.transaction_date,
        remarks: payload.remark,
        createdById: payload.currentuser,
      },
    });

    if (!settlerent)
      return {
        status: false,
        data: null,
        message: "Unable to add close rent. Please try again.",
        functionname: "Settlerent",
      };

    return {
      status: true,
      data: null,
      message: "Rent Close successfully",
      functionname: "Settlerent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "Settlerent",
    };
    return response;
  }
};

export default Settlerent;
