import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

export default function LoadingView() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <AiOutlineLoading className="animate-spin" size="5em" />
    </div>
  );
}
