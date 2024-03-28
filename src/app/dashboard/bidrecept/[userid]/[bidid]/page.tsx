"use server";

import ViewPdf from "./viewpdf";

const Bidrecept = async ({ params }: { params: any }) => {
  const userid: number = params.userid;
  const bidid: number = params.bidid;

  return (
    <div className="h-[85vh] m-4 rounded-md shadow-md border">
      <ViewPdf userid={userid} bidid={bidid} />
    </div>
  );
};

export default Bidrecept;
