import { gql, useMutation } from "@apollo/client";
import Link from "next/link";
import React from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { Document } from "../types/type";
import Button from "./Button";
import AudioContainer from "./Container/AudioContainer";
import DocumentContainer from "./Container/DocumentContainer";
import ImageContainer from "./Container/ImageContainer";
import VideoContainer from "./Container/VideoContainer";

export default function AttachmensViewer({
  onDelete,
  withDelete,
  documents,
}: {
  withDelete?: boolean;
  onDelete?: () => void;
  documents?: Document[] | null;
}) {
  const [deleteDocument] = useMutation(gql`
    mutation DeleteDocument($id: ID!) {
      deleteDocument(id: $id) {
        id
      }
    }
  `);

  const success = () =>
    toast.success("Berhasil menghapus berkas") && onDelete && onDelete();
  const error = (e: string) => toast.error("Gagal menghapus berkas" + e);

  return (
    <div className="grid grid-cols-1 gap-2">
      {documents?.map((e) => {
        switch (e.type) {
          case "document":
            return (
              <div key={e.id} className="grid grid-cols-12 gap-2">
                <Link href={"/picture/" + e.id}>
                  <a
                    className={
                      "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                      (withDelete ? "col-span-10" : "col-span-12")
                    }
                    target="_blank"
                  >
                    <div className="h-full w-full grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <DocumentContainer src={e.path} />
                      </div>
                      <div className="col-span-10">
                        <h2>{e.metadata?.original_name}</h2>
                        <p>Dokumen</p>
                      </div>
                    </div>
                  </a>
                </Link>
                {withDelete && (
                  <Button
                    onClick={() =>
                      deleteDocument({ variables: { id: e.id } })
                        .then(success)
                        .catch(error)
                    }
                    className="col-span-2"
                    color="RED"
                  >
                    <MdDelete size="3.5em" />
                  </Button>
                )}
              </div>
            );
          case "video":
            return (
              <div key={e.id} className="grid grid-cols-12 gap-2">
                <Link href={"/video/" + e.id}>
                  <a
                    className={
                      "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                      (withDelete ? "col-span-10" : "col-span-12")
                    }
                    target="_blank"
                  >
                    <div className="h-full w-full grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <VideoContainer src={e.path} />
                      </div>
                      <div className="col-span-10">
                        <h2>{e.metadata?.original_name}</h2>
                        <p>Video</p>
                      </div>
                    </div>
                  </a>
                </Link>
                {withDelete && (
                  <Button
                    onClick={() =>
                      deleteDocument({ variables: { id: e.id } })
                        .then(success)
                        .catch(error)
                    }
                    className="col-span-2"
                    color="RED"
                  >
                    <MdDelete size="3.5em" />
                  </Button>
                )}
              </div>
            );
          case "audio":
            return (
              <div key={e.id} className="grid grid-cols-12 gap-2">
                <Link href={"/audio/" + e.id}>
                  <a
                    className={
                      "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                      (withDelete ? "col-span-10" : "col-span-12")
                    }
                    target="_blank"
                  >
                    <div className="h-full w-full grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <AudioContainer src={e.path} />
                      </div>
                      <div className="col-span-10">
                        <h2>{e.metadata?.original_name}</h2>
                        <p>Audio</p>
                      </div>
                    </div>
                  </a>
                </Link>
                {withDelete && (
                  <Button
                    onClick={() =>
                      deleteDocument({ variables: { id: e.id } })
                        .then(success)
                        .catch(error)
                    }
                    className="col-span-2"
                    color="RED"
                  >
                    <MdDelete size="3.5em" />
                  </Button>
                )}
              </div>
            );
          case "picture":
            return (
              <div key={e.id} className="grid grid-cols-12 gap-2">
                <Link href={"/picture/" + e.id}>
                  <a
                    className={
                      "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                      (withDelete ? "col-span-10" : "col-span-12")
                    }
                    target="_blank"
                  >
                    <div className="h-full w-full grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <ImageContainer
                          fallback="placeholder"
                          src={e.path}
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="col-span-10">
                        <h2>{e.metadata?.original_name}</h2>
                        <p>Gambar</p>
                      </div>
                    </div>
                  </a>
                </Link>
                {withDelete && (
                  <Button
                    onClick={() =>
                      deleteDocument({ variables: { id: e.id } })
                        .then(success)
                        .catch(error)
                    }
                    className="col-span-2"
                    color="RED"
                  >
                    <MdDelete size="3.5em" />
                  </Button>
                )}
              </div>
            );

          default:
            return <div></div>;
        }
      })}
    </div>
  );
}
