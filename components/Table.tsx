import React from "react";

interface TableHeader<T> {
  name: keyof T;
  label: string;
}

export default function Table<T>({
  headers,
  data,
}: {
  headers: TableHeader<T>[];
  data: T[];
}) {
  return (
    <table className="w-full table p-4 bg-white shadow rounded-lg">
      <thead>
        <tr>
          {headers.map((e) => (
            <th
              key={e.name.toString()}
              className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
            >
              {e.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((e, i) => (
          <tr key={i} className="text-gray-700">
            {headers.map((x, i) => (
              <td key={i} className="border p-4 dark:border-dark-5">
                {e[x.name]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
