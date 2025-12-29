import { Floors } from "@prisma/client";
import {
  InferInput,
  check,
  enum_,
  forward,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
} from "valibot";

const CreateShopSchema = pipe(
  object({
    id: pipe(number(), minValue(1, "Please select your property.")),
    shopCategoryId: pipe(number(), minValue(1, "Please Select shop category.")),
    floor: enum_(Floors, "Please select floor."),
    shopNumber: pipe(string(), minLength(1, "Please Enter shop number.")),
    shopSize: pipe(string(), minLength(1, "Please Enter shop size.")),
  }),
  forward(
    check((input) => input.shopCategoryId != 0, "Select Shop Category."),
    ["shopCategoryId"]
  )
);

type CreateShopForm = InferInput<typeof CreateShopSchema>;
export { CreateShopSchema, type CreateShopForm };
