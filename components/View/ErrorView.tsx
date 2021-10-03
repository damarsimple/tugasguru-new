import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Button from "../Button";

export default function ErrorView({ error }: { error: string }) {
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen w-screen">
      error : {error}
      <Button
        onClick={() => {
          window.location.reload();
        }}
      >
        RELOAD
      </Button>
    </div>
  );
}
