import { isContainSpace } from "@/utils/methods";
import {
  InferInput,
  check,
  maxLength,
  minLength,
  object,
  pipe,
  string,
} from "valibot";

const CreateUserSchema = object({
  username: pipe(
    string(),
    minLength(1, "Please enter your username.")
    // check(isContainSpace, "Username cannot contain space.")
  ),
  contactone: pipe(
    string(),
    minLength(1, "Please enter contact number."),
    maxLength(10, "Please enter valid contact number.")
  ),
  // password: pipe(
  //   string(),
  //   minLength(1, "Please enter your password."),
  //   minLength(8, "Your password must have 8 characters or more."),
  //   regex(/^(?=.*[0-9]).*$/, "Your password must have at least one number."),
  //   regex(
  //     /^(?=.*[!@#$%^&*]).*$/,
  //     "Your password must have at least one special character."
  //   ),
  //   regex(
  //     /^(?=.*[A-Z]).*$/,
  //     "Your password must have at least one uppercase."
  //   ),
  //   regex(
  //     /^(?=.*[a-z]).*$/,
  //     "Your password must have at least one lowercase."
  //   ),
  //   check(isContainSpace, "Password cannot contain space.")
  // ),
  // repassword: pipe(
  //   string(),
  //   minLength(1, "Please enter your re-password."),
  //   minLength(8, "Your re-password must have 8 characters or more."),
  //   regex(
  //     /^(?=.*[0-9]).*$/,
  //     "Your re-password must have at least one number."
  //   ),
  //   regex(
  //     /^(?=.*[!@#$%^&*]).*$/,
  //     "Your re-password must have at least one special character."
  //   ),
  //   regex(
  //     /^(?=.*[A-Z]).*$/,
  //     "Your re-password must have at least one uppercase."
  //   ),
  //   regex(
  //     /^(?=.*[a-z]).*$/,
  //     "Your re-password must have at least one lowercase."
  //   ),
  //   check(isContainSpace, "Re-password cannot contain space.")
  // ),
  role: pipe(
    string(),
    minLength(1, "Please elect your role."),
    check(isContainSpace, "Role cannot contain space.")
  ),
});

type CreateUserForm = InferInput<typeof CreateUserSchema>;
export { CreateUserSchema, type CreateUserForm };
