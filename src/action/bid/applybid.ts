"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { BidPaymentType, bid_transact } from "@prisma/client";
import prisma from "../../../prisma/database";
import { SMSType, sendSMS } from "@/utils/smsmessage";

interface ApplyBidPayload {
  bidId: number;
  userId: number;
  shopId: number;
  amount: number;
  issecond: boolean;
  fees?: number;
  emd?: number;
  bg?: number;
  bankname?: string;
  transactionid?: string;
  orderid?: string;
}

const ApplyBid = async (
  payload: ApplyBidPayload
): Promise<ApiResponseType<bid_transact | null>> => {
  try {
    const bid_transactresponse = await prisma.bid_transact.create({
      data: {
        userId: payload.userId,
        shopId: payload.shopId,
        bidId: payload.bidId,
        amount: payload.amount,
        createdById: payload.userId,
        deletedAt: new Date(),
      },
      include: {
        bid: true,
        user: true,
        shop: { include: { property: true } },
      },
    });

    if (!bid_transactresponse)
      return {
        status: false,
        data: null,
        message: "User bid transaction failed. Please try again later.",
        functionname: "ApplyBid",
      };

    if (!payload.issecond) {
      const year = new Date().getFullYear();
      const name = bid_transactresponse.bid.is_auction ? "AUCTION" : "TENDER";

      const timestamp = new Date().getTime();

      const transactionid = `${name}_${year}_${bid_transactresponse.bid.id}_${timestamp}`;

      await prisma.bid_payment.create({
        data: {
          userId: payload.userId,
          shopId: payload.shopId,
          bidId: payload.bidId,
          amount: payload.fees ?? 0,
          paymenttype: BidPaymentType.FEES,
          gateway_charge: "0",
          transaction_date: new Date(),
          paymentmode: "online",
          transactionid: payload.transactionid,
          bankname: payload.bankname,
          createdById: payload.userId,
          deletedAt: new Date(),
          orderid: payload.orderid,
        },
      });

      if (payload.emd && payload.emd > 0) {
        await prisma.bid_payment.create({
          data: {
            userId: payload.userId,
            shopId: payload.shopId,
            bidId: payload.bidId,
            amount: payload.emd,
            paymenttype: BidPaymentType.EMD,
            gateway_charge: "0",
            transaction_date: new Date(),
            paymentmode: "online",
            transactionid: payload.transactionid,
            bankname: payload.bankname,
            createdById: payload.userId,
            deletedAt: new Date(),
            orderid: payload.orderid,
          },
        });
      }

      if (payload.bg && payload.bg > 0) {
        await prisma.bid_payment.create({
          data: {
            userId: payload.userId,
            shopId: payload.shopId,
            bidId: payload.bidId,
            amount: payload.bg,
            paymenttype: BidPaymentType.BG,
            gateway_charge: "0",
            transaction_date: new Date(),
            paymentmode: "online",
            transactionid: payload.transactionid,
            bankname: payload.bankname,
            createdById: payload.userId,
            deletedAt: new Date(),
            orderid: payload.orderid,
          },
        });
      }
    }

    // const messageresponse = await sendSMS({
    //   type: SMSType.NewBidSubmitted,
    //   contact: bid_transactresponse.user.contactone!,
    // });

    // if (!messageresponse.status) {
    //   return {
    //     status: false,
    //     data: null,
    //     message: messageresponse.message,
    //     functionname: "ApplyBid",
    //   };
    // }

    // if higher bid then send sms to all lower bid user

    if (bid_transactresponse.bid.is_auction) {
      const lowerbidusers = await prisma.bid_transact.findMany({
        where: {
          bidId: payload.bidId,
          shopId: payload.shopId,
          amount: { lt: bid_transactresponse.amount },
        },
        include: {
          user: true,
        },
      });

      // remove duplicate user
      const unique = lowerbidusers.map((item) => item.user.contactone);
      const uniquecontact = unique.filter((v, i, a) => a.indexOf(v) === i);

      if (uniquecontact) {
        uniquecontact.map(async (item) => {
          await sendSMS({
            type: SMSType.HigherBidSubmitted,
            contact: item!,
            propertyName: bid_transactresponse.shop.property.name,
          });
        });
      }
    }

    return {
      status: true,
      data: bid_transactresponse,
      message: "Bid Application successful.",
      functionname: "ApplyBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "ApplyBid",
    };
    return response;
  }
};

export default ApplyBid;
