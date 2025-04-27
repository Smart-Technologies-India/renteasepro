import GetProperty from "@/action/property/getproperty";
import CreateDateChangePage from "./createdatechange";

const AddShop = async ({ params }: { params: any }) => {
  const rentid: number = parseInt(params.rentid.toString());
  const unitid: number = parseInt(params.unitid.toString());
  return <CreateDateChangePage rentid={rentid} unitid={unitid} />;
};

export default AddShop;
