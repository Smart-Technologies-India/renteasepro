import ShopBidHistoryView from "./shopbidhistory";

const ShopBidHistory = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <ShopBidHistoryView id={id} />;
};

export default ShopBidHistory;
