import moment from "moment";
import React, { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { SelectValue } from "./Form";

interface IProps {
  label?: string;
  name?: string;
  value?: string;
  type?: string;
  defaultValue?: string;
  information?: string;
  defaultChecked?: boolean;
  required?: boolean;
  onTextChange?: (e: string) => void;
  onFileChange?: (e: File) => void;
  onCheckChange?: (e: boolean) => void;
  values?: SelectValue[];
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
  values,
  onFileChange,
}: IProps) {
  const [filled, setFilled] = useState(!!defaultValue);
  const [time, setTime] = useState(moment(defaultValue).format("hh:mm"));
  const [date, setDate] = useState(moment(defaultValue).format("YYYY-MM-DD"));
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
                    setFilled(!!x.target.value);
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
                    onTextChange &&
                      onTextChange(parseInt(x.target.value).toString());
                    setFilled(!!x.target.value);
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
                      setFilled(!!x.target.value);
                    }}
                  />
                </div>
              );
            case "file":
              return (
                <div className="input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker">
                  <input
                    type="file"
                    className="w-full"
                    name={name}
                    required={required}
                    onChange={(x) => {
                      onFileChange &&
                        x.target?.files &&
                        x.target?.files[0] &&
                        onFileChange(x.target.files[0]);
                    }}
                  />
                </div>
              );
            case "select":
              return (
                <select
                  className="text-black input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                  name={name}
                  value={value}
                  defaultValue={defaultValue}
                  required={required}
                  onChange={(x) => {
                    onTextChange && onTextChange(x.target.value);
                    setFilled(!!x.target.value);
                  }}
                >
                  <option value="">Pilih {label}</option>
                  {values?.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.name}
                    </option>
                  ))}
                </select>
              );
            case "datetime":
              return (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="text-black input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                    type={"time"}
                    name={name}
                    required={required}
                    value={time}
                    onChange={(x) => {
                      setTime(x.target.value);
                      onTextChange &&
                        onTextChange(
                          defaultValue ??
                            moment(`${x.target.value} ${date}`, "").format(
                              'hh:mm "YYYY-MM-DD'
                            )
                        );
                      setFilled(!!x.target.value);
                    }}
                  />
                  <input
                    className="text-black input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                    type={"date"}
                    name={name}
                    value={date}
                    required={required}
                    onChange={(x) => {
                      setDate(x.target.value);
                      onTextChange &&
                        onTextChange(
                          defaultValue ??
                            moment(`${time} ${x.target.value}`, "").format(
                              'hh:mm "YYYY-MM-DD'
                            )
                        );
                      setFilled(!!x.target.value);
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
                    setFilled(!!x.target.value);
                  }}
                />
              );
          }
        })()}
      </div>
      <div className="col-span-12">
        {information && (
          <div className="flex gap-2">
            <MdInfoOutline size="1.5em" />{" "}
            <p className="text-lg italic">{information}</p>
          </div>
        )}
        {!filled && type != "checkbox" && required && (
          <div className="flex gap-2 text-red-600">
            <MdInfoOutline size="1.5em" />{" "}
            <p className="text-xl italic">{label} harus di isi</p>
          </div>
        )}
      </div>
    </div>
  );
}
