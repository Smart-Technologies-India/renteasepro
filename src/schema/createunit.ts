import { Floors } from "@prisma/client";
import {
  Input,
  custom,
  enum_,
  forward,
  minLength,
  minValue,
  number,
  object,
  string,
} from "valibot";

const CreateUnitSchema = object(
  {
    id: number([minValue(1, "Please select your property.")]),
    shopCategoryId: number([minValue(1, "Please Select shop category.")]),
    name: string([minLength(1, "Please Enter Unit name.")]),
    capacity: number([minValue(1, "Please Enter Unti Capacity.")]),
    rate_per_day: string([minLength(1, "Enter Rate per day.")]),
    rate_prep_day: string([minLength(1, "Enter Rate Prep Day.")]),
    rate_handover_day: string([minLength(1, "Enter rate handover day.")]),
    deposit_per_day: string([minLength(1, "Enter deposit per day.")]),
    // shopNumber: string([minLength(1, "Please Enter shop number.")]),
    // shopSize: string([minLength(1, "Please Enter shop size.")]),
  },
  [
    forward(
      custom((input) => input.shopCategoryId != 0, "Select Shop Category."),
      ["shopCategoryId"]
    ),
  ]
);

type CreateUnitForm = Input<typeof CreateUnitSchema>;
export { CreateUnitSchema, type CreateUnitForm };
