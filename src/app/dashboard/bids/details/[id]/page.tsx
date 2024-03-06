import BidDetailsView from "./biddetails";

const BidDetails = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <BidDetailsView bidid={id} />;
};

export default BidDetails;
