import { gql, useMutation } from "@apollo/client";
import Link from "next/link";
import React from "react";
import { GrDocument } from "react-icons/gr";
import { MdAudiotrack, MdDelete, MdVideocam } from "react-icons/md";
import { toast } from "react-toastify";
import { Audio, Document, Picture, Video } from "../types/type";
import Button from "./Button";
import ImageContainer from "./Container/ImageContainer";

export default function AttachmensViewer({
  onDelete,
  withDelete,
  pictures,
  videos,
  documents,
  audios,
}: {
  withDelete?: boolean;
  onDelete?: () => void;
  pictures?: Picture[] | null;
  videos?: Video[] | null;
  audios?: Audio[] | null;
  documents?: Document[] | null;
}) {
  const [deletePicture] = useMutation(gql`
    mutation DeletePicture($id: ID!) {
      deletePicture(id: $id) {
        id
      }
    }
  `);

  const [deleteVideo] = useMutation(gql`
    mutation DeleteVideo($id: ID!) {
      deleteVideo(id: $id) {
        id
      }
    }
  `);

  const [deleteAudio] = useMutation(gql`
    mutation DeleteAudio($id: ID!) {
      deleteAudio(id: $id) {
        id
      }
    }
  `);

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
      {pictures?.map((e) => (
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
                    key={e.id}
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
                deletePicture({ variables: { id: e.id } })
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
      ))}
      {audios?.map((e) => (
        <div key={e.id} className="grid grid-cols-12 gap-2">
          <Link key={e.id} href={"/audio/" + e.id}>
            <a
              className={
                "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                (withDelete ? "col-span-10" : "col-span-12")
              }
              target="_blank"
            >
              <div className="h-full w-full grid grid-cols-12 gap-2">
                <div className="col-span-2">
                  <MdAudiotrack size="1.5em" />
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
                deleteAudio({ variables: { id: e.id } })
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
      ))}
      {documents?.map((e) => (
        <div key={e.id} className="grid grid-cols-12 gap-2">
          <Link key={e.id} href={"/document/" + e.id}>
            <a
              className={
                "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                (withDelete ? "col-span-10" : "col-span-12")
              }
              target="_blank"
            >
              <div className="h-full w-full grid grid-cols-12 gap-2">
                <div className="col-span-2">
                  <GrDocument size="1.5em" />
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
      ))}
      {videos?.map((e) => (
        <div key={e.id} className="grid grid-cols-12 gap-2">
          <Link key={e.id} href={"/video/" + e.id}>
            <a
              className={
                "h-full w-full shadow rounded p-2 hover:bg-gray-100 " +
                (withDelete ? "col-span-10" : "col-span-12")
              }
              target="_blank"
            >
              <div className="h-full w-full grid grid-cols-12 gap-2">
                <div className="col-span-2">
                  <MdVideocam size="1.5em" />
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
                deleteVideo({ variables: { id: e.id } })
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
      ))}
    </div>
  );
}
