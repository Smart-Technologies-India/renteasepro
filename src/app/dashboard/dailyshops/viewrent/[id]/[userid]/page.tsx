import GetProperty from "@/action/property/getproperty";
import CreateRentPage from "./createrentview";

const AddShop = async ({ params }: { params: any }) => {
  const rentid: number = parseInt(params.id.toString());
  const userid: number = parseInt(params.userid.toString());
  return <CreateRentPage rentid={rentid} userid={userid} />;
};

export default AddShop;
