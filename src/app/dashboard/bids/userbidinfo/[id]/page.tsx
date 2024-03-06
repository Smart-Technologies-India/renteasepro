import UserBidInfoView from "./userbidinfo";

const UserBidsInfo = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return <UserBidInfoView bidid={id} />;
};

export default UserBidsInfo;
