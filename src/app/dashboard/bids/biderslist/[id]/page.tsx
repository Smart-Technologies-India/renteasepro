import BidHistoryView from "./bidlistview";

const UserBidList = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return <BidHistoryView id={id} />;
};

export default UserBidList;
