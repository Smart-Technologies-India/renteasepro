import { isContainSpace } from "@/utils/methods";
import { Input, custom, minLength, object, string } from "valibot";

const LoginSchema = object({
  contactone: string([
    minLength(10, "Contact number should be 10 digits."),
    custom(isContainSpace, "Contact number cannot contain space."),
  ]),
  password: string([
    minLength(1, "Please enter your password."),
    custom(isContainSpace, "Password cannot contain space."),
  ]),
});

type LoginForm = Input<typeof LoginSchema>;
export { LoginSchema, type LoginForm };
