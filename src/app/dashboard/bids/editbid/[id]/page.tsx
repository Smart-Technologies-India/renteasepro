import GetProperty from "@/action/property/getproperty";
import UpdateBidPage from "./updatebidview";

const AddShop = async ({ params }: { params: any }) => {
  const bidid: number = parseInt(params.id.toString());

  return (
    <UpdateBidPage bidid={bidid} uploadurl={process.env.UPLOAD_LINK ?? ""} />
  );
};

export default AddShop;
