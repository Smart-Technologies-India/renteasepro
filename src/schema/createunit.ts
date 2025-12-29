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

const CreateUnitSchema = pipe(
  object({
    id: pipe(number(), minValue(1, "Please select your property.")),
    shopCategoryId: pipe(number(), minValue(1, "Please Select shop category.")),
    name: pipe(string(), minLength(1, "Please Enter Unit name.")),
    capacity: pipe(number(), minValue(1, "Please Enter Unti Capacity.")),
    rate_per_day: pipe(string(), minLength(1, "Enter Rate per day.")),
    rate_prep_day: pipe(string(), minLength(1, "Enter Rate Prep Day.")),
    rate_handover_day: pipe(string(), minLength(1, "Enter rate handover day.")),
    deposit_per_day: pipe(string(), minLength(1, "Enter deposit per day.")),
    // shopNumber: pipe(string(), minLength(1, "Please Enter shop number.")),
    // shopSize: pipe(string(), minLength(1, "Please Enter shop size.")),
  }),
  forward(
    check((input) => input.shopCategoryId != 0, "Select Shop Category."),
    ["shopCategoryId"]
  )
);

type CreateUnitForm = InferInput<typeof CreateUnitSchema>;
export { CreateUnitSchema, type CreateUnitForm };
