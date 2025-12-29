import { PercentageType, RefundType } from "@prisma/client";
import {
  InferInput,
  date,
  enum_,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
} from "valibot";

const CreateBidSchema = object({
  title: pipe(string(), minLength(1, "Please enter bid title.")),
  min_bid_amount: pipe(number(), minValue(1, "Please enter min bid amount.")),
  bidincrementamount: enum_(
    PercentageType,
    "Please enter bid increment amount type."
  ),
  min_bid_increment: pipe(number(), minValue(1, "Please enter min bid increment.")),

  fees_amount: pipe(number(), minValue(0, "Please enter bid fees amount.")),
  fees: enum_(PercentageType, "Please enter bid fees percentage type."),
  fees_refundable: enum_(RefundType, "Please enter bid fees refund type."),

  emd_amount: pipe(number(), minValue(0, "Please enter bid EMD amount.")),
  emd: enum_(PercentageType, "Please enter bid EMD percentage type."),
  emd_refundable: enum_(RefundType, "Please enter bid EMD refund type."),

  bg_amount: pipe(number(), minValue(0, "Please enter bid BG amount.")),
  bg: enum_(PercentageType, "Please enter bid BG percentage type."),
  bg_refundable: enum_(RefundType, "Please enter bid BG refund type."),

  startTime: pipe(string(), minLength(1, "Please start time.")),
  endTime: pipe(string(), minLength(1, "Please end time.")),

  bidstartdate: date("Please enter bid start date."),
  bidenddate: date("Please enter bid end date."),
  biddeclarationdate: date("Please enter bid declaration date."),
});

type CreateBidForm = InferInput<typeof CreateBidSchema>;
export { CreateBidSchema, type CreateBidForm };
