import ShopView from "./shopview";

const Shop = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <ShopView id={id} />;
};

export default Shop;
