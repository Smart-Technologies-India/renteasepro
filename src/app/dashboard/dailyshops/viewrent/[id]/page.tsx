import GetProperty from "@/action/property/getproperty";
import CreateRentPage from "./createrentview";

const AddShop = async ({ params }: { params: any }) => {
  const rentid: number = parseInt(params.id.toString());

  return <CreateRentPage shopid={rentid} />;
};

export default AddShop;
