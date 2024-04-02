"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent } from "@prisma/client";

interface EditRentPayload {
  id: number;
  createdById: number;
  userId: number;
  rent_amount: number;
  due_date: number;
  chargeone?: number;
  chargetwo?: number;
  chargethree?: number;
}

const EditRent = async (
  payload: EditRentPayload
): Promise<ApiResponseType<rent | null>> => {
  try {
    const rentexist = await prisma.rent.findFirst({
      where: {
        id: parseInt(payload.id.toString() ?? "0"),
        status: "RUNNING",
      },
    });

    if (!rentexist) {
      return {
        status: false,
        data: null,
        message: "Rent not found",
        functionname: "EditRent",
      };
    }

    const data_to_update: any = {
      createdById: payload.createdById,
    };

    if (payload.userId) {
      data_to_update["userId"] = payload.userId;
    }

    if (payload.due_date) {
      data_to_update["due_date"] = payload.due_date;
    }

    if (payload.rent_amount) {
      data_to_update["rent_amount"] = payload.rent_amount;
    }
    if (payload.chargeone) {
      data_to_update["chargeone"] = payload.chargeone;
    }
    if (payload.chargetwo) {
      data_to_update["chargetwo"] = payload.chargetwo;
    }
    if (payload.chargethree) {
      data_to_update["chargethree"] = payload.chargethree;
    }

    const rent = await prisma.rent.update({
      where: {
        id: rentexist.id,
      },
      data: data_to_update,
    });

    if (!rent) {
      return {
        status: false,
        data: null,
        message: "Unable to update rent. Please try again.",
        functionname: "EditRent",
      };
    }

    if (payload.userId != rent.userId) {
      const updaterentpayment = await prisma.rent_transact.updateMany({
        where: {
          rentId: rentexist.id,
        },
        data: {
          userId: payload.userId,
        },
      });

      if (!updaterentpayment) {
        return {
          status: false,
          data: null,
          message: "Unable to update rent. Please try again.",
          functionname: "EditRent",
        };
      }
    }

    return {
      status: true,
      data: rent,
      message: "Rent updated successfully",
      functionname: "EditRent",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateRent",
    };
    return response;
  }
};

export default EditRent;
