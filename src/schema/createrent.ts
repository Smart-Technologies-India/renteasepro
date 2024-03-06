import { Input, date, minValue, number, object } from "valibot";

const CreateRentSchema = object({
  rent_amount: number([minValue(1, "Please enter rent amount.")]),
  rent_start_date: date("Please enter rent start date."),
  rent_end_date: date("Please enter rent start date."),
  due_date: number([minValue(1, "Please select due date.")]),
  userId: number([minValue(1, "Please slect user date.")]),
});

type CreateRentForm = Input<typeof CreateRentSchema>;
export { CreateRentSchema, type CreateRentForm };
