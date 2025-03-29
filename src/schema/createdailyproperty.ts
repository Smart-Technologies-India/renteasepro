import {
  Input,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  string,
} from "valibot";

const CreateDailyPropertySchema = object(
  {
    name: string([minLength(1, "Please enter yourname.")]),
    address: string([minLength(1, "Please enter address.")]),
    pincode: string([
      minLength(1, "Please enter pin."),
      maxLength(6, "Please enter valid pin."),
    ]),
    city: string([minLength(1, "Please enter city.")]),
    locality: string([minLength(1, "Please enter locality.")]),
    contact_number: string([
      minLength(1, "Please enter contact number."),
      maxLength(10, "Please enter valid contact number."),
    ]),
    contact_person: string([minLength(1, "Please enter contact person name.")]),
    total_shops: number([minValue(1, "Please enter total shops.")]),
    latitude: number([minValue(1, "Please enter latitude.")]),
    longitude: number([minValue(1, "Please enter longitude.")]),
    priority: number([minValue(1, "Please enter priority.")]),
  },
  []
);

type CreateDailyPropertyForm = Input<typeof CreateDailyPropertySchema>;
export { CreateDailyPropertySchema, type CreateDailyPropertyForm };
