import GetProperty from "@/action/property/getproperty";
import CreateBidPage from "./createbidview";

const AddShop = async ({ params }: { params: any }) => {
  const shopid: number = parseInt(params.id.toString());

  return (
    <CreateBidPage shopid={shopid} uploadurl={process.env.UPLOAD_LINK ?? ""} />
  );
};

export default AddShop;
