"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { daily_property, property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreateDailyPropertyPayload {
  name: string;
  address: string;
  pincode: string;
  city: string;
  locality: string;
  contact_number: string;
  contact_person: string;
  total_shops: number;
  latitude: number;
  longitude: number;
  priority: number;
  creadtedById: number;
}

const CreateDailyProperty = async (
  payload: CreateDailyPropertyPayload
): Promise<ApiResponseType<daily_property | null>> => {
  try {
    const propertyExist = await prisma.daily_property.findFirst({
      where: {
        name: payload.name,
        latitude: payload.latitude,
        longitude: payload.longitude,
      },
    });

    if (propertyExist)
      return {
        status: false,
        data: null,
        message: "Property already exist.",
        functionname: "CreateDailyProperty",
      };

    const property = await prisma.daily_property.create({
      data: {
        name: payload.name,
        address: payload.address,
        pincode: payload.pincode,
        city: payload.city,
        locality: payload.locality,
        contact_number: payload.contact_number,
        contact_person: payload.contact_person,
        total_shops: payload.total_shops,
        latitude: payload.latitude,
        longitude: payload.longitude,
        createdById: payload.creadtedById,
        priority: payload.priority,
      },
    });

    if (!property)
      return {
        status: false,
        data: null,
        message: "Unable to create property. Please try again.",
        functionname: "CreateDailyProperty",
      };

    return {
      status: true,
      data: property,
      message: "Property data get successfully",
      functionname: "CreateDailyProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateDailyProperty",
    };
    return response;
  }
};

export default CreateDailyProperty;
