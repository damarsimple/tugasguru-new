import React from "react";
import Image from "next/image";
import ImageContainer from "./Container/ImageContainer";

// https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object

type Cons<H, T> = T extends readonly unknown[]
  ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Cons<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : [];

interface MapKeys<T> {
  value: T;
  formatted: string;
  formatter?: (t: unknown) => string;
}

interface TableProp<T> {
  headers: MapKeys<keyof T | Leaves<T, 3>>[];
  elements: T[];
}

export default function Table<T>(props: TableProp<T>) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
          {props.headers.map((e) => (
            <th className="px-4 py-3 uppercase" key={e.formatted}>
              {e.formatted}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {[...Array(20)].map((e, i) => (
          <tr className="text-gray-700" key={i}>
            <td className="px-4 py-3 border">
              <div className="flex items-center text-sm">
                <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                  <ImageContainer
                    fallback="profile"
                    alt="Picture of the author"
                    width={50}
                    height={50}
                    src="https://trakteer.id/storage/images/avatar/ava-kqwK2sVxMEXfACgq0luplMIrcWAm9eGA1617518306.jpg"
                  />
                  <div
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="font-semibold text-black">Drop Item</p>
                  <p className="text-xs text-gray-600">Minecraft</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-ms font-semibold border">30</td>
            <td className="px-4 py-3 text-xs border">Rp 10.000</td>
            <td className="px-4 py-3 text-sm border">6/10/2021</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
