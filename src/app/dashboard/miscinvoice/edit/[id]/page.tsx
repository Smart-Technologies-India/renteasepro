"use server";

import EditInvoice from "./editinvoice";

const Bidrecept = async ({ params }: { params: any }) => {
  const id: number = params.id;

  return <EditInvoice id={id} />;
};

export default Bidrecept;
