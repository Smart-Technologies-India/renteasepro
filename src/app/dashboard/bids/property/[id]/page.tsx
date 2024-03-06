import BidPropertiesView from "./bigpropertyview";

const Property = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <BidPropertiesView id={id} />;
};

export default Property;
