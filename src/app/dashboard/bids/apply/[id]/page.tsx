import ApplyForBidView from "./applyforbid";

const ApplyForBid = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <ApplyForBidView bidid={id} />;
};

export default ApplyForBid;
