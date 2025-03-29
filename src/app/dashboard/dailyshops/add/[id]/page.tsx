import GetDailyProperty from "@/action/daily_property/getdailyproperty";
import AddPropertyPage from "./addshop";

const AddShop = async ({ params }: { params: any }) => {
  const id: number = parseInt(params.id.toString());

  const getProperty = await GetDailyProperty({ id: id });

  return (
    <AddPropertyPage
      id={getProperty.data!.id}
      name={getProperty.data?.name ?? ""}
    />
  );
};

export default AddShop;
