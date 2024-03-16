import UserProfile from "./viewprofile";

const UserProfileDetails = async ({ params }: { params: any }) => {
  const userid: number = params.userid;
  const bidid: number = params.bidid;
  return <UserProfile userid={userid} bidid={bidid} />;
};

export default UserProfileDetails;
