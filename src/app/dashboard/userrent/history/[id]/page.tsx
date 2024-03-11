import UserRentHistoryView from "./userrenthistory";

const UserRentHistory = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return <UserRentHistoryView id={id} />;
};

export default UserRentHistory;
