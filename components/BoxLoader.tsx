import {
  DocumentNode,
  gql,
  useMutation,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";
import Button from "./Button";
import SkeletonGrid from "./SkeletonGrid";
import { MdClose } from "react-icons/md";
import Modal from "./Modal";
import Form, { InputMap } from "./Forms/Form";
import SearchBox from "./SearchBox";
import { wildCardFormatter } from "../helpers/formatter";

interface Id {
  id: string;
}

interface BoxProps<T extends Id> {
  query: DocumentNode;
  deleteQuery?: DocumentNode;
  editQuery?: DocumentNode;
  fields: string;
  Component: (e: T) => JSX.Element;
  SkeletonComponent?: () => JSX.Element;
  className?: string;
  perPage?: number;
  variables?: object;
  fetchPolicy?: WatchQueryFetchPolicy;
  withEditDelete?: boolean;
  raw?: boolean;
  editAttributes?: InputMap<T>[];
  editFields?: string;
  withSearchbar?: boolean;
  EditChildren?: () => JSX.Element;
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
  editQuery,
  withEditDelete,
  editAttributes,
  editFields,
  EditChildren,
  withSearchbar,
}: // raw,
BoxProps<T>) {
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

  const [search, setSearch] = useState("");

  const { loading, error, data, fetchMore, refetch } = useQuery(query, {
    fetchPolicy,
    variables: {
      first: PerPage,
      after: "",
      ...variables,
      name: wildCardFormatter(search),
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

  const [selectedEdit, setSelectedEdit] = useState<T | undefined>(undefined);
  const [openEdit, setOpenEdit] = useState(false);
  const flip = () => setOpenEdit(!openEdit);

  const stillLoading = loading || mutationLoading;

  return (
    <div>
      <Modal open={openEdit} flip={flip}>
        <div className="flex flex-col gap-3">
          <div>
            <div className="top-0 right-0 flex m-6 gap-2 ">
              <Button color="RED" onClick={flip}>
                <MdClose color="white" size="1.5em" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 p-4">
            {editQuery && editAttributes && selectedEdit && editFields && (
              <Form
                attributes={editAttributes}
                fields=""
                mutationQuery={editQuery}
                addedValueMap={{
                  id: selectedEdit.id,
                }}
                afterSubmit={() => {
                  toast.success("Berhasil mengubah");
                  flip();
                  refetch();
                }}
                defaultValueMap={selectedEdit}
              />
            )}
            {EditChildren && <EditChildren />}
          </div>
        </div>
      </Modal>
      {withSearchbar && (
        <div className="my-6">
          <SearchBox onChange={setSearch} />
        </div>
      )}
      {stillLoading ? (
        <>
          <SkeletonGrid
            className={className}
            total={perPage ?? 20}
            SkeletonComponent={SkeletonComponent}
          />
        </>
      ) : error ? (
        <p>Error :( {error.message}</p>
      ) : (
        <div className={className}>
          {datas.map((e, i) => (
            <div key={`${e.node.id}-${i}`}>
              {withEditDelete && (
                <div className="flex justify-between">
                  <Button
                    color="YELLOW"
                    onClick={() => {
                      setSelectedEdit(e.node);
                      setOpenEdit(true);
                    }}
                  >
                    EDIT
                  </Button>
                  <Button onClick={() => handleDelete(e.node)} color="RED">
                    DELETE
                  </Button>
                </div>
              )}
              <MakeComponent {...e.node} />
            </div>
          ))}
        </div>
      )}
      <div ref={ref}>
        {pageInfo?.hasNextPage && (
          <SkeletonGrid className={className} total={perPage ?? 20} />
        )}
      </div>
    </div>
  );

  // return raw ? (
  //   <>
  //     {datas.map((e, i) => (
  //       <MakeComponent {...e.node} key={`${e.node.id}-${i}`} />
  //     ))}
  //     <div ref={ref}>
  //       {pageInfo?.hasNextPage && (
  //         <SkeletonGrid
  //           className={className}
  //           total={perPage ?? 20}
  //           SkeletonComponent={SkeletonComponent}
  //         />
  //       )}
  //     </div>
  //   </>
  // ) : (

  // );
}
