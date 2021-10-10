import { useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import { DocumentNode } from "graphql";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { wildCardFormatter } from "../helpers/formatter";
import { PageInfo, PaginatorInfo } from "../types/type";
import FormModal from "./FormModal";
import { InputMap } from "./Forms/Form";
import SearchBox from "./SearchBox";

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
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
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

interface TableHeader<T> {
  name: Leaves<T, 3>;
  label: string;
  formatter?: (e: any) => void;
}

export default function Table<T>({
  headers,
  fields,
  variables,
  query,
  perPage,
  fetchPolicy,
  withSearchbar,
  withAction,
  editFields,
  editQuery,
  deleteQuery,
  editAttributes,
}: {
  withSearchbar?: boolean;
  withAction?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
  fields: string;
  editFields?: string;
  variables?: object;
  perPage?: number;
  query: DocumentNode;
  editQuery?: DocumentNode;
  deleteQuery?: DocumentNode;
  editAttributes?: InputMap<T>[];
  headers: TableHeader<T>[];
}) {
  const [search, setSearch] = useState("");

  const { data, loading, error, fetchMore, refetch } = useQuery(query, {
    fetchPolicy: fetchPolicy ?? "network-only",
    variables: {
      first: perPage ?? 10,
      after: "",
      ...variables,
      name: wildCardFormatter(search),
    },
  });

  const mainData = get(data, fields);
  const datas: { node: T }[] = mainData?.edges ?? [];
  const pageInfo: PageInfo = mainData?.pageInfo;

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          first: perPage ?? 10,
          after: pageInfo.endCursor,
        },
      });
      console.log("fetching more");
    }
  }, [perPage, fetchMore, inView, pageInfo]);
  return (
    <>
      {withSearchbar && (
        <div className="my-6">
          <SearchBox onChange={setSearch} />
        </div>
      )}
      <table className="w-full table p-4 bg-white shadow rounded-lg">
        <thead>
          <tr>
            {headers.map((e) => (
              <th
                key={e.label}
                className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
              >
                {e.label}
              </th>
            ))}
            {withAction && (
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {datas?.map((e, i) => (
            <tr key={i} className="text-gray-700">
              {headers.map((x, i) => (
                <td key={i} className="border p-4 dark:border-dark-5">
                  {x.formatter
                    ? x.formatter(get(e.node, x.name))
                    : get(e.node, x.name)}
                </td>
              ))}
              {withAction && editAttributes && editQuery && editFields && (
                <td className="border p-4 dark:border-dark-5">
                  <FormModal<T>
                    mutationQuery={editQuery}
                    openMessage="edit "
                    fields={editFields}
                    submitName="Ubah"
                    editAttributes={editAttributes}
                    successMessage="Berhasil mengubah"
                    addedValueMap={{ ...(e.node as unknown as object) }}
                    afterSubmit={() => {
                      refetch();
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={ref}>
        {(pageInfo?.hasNextPage || loading) && (
          <div className="flex items-center justify-center h-24 w-24">
            <AiOutlineLoading className="animate-spin" size="5em" />
          </div>
        )}
      </div>
    </>
  );
}
