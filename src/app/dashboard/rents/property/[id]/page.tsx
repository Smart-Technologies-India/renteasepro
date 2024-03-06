import RentPropertiesView from "./rentpropertyview";

const Property = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <RentPropertiesView id={id} />;
};

export default Property;
