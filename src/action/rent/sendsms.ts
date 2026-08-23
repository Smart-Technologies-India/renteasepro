"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import axios from "axios";

interface SendSmsPayload {
  rentId: number;
  contact: string;
  shopCategoryName: string;
  propertyName: string;
  amount: string;
}

interface RentTransactData {
  formonth: Date;
  status: string;
}

const SendSms = async (
  payload: SendSmsPayload,
): Promise<ApiResponseType<null>> => {
  try {
    // Get rent transact details for pending rent information
    const rentTransact = await prisma.rent_transact.findMany({
      where: {
        rentId: payload.rentId,
        status: "DUE",
      },
      orderBy: {
        formonth: "asc",
      },
    });

    if (!rentTransact || rentTransact.length === 0) {
      return {
        status: false,
        data: null,
        message: "No pending rent found for this rent ID.",
        functionname: "SendSms",
      };
    }

    // Format pending rent details with months
    const startMonth = new Date(rentTransact[0].formonth);
    const endMonth = new Date(rentTransact[rentTransact.length - 1].formonth);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const startMonthName = monthNames[startMonth.getMonth()];
    const endMonthName = monthNames[endMonth.getMonth()];
    const startYear = startMonth.getFullYear();
    const endYear = endMonth.getFullYear();

    const monthCount = rentTransact.length;
    const periodString =
      startYear === endYear
        ? `${startMonthName} to ${endMonthName}-${endYear}`
        : `${startMonthName}-${startYear} to ${endMonthName}-${endYear}`;

    // Build rent amount with month count
    const rentAmount = `${monthCount} Month${monthCount > 1 ? "s" : ""} (${periodString})`;

    // Construct SMS message using the template
    // Template: "Rent payment for {var} at {var} is due. Please ensure prompt payment through the portal. Thank you. -DNH PDA."
    // Example: "Rent payment for (68526- (6 Months) Mar to Jul-2026) at (S-1) at (Daman Ganga River Front) is due..."

    const getshortname = (name: string): string => {
      // Use includes/pattern matching instead of exact equality for more flexibility
      if (name.includes("Cafeteria") && name.includes("Phase - I")) {
        return "Game Zone - I";
      } else if (name.includes("Game Zone") && name.includes("Phase-II")) {
        return "Game Zone - II";
      } else if (name.includes("Daman") && name.includes("Ganga")) {
        return "DG River Front";
      } else {
        return name;
      }
    };

    const address =
      "Shop " +
      payload.shopCategoryName +
      " at " +
      getshortname(payload.propertyName);

    const smsMessage = `Rent payment for ${payload.amount} at ${address} is due. Please ensure prompt payment through the portal. Thank you. -DNH PDA.`;

    // URL encode the message
    const encodedMessage = encodeURIComponent(smsMessage);

    // Send SMS using the Arihant SMS API
    const response = await axios.get(
      `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=${encodedMessage}&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`,
    );
    // Check if SMS was sent successfully
    if (
      response.data &&
      response.data.Data &&
      response.data.Data[0] &&
      response.data.Data[0].MessageErrorDescription === "Success"
    ) {
      return {
        status: true,
        data: null,
        message: "SMS sent successfully",
        functionname: "SendSms",
      };
    }

    return {
      status: false,
      data: null,
      message:
        response.data?.Data?.[0]?.MessageErrorDescription ||
        "Failed to send SMS. Please try again.",
      functionname: "SendSms",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "SendSms",
    };
    return response;
  }
};

export default SendSms;
