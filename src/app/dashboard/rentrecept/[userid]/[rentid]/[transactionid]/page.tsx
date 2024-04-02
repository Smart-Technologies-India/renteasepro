"use server";

import ViewPdf from "./viewpdf";

const Bidrecept = async ({ params }: { params: any }) => {
  const userid: number = params.userid;
  const rentid: number = params.rentid;
  const transactionid: string = params.transactionid;

  return (
    <div className="h-[85vh] m-4 rounded-md shadow-md border">
      <ViewPdf userid={userid} rentid={rentid} transactionid={transactionid} />
    </div>
  );
};

export default Bidrecept;
