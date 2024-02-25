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

const CreateShopSchema = object(
  {
    id: number([minValue(1, "Please select your property.")]),
    shopCategoryId: number([minValue(1, "Please Select shop category.")]),
    floor: enum_(Floors, "Please select floor."),
    shopNumber: string([minLength(1, "Please Enter shop number.")]),
    shopSize: string([minLength(1, "Please Enter shop size.")]),
  },
  [
    forward(
      custom((input) => input.shopCategoryId != 0, "Select Shop Category."),
      ["shopCategoryId"]
    ),
  ]
);

type CreateShopForm = Input<typeof CreateShopSchema>;
export { CreateShopSchema, type CreateShopForm };
