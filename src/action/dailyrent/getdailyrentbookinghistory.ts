"use server";

import { ApiResponseType } from "@/models/response";
import { errorToString } from "@/utils/methods";
import {
  DailyRentStatus,
  daily_rent,
  daily_rent_transact,
  user,
} from "@prisma/client";
import prisma from "../../../prisma/database";

type BookingHistorySortBy =
  | "createdAt"
  | "event_from_date"
  | "event_to_date"
  | "status"
  | "event_amount";

type BookingHistorySortOrder = "asc" | "desc";

interface GetDailyRentBookingHistoryPayload {
  id: number;
  search?: string;
  status?: DailyRentStatus;
  page?: number;
  pageSize?: number;
  sortBy?: BookingHistorySortBy;
  sortOrder?: BookingHistorySortOrder;
}

type BookingHistoryRow = daily_rent & {
  user: user;
  rent_transact: daily_rent_transact[];
};

interface GetDailyRentBookingHistoryResponse {
  items: BookingHistoryRow[];
  total: number;
  page: number;
  pageSize: number;
}

const GetDailyRentBookingHistory = async (
  payload: GetDailyRentBookingHistoryPayload
): Promise<ApiResponseType<GetDailyRentBookingHistoryResponse | null>> => {
  try {
    const page = Math.max(1, payload.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, payload.pageSize ?? 10));
    const skip = (page - 1) * pageSize;

    const whereClause: {
      shopId: number;
      deletedAt: null;
      deletedBy: null;
      status?: DailyRentStatus | { not: DailyRentStatus };
      OR?: {
        user: {
          firstName?: { contains: string };
          lastName?: { contains: string };
          contactone?: { contains: string };
        };
      }[];
    } = {
      shopId: parseInt(payload.id.toString() ?? "0"),
      deletedAt: null,
      deletedBy: null,
      status: {
        not: "NONE",
      },
    };

    if (payload.status) {
      whereClause.status = payload.status;
    }

    const search = payload.search?.trim();
    if (search) {
      whereClause.OR = [
        {
          user: {
            firstName: {
              contains: search,
            },
          },
        },
        {
          user: {
            lastName: {
              contains: search,
            },
          },
        },
        {
          user: {
            contactone: {
              contains: search,
            },
          },
        },
      ];
    }

    const sortableFields: BookingHistorySortBy[] = [
      "createdAt",
      "event_from_date",
      "event_to_date",
      "status",
      "event_amount",
    ];

    const sortBy = sortableFields.includes(payload.sortBy ?? "createdAt")
      ? (payload.sortBy ?? "createdAt")
      : "createdAt";

    const sortOrder: BookingHistorySortOrder =
      payload.sortOrder === "asc" ? "asc" : "desc";

    const [items, total] = await prisma.$transaction([
      prisma.daily_rent.findMany({
        where: whereClause,
        include: {
          rent_transact: true,
          user: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.daily_rent.count({
        where: whereClause,
      }),
    ]);

    return {
      status: true,
      data: {
        items,
        total,
        page,
        pageSize,
      },
      message: "Rent data fetched successfully",
      functionname: "GetDailyRentBookingHistory",
    };
  } catch (e) {
    return {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetDailyRentBookingHistory",
    };
  }
};

export default GetDailyRentBookingHistory;
