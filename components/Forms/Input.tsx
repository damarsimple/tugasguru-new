import React from "react";
import { MdInfoOutline } from "react-icons/md";

interface IProps {
  label?: string;
  name?: string;
  value?: string;
  type?: string;
  defaultValue?: string;
  information?: string;
  defaultChecked?: boolean;
  required?: boolean;
  onTextChange?: (e: string | number) => void;
  onCheckChange?: (e: boolean) => void;
}

export default function Input({
  value,
  label,
  name,
  type,
  onTextChange,
  onCheckChange,
  defaultValue,
  defaultChecked,
  required,
  information,
}: IProps) {
  if (type == "hidden")
    return <input type="hidden" name={name} defaultValue={defaultValue} />;

  return (
    <div className="flex flex-col md:grid md:grid-cols-12  gap-2 my-4">
      <label className="col-span-4 input-label text-lg mb-2 font-semibold italic">
        {label}
      </label>
      <div className="col-span-8 flex flex-col gap-2">
        {(() => {
          switch (type) {
            case "checkbox":
              return (
                <input
                  type="checkbox"
                  name={name}
                  value={value}
                  defaultChecked={defaultChecked ?? false}
                  required={required}
                  className="text-black input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                  onChange={(x) => {
                    onCheckChange && onCheckChange(x.target.checked);
                  }}
                />
              );
            case "number":
              return (
                <input
                  type={type}
                  name={name}
                  value={value}
                  defaultValue={defaultValue}
                  required={required}
                  className="text-black input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                  onChange={(x) => {
                    onTextChange && onTextChange(parseInt(x.target.value));
                  }}
                />
              );
            case "color":
              return (
                <div className="input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker">
                  <input
                    type="color"
                    className="w-full"
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    required={required}
                    onChange={(x) => {
                      onTextChange && onTextChange(x.target.value);
                    }}
                  />
                </div>
              );
            case "text":
            default:
              return (
                <input
                  className="text-black input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                  type={type ?? "text"}
                  name={name}
                  value={value}
                  defaultValue={defaultValue}
                  required={required}
                  onChange={(x) => {
                    onTextChange && onTextChange(x.target.value);
                  }}
                />
              );
          }
        })()}
        {information && (
          <div className="flex gap-2">
            <MdInfoOutline size="1.5em" />{" "}
            <p className="text-lg italic">{information}</p>
          </div>
        )}
      </div>
    </div>
  );
}
