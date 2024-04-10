import GetProperty from "@/action/property/getproperty";
import CreateRentPage from "./createrentview";

const AddShop = async ({ params }: { params: any }) => {
  const shopid: number = parseInt(params.id.toString());
  const userid: number = parseInt(params.userid.toString());
  const bidid: number = parseInt(params.bidid.toString());
  return <CreateRentPage shopid={shopid} userid={userid} bidid={bidid} />;
};

export default AddShop;
