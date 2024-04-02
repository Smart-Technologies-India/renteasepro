"use server";

import ViewPdf from "./viewpdf";

const Bidrecept = async ({ params }: { params: any }) => {
  const id: number = params.id;
  return (
    <div className="h-[85vh] m-4 rounded-md shadow-md border">
      <ViewPdf id={id} />
    </div>
  );
};

export default Bidrecept;
