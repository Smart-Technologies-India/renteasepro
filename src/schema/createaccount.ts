import { AccountPaymentMode } from "@prisma/client";
import {
  Input,
  date,
  enum_,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  string,
} from "valibot";

const AccountSchema = object(
  {
    customername: string([minLength(1, "Please enter name.")]),
    customergst: string([minLength(1, "Please enter customer GST.")]),
    customerplaceofsupply: string([
      minLength(1, "Please select customer place of supply."),
    ]),
    hsn: string([minLength(1, "Please enter HSN.")]),
    cgst: string([minLength(1, "Please enter HSN.")]),
    ugst: string([minLength(1, "Please enter HSN.")]),
    igst: string([minLength(1, "Please enter HSN.")]),
    cgst_percent: string([
      minLength(1, "Please enter CGST/UGST/IGST Percent."),
    ]),
    accountCategoryId: number([minValue(1, "Please Select Category.")]),
    paymentmode: enum_(AccountPaymentMode, "Please select payment mode type."),
    transaction_date: date("Please select transaction date."),
    amount: number([minValue(1, "Please enter amount.")]),
  },
  []
);

type AccountForm = Input<typeof AccountSchema>;
export { AccountSchema, type AccountForm };
