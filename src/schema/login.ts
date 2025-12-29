import { isContainSpace } from "@/utils/methods";
import { InferInput, check, minLength, object, pipe, string } from "valibot";

const LoginSchema = object({
  contactone: pipe(
    string(),
    minLength(10, "Contact number should be 10 digits."),
    check(isContainSpace, "Contact number cannot contain space.")
  ),
  password: pipe(
    string(),
    minLength(1, "Please enter your password."),
    check(isContainSpace, "Password cannot contain space.")
  ),
});

type LoginForm = InferInput<typeof LoginSchema>;
export { LoginSchema, type LoginForm };
