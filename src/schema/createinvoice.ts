import { AccountPaymentMode } from "@prisma/client";
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

const InvoiceSchema = object({
  customername: pipe(string(), minLength(1, "Please enter name.")),
  customergst: pipe(string(), minLength(1, "Please enter customer GST.")),
  customerplaceofsupply: pipe(
    string(),
    minLength(1, "Please select customer place of supply.")
  ),
  hsn: pipe(string(), minLength(1, "Please enter HSN.")),
  cgst: pipe(string(), minLength(1, "Please enter HSN.")),
  ugst: pipe(string(), minLength(1, "Please enter HSN.")),
  igst: pipe(string(), minLength(1, "Please enter HSN.")),
  cgst_percent: pipe(
    string(),
    minLength(1, "Please enter CGST/UGST/IGST Percent.")
  ),
  accountCategoryId: pipe(number(), minValue(1, "Please Select Category.")),
  paymentmode: enum_(AccountPaymentMode, "Please select payment mode type."),
  transaction_date: date("Please select transaction date."),
  amount: pipe(number(), minValue(1, "Please enter amount.")),
});

type InvoiceForm = InferInput<typeof InvoiceSchema>;
export { InvoiceSchema, type InvoiceForm };
