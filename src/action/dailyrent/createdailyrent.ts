"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import {
  daily_rent,
  daily_rent_transact,
  DailyRentStatus,
} from "@prisma/client";

interface CreateDailyRentPayload {
  shopId: number;
  userId: number;
  createdById: number;
  event_amount: string;
  prep_day_amount: string;
  deposit_amount: string;
  handover_day_amount: string;
  event_from_date: string;
  event_to_date: string;
  event_reason: string;
  prep_day?: string;
  handover_day?: string;
  is_approved?: boolean;
  approvedById?: number;
  status: DailyRentStatus;
  company_name?: string;
  gst_no?: string;
}

function toUTCDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

const CreateDailyRent = async (
  payload: CreateDailyRentPayload
): Promise<ApiResponseType<daily_rent_transact | null>> => {
  try {
    // create all date array of payload
    let new_date: Date[] = [];
    if (payload.prep_day) {
      new_date.push(toUTCDate(payload.prep_day));
    }
    if (payload.handover_day) {
      new_date.push(toUTCDate(payload.handover_day));
    }

    // add event_from_date to event_to_date in new_date array
    let start_date = new Date(payload.event_from_date);
    let end_date = new Date(payload.event_to_date);

    while (start_date <= end_date) {
      new_date.push(toUTCDate(start_date.toISOString()));
      start_date.setDate(start_date.getDate() + 1);
    }

    const rentexist = await prisma.daily_rent.findFirst({
      where: {
        shopId: payload.shopId,
        is_cancel: false,
        OR: [
          {
            status: "COMPLETED",
          },
          {
            status: "DEPOSITDUE",
          },
          {
            status: "REFUNDDUE",
          },
          {
            status: "UPCOMING",
          },
        ],
      },
    });

    if (rentexist) {
      let rent_date: Date[] = [];
      if (rentexist.prep_day) {
        rent_date.push(rentexist.prep_day);
      }
      if (rentexist.handover_day) {
        rent_date.push(rentexist.handover_day);
      }

      // add event_from_date to event_to_date in new_date array
      let start_date = new Date(rentexist.event_from_date);
      let end_date = new Date(rentexist.event_to_date);

      while (start_date <= end_date) {
        rent_date.push(new Date(start_date));
        start_date.setDate(start_date.getDate() + 1);
      }

      // compare only date not time
      // let isExist = new_date.some((val) => rent_date.includes(val));

      // Extract only the date part in 'YYYY-MM-DD' format
      let new_date_strings = new_date.map(
        (date) => date.toISOString().split("T")[0]
      );
      let rent_date_strings = rent_date.map(
        (date) => date.toISOString().split("T")[0]
      );

      // Check if there is an overlap
      let isExist = new_date_strings.some((date) =>
        rent_date_strings.includes(date)
      );

      if (isExist) {
        return {
          status: false,
          data: null,
          message: "Daily rent already exist for this shop.",
          functionname: "CreateDailyRent",
        };
      }
    }

    const data_to_update: any = {
      shopId: payload.shopId,
      event_amount: payload.event_amount,
      prep_day_amount: payload.prep_day_amount,
      deposit_amount: payload.deposit_amount,
      handover_day_amount: payload.handover_day_amount,
      event_from_date: toUTCDate(payload.event_from_date),
      event_to_date: toUTCDate(payload.event_to_date),
      event_reason: payload.event_reason,
      userId: payload.userId,
      createdById: payload.createdById,

      status: payload.status,
    };

    if (payload.prep_day) {
      data_to_update["prep_day"] = toUTCDate(payload.prep_day);
    }

    if (payload.handover_day) {
      data_to_update["handover_day"] = toUTCDate(payload.handover_day);
    }

    if (payload.is_approved) {
      data_to_update["is_approved"] = payload.is_approved;
      data_to_update["approvedById"] = payload.approvedById;
    }

    if (payload.company_name) {
      data_to_update["company_name"] = payload.company_name;
    }

    if (payload.gst_no) {
      data_to_update["gst_no"] = payload.gst_no;
    }

    const rent_data = await prisma.daily_rent.create({
      data: data_to_update,
    });

    if (!rent_data) {
      return {
        status: false,
        data: null,
        message: "Unable to create daily rent. Please try again.",
        functionname: "CreateDailyRent",
      };
    }

    const gstnumber = await prisma.gstinvoice.findFirst({
      orderBy: { id: "desc" },
    });

    if (!gstnumber) {
      return {
        status: false,
        data: null,
        message:
          "Something Went wrong unable to get gst number. Please try again.",
        functionname: "PayDeposit",
      };
    }

    const update_gstnumber = await prisma.gstinvoice.update({
      where: { id: gstnumber.id },
      data: { number: gstnumber.number + 1 },
    });

    const create_rent_transaction = await prisma.daily_rent_transact.create({
      data: {
        gstinvoice: gstnumber.number + 1,
        rentId: rent_data.id,
        userId: payload.userId,
        createdById: payload.createdById,
        shopId: payload.shopId,
        status: "INACTIVE",
        amount: (
          parseInt(payload.event_amount) +
          (payload.handover_day ? parseInt(payload.handover_day_amount) : 0) +
          (payload.prep_day ? parseInt(payload.prep_day_amount) : 0)
        ).toFixed(2),
      },
    });

    if (!create_rent_transaction) {
      return {
        status: false,
        data: null,
        message: "Unable to create daily rent transaction. Please try again.",
        functionname: "CreateDailyRent",
      };
    }

    const create_deposit_rent_transaction =
      await prisma.daily_rent_transact.create({
        data: {
          rentId: rent_data.id,
          userId: payload.userId,
          createdById: payload.createdById,
          shopId: payload.shopId,
          status: "INACTIVE",
          amount: payload.deposit_amount,
        },
      });

    if (!create_deposit_rent_transaction) {
      return {
        status: false,
        data: null,
        message: "Unable to create deposit rent transaction. Please try again.",
        functionname: "CreateDailyRent",
      };
    }

    return {
      status: true,
      data: create_rent_transaction,
      message: "Daily rent created successfully",
      functionname: "CreateDailyRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateDailyRent",
    };
    return response;
  }
};

export default CreateDailyRent;
