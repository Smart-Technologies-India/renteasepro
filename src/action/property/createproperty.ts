"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import { property } from "@prisma/client";
import prisma from "../../../prisma/database";

interface CreatePropertyPayload {
  name: string;
  address: string;
  pincode: string;
  city: string;
  locality: string;
  contact_number: string;
  contact_person: string;
  total_shops: number;
  total_floors: number;
  latitude: number;
  longitude: number;
  priority: number;
  creadtedById: number;
}

const CreateProperty = async (
  payload: CreatePropertyPayload
): Promise<ApiResponseType<property | null>> => {
  try {
    const property = await prisma.property.create({
      data: {
        name: payload.name,
        address: payload.address,
        pincode: payload.pincode,
        city: payload.city,
        locality: payload.locality,
        contact_number: payload.contact_number,
        contact_person: payload.contact_person,
        total_shops: payload.total_shops,
        total_floors: payload.total_floors,
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
        functionname: "CreateProperty",
      };

    return {
      status: true,
      data: property,
      message: "Property data get successfully",
      functionname: "CreateProperty",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateProperty",
    };
    return response;
  }
};

export default CreateProperty;
