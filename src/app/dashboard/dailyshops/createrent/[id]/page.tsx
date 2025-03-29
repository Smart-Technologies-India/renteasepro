import GetProperty from "@/action/property/getproperty";
import CreateRentPage from "./createrentview";

const AddShop = async ({ params }: { params: any }) => {
  const shopid: number = parseInt(params.id.toString());

  return <CreateRentPage shopid={shopid} />;
};

export default AddShop;
