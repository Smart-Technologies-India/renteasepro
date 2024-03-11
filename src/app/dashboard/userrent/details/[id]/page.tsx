import UserRentDetailsView from "./rentdetails";

const UserRentDetails = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return <UserRentDetailsView id={id} />;
};

export default UserRentDetails;
