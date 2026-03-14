"use client";
import { getAuthenticatedUserId } from "@/action/auth/getuserid";
import GetDailyRentBookingHistory from "@/action/dailyrent/getdailyrentbookinghistory";
import BackButton from "@/components/backbutton";
import { FluentMdl2Home } from "@/components/icons";
import { formateDate, decryptURLData, encryptURLData } from "@/utils/methods";
import {
  DailyRentStatus,
  daily_rent,
  daily_rent_transact,
  user,
} from "@prisma/client";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type BookingHistoryRow = daily_rent & {
  user: user;
  rent_transact: daily_rent_transact[];
};

type SortBy = "createdAt" | "event_from_date" | "event_to_date" | "status";
type SortOrder = "asc" | "desc";

const ShopBidHistoryView = () => {
  const router = useRouter();
  const param = useParams();
  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [dailyrent, setDailyRent] = useState<BookingHistoryRow[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [searchInput, setSearchInput] = useState<string>("");
  const [appliedSearch, setAppliedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | DailyRentStatus>(
    "ALL"
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const statusOptions: Array<{ label: string; value: "ALL" | DailyRentStatus }> =
    [
      { label: "All", value: "ALL" },
      { label: "Deposit Due", value: "DEPOSITDUE" },
      { label: "Upcoming", value: "UPCOMING" },
      { label: "Refund Due", value: "REFUNDDUE" },
      { label: "Completed", value: "COMPLETED" },
      { label: "Cancelled", value: "CANCELLED" },
      { label: "User Cancelled", value: "USERCANCELLED" },
      { label: "Failed", value: "FAILED" },
      { label: "None", value: "NONE" },
    ];

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const authResponse = await getAuthenticatedUserId();
      if (!authResponse.status) {
        toast.error(authResponse.message);
        return router.push("/login");
      }

      setLoading(false);
    };
    init();
  }, [router]);

  useEffect(() => {
    const loadRent = async () => {
      if (!Number.isFinite(id) || id <= 0) return;
      setFetching(true);

      const dailyrent_response = await GetDailyRentBookingHistory({
        id,
        search: appliedSearch.trim() ? appliedSearch.trim() : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
      });

      if (dailyrent_response.status && dailyrent_response.data) {
        setDailyRent(dailyrent_response.data.items);
        setTotalRecords(dailyrent_response.data.total);
      } else {
        setDailyRent([]);
        setTotalRecords(0);
        if (!dailyrent_response.status) {
          toast.error(dailyrent_response.message);
        }
      }

      setFetching(false);
    };

    loadRent();
  }, [id, appliedSearch, statusFilter, currentPage, pageSize, sortBy, sortOrder]);

  const totalAmount = (rentdata: BookingHistoryRow) =>
    parseInt(rentdata.deposit_amount) +
    parseInt(rentdata.event_amount) +
    (rentdata.handover_day ? parseInt(rentdata.handover_day_amount ?? "0") : 0) +
    (rentdata.prep_day_amount ? parseInt(rentdata.prep_day_amount ?? "0") : 0);

  const columns: ColumnsType<BookingHistoryRow> = useMemo(
    () => [
      {
        title: "Sr No.",
        key: "srno",
        width: 80,
        render: (_value, _record, index) =>
          (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: "Name",
        key: "name",
        render: (_value, record) =>
          `${record.user.firstName} ${record.user.lastName}`,
      },
      {
        title: "Contact",
        dataIndex: ["user", "contactone"],
        key: "contact",
      },
      {
        title: "Start Date",
        dataIndex: "event_from_date",
        key: "event_from_date",
        sorter: true,
        sortOrder:
          sortBy === "event_from_date"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (value) => formateDate(new Date(value)),
      },
      {
        title: "End Date",
        dataIndex: "event_to_date",
        key: "event_to_date",
        sorter: true,
        sortOrder:
          sortBy === "event_to_date"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (value) => formateDate(new Date(value)),
      },
      {
        title: "Total Amount",
        key: "total_amount",
        render: (_value, record) => totalAmount(record),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        sortOrder:
          sortBy === "status"
            ? sortOrder === "asc"
              ? "ascend"
              : "descend"
            : null,
        render: (status: DailyRentStatus) => {
          const colorMap: Record<DailyRentStatus, string> = {
            NONE: "default",
            DEPOSITDUE: "gold",
            UPCOMING: "blue",
            REFUNDDUE: "orange",
            COMPLETED: "green",
            CANCELLED: "red",
            USERCANCELLED: "volcano",
            FAILED: "magenta",
          };

          return <Tag color={colorMap[status]}>{status}</Tag>;
        },
      },
      {
        title: "Action",
        key: "action",
        align: "right",
        render: (_value, record) => (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              router.push(
                `/dashboard/dailyshops/viewrent/${encryptURLData(record.id.toString())}/${encryptURLData(record.user.id.toString())}`
              );
            }}
          >
            View
          </Button>
        ),
      },
    ],
    [currentPage, pageSize, sortBy, sortOrder, router]
  );

  const onTableChange: TableProps<BookingHistoryRow>["onChange"] = (
    paginationConfig,
    _filters,
    sorter
  ) => {
    if (!paginationConfig) return;

    setCurrentPage(paginationConfig.current ?? 1);
    setPageSize(paginationConfig.pageSize ?? 10);

    if (sorter && !Array.isArray(sorter) && sorter.field) {
      const sortField = sorter.field as SortBy;
      const allowedSortFields: SortBy[] = [
        "createdAt",
        "event_from_date",
        "event_to_date",
        "status",
      ];

      if (allowedSortFields.includes(sortField)) {
        setSortBy(sortField);
        setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
      }
    }
  };

  const applySearch = () => {
    setCurrentPage(1);
    setAppliedSearch(searchInput);
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <div className="p-6">
        <div className="flex gap-4 items-center">
          <BackButton />
          <FluentMdl2Home className="text-xl" />
          <p className="text-xl text-gray-600">Unit Booking History</p>
          <div className="grow"></div>
          <Space wrap>
            <Input.Search
              placeholder="Search by name or contact"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={applySearch}
              allowClear
              style={{ width: 260 }}
            />
            <Select
              value={statusFilter}
              style={{ width: 180 }}
              options={statusOptions}
              onChange={(value) => {
                setCurrentPage(1);
                setStatusFilter(value);
              }}
            />
          </Space>
        </div>

        {dailyrent.length == 0 && !isFetching ? (
          <p className="text-sm mt-4 mb-2">No Rent History found.</p>
        ) : (
          <Table<BookingHistoryRow>
            rowKey="id"
            className="mt-4"
            loading={isFetching}
            columns={columns}
            dataSource={dailyrent}
            pagination={{
              current: currentPage,
              pageSize,
              total: totalRecords,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total) => `Total ${total} records`,
            }}
            onChange={onTableChange}
          />
        )}
      </div>
    </>
  );
};

export default ShopBidHistoryView;
