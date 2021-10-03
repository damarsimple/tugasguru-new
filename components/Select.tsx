import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdArrowDropDown, MdCheck } from "react-icons/md";

interface SelectAttribute {
  label: string;
  value: string;
}

export default function Select({
  attributes,
  placeholder,
  label,
  lastRef,
  loading,
  onChange,
  onSearchChange,
}: {
  loading?: boolean;
  attributes: SelectAttribute[];
  placeholder?: string;
  label?: string;
  lastRef?: (node?: Element | null | undefined) => void;
  onChange?: (e: string) => void;
  onSearchChange?: (e: string) => void;
}) {
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [currentLabel, setCurrentLabel] = useState("");

  useEffect(() => {
    onSearchChange && onSearchChange(search);
  }, [onSearchChange, search]);

  const reg = new RegExp(search);

  return (
    <div className="rounded shadow-md p-2">
      <label htmlFor="" className="font-semibold uppercase  text-md">
        {label}
      </label>
      {active ? (
        <div className="rounded shadow-md my-2 relative pin-t pin-l">
          <div className="p-2">
            <input
              autoFocus
              className="border-2 rounded w-full p-4"
              onChange={(e) => setSearch(e.target.value)}
            />
            <br />
          </div>
          <ul
            onClick={() => setActive(false)}
            className="list-reset absolute rounded shadow-md bg-white z-50 w-full pt-2 h-56 overflow-x-scroll"
          >
            {attributes.map((e) => (
              <li key={e.value}>
                <button
                  onClick={() => {
                    setCurrentValue(e.value);
                    setCurrentLabel(e.label);
                    onChange && onChange(e.value);
                    setSearch("");
                  }}
                  className="flex justify-between hover:bg-gray-100 w-full"
                >
                  <p className="p-2 block text-black hover:bg-grey-light cursor-pointer">
                    {e.label}
                  </p>
                  {e.value == currentValue && (
                    <MdCheck size="1.5em" className="pt-2" />
                  )}
                </button>
              </li>
            ))}
            {loading && (
              <li className="flex justify-center">
                <AiOutlineLoading className="animate-spin" />
              </li>
            )}
            <li ref={lastRef} className="h-8" />
          </ul>
        </div>
      ) : (
        <button
          className="my-2 w-full shadow-md rounded"
          onClick={() => {
            setActive(true);
          }}
        >
          <li className="flex justify-between">
            <p className="p-2 block text-black hover:bg-grey-light cursor-pointer">
              {currentLabel ?? placeholder}
            </p>
            <MdArrowDropDown size="2em" />
          </li>
        </button>
      )}
    </div>
  );
}
