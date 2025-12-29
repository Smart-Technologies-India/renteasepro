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

const AccountSchema = object({
  customername: pipe(string(), minLength(1, "Please enter name.")),
  // customercontact: pipe(
  //   string(),
  //   minLength(1, "Please enter contact number."),
  //   maxLength(10, "Please enter valid contact number.")
  // ),
  accountCategoryId: pipe(number(), minValue(1, "Please Select Category.")),
  paymentmode: enum_(AccountPaymentMode, "Please select payment mode type."),
  transaction_date: date("Please select transaction date."),
  amount: pipe(string(), minLength(1, "Please enter amount.")),
  // transactionid: pipe(string(), minLength(1, "Please enter transactionid.")),
  // bankname: pipe(string(), minLength(1, "Please enter bank name.")),
  // remarks: pipe(string(), minLength(1, "Please enter remark.")),
});

type AccountForm = InferInput<typeof AccountSchema>;
export { AccountSchema, type AccountForm };
