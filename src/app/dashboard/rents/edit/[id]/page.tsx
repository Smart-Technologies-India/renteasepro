"use server";

import EditRentPage from "./editrent";

const Bidrecept = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <EditRentPage id={id} />;
};

export default Bidrecept;
