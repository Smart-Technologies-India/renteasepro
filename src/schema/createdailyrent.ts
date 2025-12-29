import { InferInput, date, minValue, number, object, pipe, string } from "valibot";

const CreateDailyRentSchema = object({
  event_amount: string("Please enter event amount."),
  prep_day_amount: string("Please enter prep day amount."),
  handover_day_amount: string("Please enter handover amount."),
  deposit_amount: string("Please enter deposit amount."),
  event_from_date: date("Please enter rent start date."),
  event_to_date: date("Please enter rent start date."),
  userId: pipe(number(), minValue(1, "Please select user id.")),
  unitId: pipe(number(), minValue(1, "Please select unit id.")),
  event_reason: string("Please enter event reason."),
});

type CreateDailyRentForm = InferInput<typeof CreateDailyRentSchema>;
export { CreateDailyRentSchema, type CreateDailyRentForm };
