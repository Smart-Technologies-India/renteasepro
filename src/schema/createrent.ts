import { InferInput, date, minValue, number, object, pipe } from "valibot";

const CreateRentSchema = object({
  rent_amount: pipe(number(), minValue(1, "Please enter rent amount.")),
  rent_start_date: date("Please enter rent start date."),
  rent_end_date: date("Please enter rent start date."),
  due_date: pipe(number(), minValue(1, "Please select due date.")),
  userId: pipe(number(), minValue(1, "Please select user date.")),
});

type CreateRentForm = InferInput<typeof CreateRentSchema>;
export { CreateRentSchema, type CreateRentForm };
