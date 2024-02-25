import GetProperty from "@/action/property/getproperty";
import AddPropertyPage from "./addshop";

const AddShop = async ({ params }: { params: any }) => {
  const id: number = parseInt(params.id.toString());

  const getProperty = await GetProperty({ id: id });

  return (
    <AddPropertyPage
      id={getProperty.data!.id}
      name={getProperty.data?.name ?? ""}
    />
  );
};

export default AddShop;
