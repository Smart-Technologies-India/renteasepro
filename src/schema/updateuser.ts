import { isContainSpace } from "@/utils/methods";
import {
  InferInput,
  check,
  email,
  maxLength,
  minLength,
  nullish,
  object,
  pipe,
  string,
} from "valibot";

const UpdateUserSchema = object({
  firstName: pipe(string(), minLength(1, "Please enter your First Name.")),
  lastName: pipe(string(), minLength(1, "Please enter your Last Name.")),
  contactone: pipe(
    string(),
    minLength(10, "Contact number should be 10 digits."),
    check(isContainSpace, "Contact number cannot contain space.")
  ),
  email: pipe(
    string(),
    minLength(1, "Please enter your email."),
    email("Please enter a valid email."),
    check(isContainSpace, "Email cannot contain space.")
  ),

  city: pipe(string(), minLength(1, "Please enter your city.")),
  address: pipe(string(), minLength(1, "Please enter your address.")),
  aadhar: pipe(
    string(),
    minLength(1, "Please enter your aadhar number."),
    maxLength(12, "Aadhar number should be 12 digits."),
    check(isContainSpace, "Aadhar number cannot contain space.")
  ),
  pan: nullish(
    string("Please enter your pan number."),
    "Pan number is optional."
  ),
  bankName: nullish(
    string("Please enter your bank name."),
    "Bank name is optional."
  ),
  bankAccountNumber: nullish(
    string("Please enter your bank account number."),
    "Bank account number is optional."
  ),
  ifscCode: nullish(
    string("Please enter your IFSC code."),
    "IFSC code is optional."
  ),
  // pan: pipe(
  //   string(),
  //   minLength(1, "Please enter your pan number."),
  //   maxLength(10, "Pan number should be 10 digits."),
  //   check(isContainSpace, "Pan number cannot contain space.")
  // ),
  // bankName: pipe(string(), minLength(1, "Please enter your bank name.")),
  // bankAccountNumber: pipe(
  //   string(),
  //   minLength(1, "Please enter your bank account number."),
  //   check(isContainSpace, "Bank account number cannot contain space.")
  // ),
  // ifscCode: pipe(
  //   string(),
  //   minLength(1, "Please enter your ifsc code."),
  //   check(isContainSpace, "IFSC code cannot contain space.")
  // ),
});

type UpdateUserForm = InferInput<typeof UpdateUserSchema>;
export { UpdateUserSchema, type UpdateUserForm };
