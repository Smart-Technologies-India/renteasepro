import { PercentageType, RefundType } from "@prisma/client";
import {
  Input,
  date,
  enum_,
  minLength,
  minValue,
  number,
  object,
  string,
} from "valibot";

const CreateBidSchema = object({
  title: string([minLength(1, "Please enter bid title.")]),
  min_bid_amount: number([minValue(1, "Please enter min bid amount.")]),
  bidincrementamount: enum_(
    PercentageType,
    "Please enter bid increment amount type."
  ),
  min_bid_increment: number([minValue(1, "Please enter min bid increment.")]),

  fees_amount: number([minValue(0, "Please enter bid fees amount.")]),
  fees: enum_(PercentageType, "Please enter bid fees percentage type."),
  fees_refundable: enum_(RefundType, "Please enter bid fees refund type."),

  emd_amount: number([minValue(0, "Please enter bid emd amount.")]),
  emd: enum_(PercentageType, "Please enter bid emd percentage type."),
  emd_refundable: enum_(RefundType, "Please enter bid emd refund type."),

  bg_amount: number([minValue(0, "Please enter bid bg amount.")]),
  bg: enum_(PercentageType, "Please enter bid bg percentage type."),
  bg_refundable: enum_(RefundType, "Please enter bid bg refund type."),

  startTime: string([minLength(1, "Please start time.")]),
  endTime: string([minLength(1, "Please end time.")]),

  bidstartdate: date("Please enter bid start date."),
  bidenddate: date("Please enter bid end date."),
  biddeclarationdate: date("Please enter bid declaration date."),
});

type CreateBidForm = Input<typeof CreateBidSchema>;
export { CreateBidSchema, type CreateBidForm };
