import Link from "next/link";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

type COLORS = "BLUE" | "YELLOW" | "RED" | "GRAY" | "GREEN";

const Colors = {
  BLUE: "bg-blue-500  hover:bg-blue-600 focus:ring-blue-200",
  YELLOW: "bg-yellow-500  hover:bg-yellow-600 focus:ring-yellow-200",
  RED: "bg-red-500  hover:bg-red-600 focus:ring-red-200",
  GRAY: "bg-gray-500  hover:bg-gray-600 focus:ring-gray-200",
  GREEN: "bg-green-500  hover:bg-green-600 focus:ring-green-200",
};

interface StringMap {
  [e: string]: string;
}

interface ButtonProp {
  children: string | JSX.Element | JSX.Element[] | any;
  type?: "button" | "submit";
  loading?: boolean;
  onClick?: () => void;
  color?: COLORS;
  href?: string;
  className?: string;
}

export default function Button({
  type,
  loading,
  children,
  onClick,
  color,
  href,
  className,
}: ButtonProp) {
  const ButtonComponent = () => (
    <button
      onClick={onClick}
      type={type ?? "button"}
      disabled={loading}
      className={
        className +
        " uppercase items-center flex justify-center w-full px-4 py-2 truncate text-sm lg:text-lg font-semibold text-white transition-colors duration-300 rounded-md shadow focus:outline-none focus:ring-4 " +
        (color && color in Colors ? Colors[color] : Colors.BLUE)
      }
    >
      {loading ? <AiOutlineLoading className="animate-spin" /> : children}
    </button>
  );

  return href ? (
    <Link href={href}>
      <a className="w-full">
        <ButtonComponent />
      </a>
    </Link>
  ) : (
    <ButtonComponent />
  );
}
