import React from "react";

export default function SearchBox({
  onChange,
  placeholder,
}: {
  onChange: (e: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="w-full shadow rounded p-4"
      placeholder={placeholder ?? "Cari Sesuatu ...."}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
