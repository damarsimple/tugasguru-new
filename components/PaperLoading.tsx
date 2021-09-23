import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Paper from "./Paper";

export default function PaperLoading() {
  return (
    <Paper name="Loading..." className="flex justify-center">
      <AiOutlineLoading className="animate-spin" />
    </Paper>
  );
}
