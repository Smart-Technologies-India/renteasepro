import { isContainSpace } from "@/utils/methods";
import {
  Input,
  custom,
  email,
  maxLength,
  minLength,
  object,
  string,
} from "valibot";

const UpdateUserSchema = object({
  firstName: string([minLength(1, "Please enter your First Name.")]),
  lastName: string([minLength(1, "Please enter your Last Name.")]),
  contactone: string([
    minLength(10, "Contact number should be 10 digits."),
    custom(isContainSpace, "Contact number cannot contain space."),
  ]),
  contacttwo: string([
    minLength(10, "Second contact number should be 10 digits."),
    custom(isContainSpace, "Second contact number cannot contain space."),
  ]),
  email: string([
    minLength(1, "Please enter your email."),
    email("Please enter a valid email."),
    custom(isContainSpace, "Email cannot contain space."),
  ]),

  city: string([minLength(1, "Please enter your city.")]),
  address: string([minLength(1, "Please enter your address.")]),
  aadhar: string([
    minLength(1, "Please enter your aadhar number."),
    maxLength(12, "Aadhar number should be 12 digits."),
    custom(isContainSpace, "Aadhar number cannot contain space."),
  ]),
  pan: string([
    minLength(1, "Please enter your pan number."),
    maxLength(10, "Pan number should be 10 digits."),
    custom(isContainSpace, "Pan number cannot contain space."),
  ]),
  bankName: string([minLength(1, "Please enter your bank name.")]),
  bankAccountNumber: string([
    minLength(1, "Please enter your bank account number."),
    custom(isContainSpace, "Bank account number cannot contain space."),
  ]),
  ifscCode: string([
    minLength(1, "Please enter your ifsc code."),
    custom(isContainSpace, "IFSC code cannot contain space."),
  ]),
});

type UpdateUserForm = Input<typeof UpdateUserSchema>;
export { UpdateUserSchema, type UpdateUserForm };
