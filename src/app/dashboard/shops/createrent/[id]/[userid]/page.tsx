import GetProperty from "@/action/property/getproperty";
import CreateRentPage from "./createrentview";

const AddShop = async ({ params }: { params: any }) => {
  const shopid: number = parseInt(params.id.toString());
  const userid: number = parseInt(params.userid.toString());
  return <CreateRentPage shopid={shopid} userid={userid} />;
};

export default AddShop;
