import UserAdminView from "./adminview";

const UserProfileDetails = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return <UserAdminView id={id} />;
};

export default UserProfileDetails;
