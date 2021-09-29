/* eslint-disable react/display-name */
import dynamic from "next/dynamic";
import { AiOutlineLoading } from "react-icons/ai";

export const Editor = dynamic(() => import("../components/MainEditor"), {
  ssr: false,
  loading: () => <AiOutlineLoading className="animate-spin" size="1.5em" />,
});
