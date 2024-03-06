"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import { rent } from "@prisma/client";

interface CreateRentPayload {
  shopId: number;
  userId: number;
  createdById: number;
  rent_amount: number;
  rent_start_date: Date;
  rent_end_date: Date;
  due_date: number;
  rent_agrement_file?: string;
  chargeone?: number;
  chargetwo?: number;
  chargethree?: number;
}

const CreateRent = async (
  payload: CreateRentPayload
): Promise<ApiResponseType<rent | null>> => {
  try {
    const rentexist = await prisma.rent.findFirst({
      where: {
        shopId: payload.shopId,
        status: "ACTIVE",
      },
    });

    const data_to_update: any = {
      shopId: payload.shopId,
      rent_amount: payload.rent_amount,
      rent_start_date: payload.rent_start_date,
      rent_end_date: payload.rent_end_date,
      due_date: payload.due_date,
      userId: payload.userId,
      createdById: payload.createdById,
    };

    if (payload.rent_agrement_file) {
      data_to_update["rent_agrement_file"] = payload.rent_agrement_file;
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

    if (rentexist) {
      if (rentexist.rent_end_date < payload.rent_start_date) {
        const rent = await prisma.rent.create({
          data: data_to_update,
        });

        if (!rent)
          return {
            status: false,
            data: null,
            message: "Unable to create shop rent. Please try again.",
            functionname: "CreateRent",
          };

        await prisma.shop.update({
          where: {
            id: payload.shopId,
          },
          data: {
            status: "RENTED",
          },
        });

        return {
          status: true,
          data: rent,
          message: "Shop rent created successfully",
          functionname: "CreateRent",
        };
      } else {
        return {
          status: false,
          data: null,
          message: "Shop rent already exist for this shop. Please try again.",
          functionname: "CreateRent",
        };
      }
    } else {
      const rent = await prisma.rent.create({
        data: data_to_update,
      });

      await prisma.shop.update({
        where: {
          id: payload.shopId,
        },
        data: {
          status: "RENTED",
        },
      });

      if (!rent)
        return {
          status: false,
          data: null,
          message: "Unable to create shop rent. Please try again.",
          functionname: "CreateRent",
        };

      return {
        status: true,
        data: rent,
        message: "Shop rent created successfully",
        functionname: "CreateRent",
      };
    }
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

export default CreateRent;
