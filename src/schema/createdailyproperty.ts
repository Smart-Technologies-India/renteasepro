import {
  InferInput,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
} from "valibot";

const CreateDailyPropertySchema = object({
  name: pipe(string(), minLength(1, "Please enter yourname.")),
  address: pipe(string(), minLength(1, "Please enter address.")),
  pincode: pipe(
    string(),
    minLength(1, "Please enter pin."),
    maxLength(6, "Please enter valid pin.")
  ),
  city: pipe(string(), minLength(1, "Please enter city.")),
  locality: pipe(string(), minLength(1, "Please enter locality.")),
  contact_number: pipe(
    string(),
    minLength(1, "Please enter contact number."),
    maxLength(10, "Please enter valid contact number.")
  ),
  contact_person: pipe(string(), minLength(1, "Please enter contact person name.")),
  total_shops: pipe(number(), minValue(1, "Please enter total shops.")),
  latitude: pipe(number(), minValue(1, "Please enter latitude.")),
  longitude: pipe(number(), minValue(1, "Please enter longitude.")),
  priority: pipe(number(), minValue(1, "Please enter priority.")),
});

type CreateDailyPropertyForm = InferInput<typeof CreateDailyPropertySchema>;
export { CreateDailyPropertySchema, type CreateDailyPropertyForm };
