import {
  DocumentNode,
  gql,
  useMutation,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import React, { useEffect } from "react";
import { get } from "lodash";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";
import Link from "next/link";
import Button from "./Button";
import SkeletonGrid from "./SkeletonGrid";

interface Id {
  id: string;
}

interface BoxProps<T extends Id> {
  query: DocumentNode;
  deleteQuery?: DocumentNode;
  fields: string;
  Component: (e: T) => JSX.Element;
  SkeletonComponent?: () => JSX.Element;
  className?: string;
  perPage?: number;
  variables?: object;
  fetchPolicy?: WatchQueryFetchPolicy;
  withEditDelete?: boolean;
  editUrl?: string;
  raw?: boolean;
}

interface PaginatorInfo {
  endCursor: string;
  currentPage: number;
  count: number;
  hasNextPage: boolean;
  total: number;
}

const PER_PAGE_DEFAULT = 10;

export default function Loader<T extends Id>({
  query,
  fields,
  Component,
  SkeletonComponent,
  className,
  perPage,
  variables,
  fetchPolicy,
  deleteQuery,
  editUrl,
  withEditDelete,
  raw,
}: BoxProps<T>) {
  const [
    mutateFunction,
    {
      data: dataDeleteMutation,
      loading: mutationLoading,
      error: mutationError,
    },
  ] = useMutation(
    deleteQuery ??
      gql`
        mutation {
          placeholder {
            id
          }
        }
      `
  );

  const PerPage = perPage ?? PER_PAGE_DEFAULT;

  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    fetchPolicy,
    variables: {
      first: PerPage,
      after: "",
      ...variables,
    },
  });

  const mainData = get(data, fields);
  const datas: { node: T }[] = mainData?.edges ?? [];
  const pageInfo: PaginatorInfo = mainData?.pageInfo;

  const MakeComponent = (e: T) => <Component {...e} />;

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          first: PerPage,
          after: pageInfo.endCursor,
        },
      });
      console.log("fetching more");
    }
  }, [PerPage, fetchMore, inView, pageInfo]);

  const handleDelete = (e: T) => {
    mutateFunction({ variables: { id: e.id } })
      .then((e) => {
        toast.success("Berhasil menghapus data");
        refetch();
      })
      .catch((e) => {
        toast.error("Gagal menghapus data");
      });
  };

  if (loading || mutationLoading)
    return (
      <>
        {
          <SkeletonGrid
            className={className}
            total={perPage ?? 20}
            SkeletonComponent={SkeletonComponent}
          />
        }
      </>
    );

  if (error) return <p>Error :( {error.message}</p>;

  return raw ? (
    <>
      {datas.map((e, i) => (
        <MakeComponent {...e.node} key={`${e.node.id}-${i}`} />
      ))}
      <div ref={ref}>
        {pageInfo?.hasNextPage && (
          <SkeletonGrid
            className={className}
            total={perPage ?? 20}
            SkeletonComponent={SkeletonComponent}
          />
        )}
      </div>
    </>
  ) : (
    <div>
      <div className={className}>
        {datas.map((e, i) => (
          <div key={`${e.node.id}-${i}`}>
            {withEditDelete && (
              <div className="flex justify-between">
                <Link href={editUrl + e.node.id}>
                  <a className="w-full">
                    <Button color="YELLOW">EDIT</Button>
                  </a>
                </Link>
                <Button onClick={() => handleDelete(e.node)} color="RED">
                  DELETE
                </Button>
              </div>
            )}
            <MakeComponent {...e.node} />
          </div>
        ))}
      </div>
      <div ref={ref}>
        {pageInfo?.hasNextPage && (
          <SkeletonGrid className={className} total={perPage ?? 20} />
        )}
      </div>
    </div>
  );
}
