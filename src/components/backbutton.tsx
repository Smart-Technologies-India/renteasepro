"use client";
import { useRouter } from "next/navigation";
import { IcBaselineArrowBack } from "./icons";

const BackButton = () => {
  const router = useRouter();
  return (
    <>
      <button className="bg-transparent" onClick={() => router.back()}>
        <IcBaselineArrowBack className="text-xl text-black"></IcBaselineArrowBack>
      </button>
    </>
  );
};

export default BackButton;
