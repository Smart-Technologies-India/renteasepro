"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { ExemptFor, PercentageType, bid } from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";

interface CreateBidPayload {
  shopId: number;
  title: string;
  description: string;
  instruction: string;
  min_bid_amount: number;
  bidincrementamount: string;
  min_bid_increment: number;
  fees_amount: number;
  fees: string;
  fees_refundable: string;
  emd_amount: number;
  emd: string;
  emd_refundable: string;
  bg_amount: number;
  bg: string;
  bg_refundable: string;
  bidstartdate: Date;
  bidenddate: Date;
  biddeclarationdate: Date;
  createdById: number;
  docone?: string;
  doconedescription?: string;
  doctwo?: string;
  doctwodescription?: string;
  docthree?: string;
  docthreedescription?: string;
  t_and_c_file_number?: string;
  t_and_c_description?: string;
  t_and_c_upload?: string;
  is_woman: boolean;
  is_reserved: boolean;
  is_differently_abled: boolean;
  is_msme: boolean;
  is_exemption: boolean;
  exemptfield: string[];
  exemptsectionsvalue: string[];
  is_fees_exempt_allowed: boolean;
  exempt_fees_for?: ExemptFor;
  exempt_fees?: PercentageType;
  exempt_fees_amount?: number;
  is_emd_exempt_allowed: boolean;
  exempt_emd_for?: ExemptFor;
  exempt_emd?: PercentageType;
  exempt_emd_amount?: number;
  is_bg_exempt_allowed: boolean;
  exempt_bg_for?: ExemptFor;
  exempt_bg?: PercentageType;
  exempt_bg_amount?: number;
}

const ensureDirectory = async (dir: string) => {
  await mkdir(dir, { recursive: true });
};

const CreateBid = async (
  payload: CreateBidPayload
): Promise<ApiResponseType<bid | null>> => {
  try {
    const bidExist = await prisma.bid.findFirst({
      where: {
        title: payload.title,
        bidstartdate: payload.bidstartdate,
      },
    });

    if (bidExist)
      return {
        status: false,
        data: null,
        message: "Bid already exist.",
        functionname: "CreateBid",
      };

    let data_to_insert: any = {
      shopId: payload.shopId,
      title: payload.title,
      description: payload.description,
      instruction: payload.instruction,
      min_bid_amount: payload.min_bid_amount,
      bidincrementamount: payload.bidincrementamount,
      min_bid_increment: payload.min_bid_increment,
      fees_amount: payload.fees_amount,
      fees: payload.fees,
      fees_refundable: payload.fees_refundable,
      emd_amount: payload.emd_amount,
      emd: payload.emd,
      emd_refundable: payload.emd_refundable,
      bg_amount: payload.bg_amount,
      bg: payload.bg,
      bg_refundable: payload.bg_refundable,
      bidstartdate: payload.bidstartdate,
      bidenddate: payload.bidenddate,
      biddeclarationdate: payload.biddeclarationdate,
      is_woman: payload.is_woman,
      is_reserved: payload.is_reserved,
      is_differently_abled: payload.is_differently_abled,
      is_msme: payload.is_msme,
      is_exemption: payload.is_exemption,
      createdById: payload.createdById,
    };

    if (payload.docone) {
      data_to_insert["docone"] = payload.docone;
    }
    if (payload.doconedescription) {
      data_to_insert["doconedescription"] = payload.doconedescription;
    }
    if (payload.doctwo) {
      data_to_insert["doctwo"] = payload.doctwo;
    }
    if (payload.docthree) {
      data_to_insert["docthree"] = payload.docthree;
    }
    if (payload.docthreedescription) {
      data_to_insert["docthreedescription"] = payload.docthreedescription;
    }
    if (payload.t_and_c_file_number) {
      data_to_insert["t_and_c_file_number"] = payload.t_and_c_file_number;
    }
    if (payload.t_and_c_description) {
      data_to_insert["t_and_c_description"] = payload.t_and_c_description;
    }
    if (payload.t_and_c_upload) {
      data_to_insert["t_and_c_upload"] = payload.t_and_c_upload;
    }

    const bid = await prisma.bid.create({
      data: data_to_insert,
    });

    if (!bid)
      return {
        status: false,
        data: null,
        message: "Unable to create bid. Please try again.",
        functionname: "CreateBid",
      };

    await prisma.shop.update({
      where: {
        id: payload.shopId,
      },
      data: {
        status: "AUCTION",
      },
    });

    const getExemptfor = (value: string): ExemptFor => {
      console.log(value);
      switch (value) {
        case "forwomen":
          return ExemptFor.WOMEN;
        case "category":
          return ExemptFor.RESERVED;
        case "abled":
          return ExemptFor.DIFFERENTLY_ABLED;
        case "msme":
          return ExemptFor.MSME;
        default:
          return ExemptFor.WOMEN;
      }
    };

    if (payload.is_exemption) {
      let data_to_insert: any = {
        is_fees_exempt_allowed: payload.is_fees_exempt_allowed,
        is_emd_exempt_allowed: payload.is_emd_exempt_allowed,
        is_bg_exempt_allowed: payload.is_bg_exempt_allowed,
      };

      if (payload.is_fees_exempt_allowed) {
        data_to_insert["fees"] = payload.exempt_fees;
        data_to_insert["feesamount"] = payload.exempt_fees_amount;
      }

      if (payload.is_emd_exempt_allowed) {
        data_to_insert["emd"] = payload.exempt_emd;
        data_to_insert["emdamount"] = payload.exempt_emd_amount;
      }

      if (payload.is_bg_exempt_allowed) {
        data_to_insert["bg"] = payload.exempt_bg;
        data_to_insert["bgamount"] = payload.exempt_bg_amount;
      }

      for (let i = 0; i < payload.exemptfield.length; i++) {
        if (payload.is_fees_exempt_allowed) {
          data_to_insert["fees_for"] = getExemptfor(payload.exemptfield[i]);
        }
        if (payload.is_emd_exempt_allowed) {
          data_to_insert["emd_for"] = getExemptfor(payload.exemptfield[i]);
        }
        if (payload.is_bg_exempt_allowed) {
          data_to_insert["bg_for"] = getExemptfor(payload.exemptfield[i]);
        }

        await prisma.exempt.create({
          data: {
            bidId: bid.id,
            shopId: payload.shopId,
            ...data_to_insert,
            createdById: payload.createdById,
          },
        });
      }
    }

    return {
      status: true,
      data: bid,
      message: "Bid data get successfully",
      functionname: "CreateBid",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateBid",
    };
    return response;
  }
};

export default CreateBid;
