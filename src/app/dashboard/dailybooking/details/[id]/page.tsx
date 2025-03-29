import PropertiesView from "./propertyview";

const Property = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <PropertiesView id={id} />;
};

export default Property;
