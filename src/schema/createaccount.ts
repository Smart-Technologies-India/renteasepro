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
    // customercontact: string([
    //   minLength(1, "Please enter contact number."),
    //   maxLength(10, "Please enter valid contact number."),
    // ]),
    accountCategoryId: number([minValue(1, "Please Select Category.")]),
    paymentmode: enum_(AccountPaymentMode, "Please select payment mode type."),
    transaction_date: date("Please select transaction date."),
    amount: number([minValue(1, "Please enter amount.")]),
    // transactionid: string([minLength(1, "Please enter transactionid.")]),
    // bankname: string([minLength(1, "Please enter bank name.")]),
    // remarks: string([minLength(1, "Please enter remark.")]),
  },
  []
);

type AccountForm = Input<typeof AccountSchema>;
export { AccountSchema, type AccountForm };