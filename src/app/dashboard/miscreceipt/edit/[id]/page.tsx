"use server";

import UpdateRecipt from "./editreceipt";

const Bidrecept = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return <UpdateRecipt id={id} />;
};

export default Bidrecept;
