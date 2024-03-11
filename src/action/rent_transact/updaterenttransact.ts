"use server";

import { errorToString, formateDate } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent_transact } from "@prisma/client";

interface UpdateRentTrasactPayload {}

const UpdateRentTrasact = async (
  payload: UpdateRentTrasactPayload
): Promise<ApiResponseType<number | null>> => {
  try {
    // current date
    const new_date = new Date();

    // new date today + 20 day
    const new_date_n20 = new Date(
      new Date().setDate(new Date().getDate() + 20)
    );

    // curretn date today - 11 days
    const new_date_p11 = new Date(
      new Date().setDate(new Date().getDate() - 11)
    );

    // curretn date today - 29 days
    const new_date_p30 = new Date(
      new Date().setDate(new Date().getDate() - 29)
    );

    // now update the rent transact table according to the date if the date is greater than the current date then update the status to DUE and more then 11 then update the status to LATE and if the date is greater than 30 days then update the status to MONTHCROSS

    const rent_transact_response_due = await prisma.rent_transact.updateMany({
      where: {
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_n20,
        },
      },
      data: {
        status: "DUE",
      },
    });

    const rent_transact_response_late = await prisma.rent_transact.updateMany({
      where: {
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p11,
        },
      },
      data: {
        status: "LATE",
      },
    });

    const rent_transact_response_monthcross =
      await prisma.rent_transact.updateMany({
        where: {
          NOT: [{ status: "PAID" }],
          formonth: {
            lte: new_date_p30,
          },
        },
        data: {
          status: "MONTHCROSS",
        },
      });

    if (
      !rent_transact_response_due ||
      !rent_transact_response_late ||
      !rent_transact_response_monthcross
    )
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "UpdateRentTrasact",
      };

    return {
      status: true,
      data: null,
      message: "Rent Transact data get successfully",
      functionname: "UpdateRentTrasact",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateRentTrasact",
    };
    return response;
  }
};

export default UpdateRentTrasact;
