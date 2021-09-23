/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import { DocumentNode } from "graphql";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Id } from "react-toastify";
import { wildCardFormatter } from "../helpers/formatter";
import Select from "./Select";

interface PaginatorInfo {
  endCursor: string;
  currentPage: number;
  count: number;
  hasNextPage: boolean;
  total: number;
}

interface SelectLoaderProps {
  onChange?: (e: string) => void;
  query: DocumentNode;
  fields: string;
  label?: string;
  perPage?: number;
  variables?: object;
  fetchPolicy?: WatchQueryFetchPolicy;
}

interface BasicModel {
  id: string;
  name: string;
}

export default function SelectLoader<T extends BasicModel>({
  query,
  fields,
  perPage,
  variables,
  label,
  fetchPolicy,
  onChange,
}: SelectLoaderProps) {
  const [search, setSearch] = useState("");

  const { data, loading, error, fetchMore } = useQuery(query, {
    fetchPolicy,
    variables: {
      first: perPage ?? 10,
      after: "",
      name: wildCardFormatter(search),
      ...variables,
    },
  });

  const mainData = get(data, fields);
  const datas: { node: T }[] = mainData?.edges ?? [];
  const pageInfo: PaginatorInfo = mainData?.pageInfo;

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          first: perPage ?? 10,
          after: pageInfo.endCursor,
          name: wildCardFormatter(search),
          ...variables,
        },
      });
      console.log("fetching more");
    }
  }, [fetchMore, inView, pageInfo]);

  return (
    <Select
      attributes={datas.map(({ node }) => {
        return { label: node.name, value: node.id };
      })}
      label={label}
      lastRef={ref}
      loading={loading}
      onChange={onChange}
      onSearchChange={setSearch}
    />
  );
}
