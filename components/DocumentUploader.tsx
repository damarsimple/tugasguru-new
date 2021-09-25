import { gql, useMutation } from "@apollo/client";
import React, { useCallback, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdInfo } from "react-icons/md";
import ReactCrop, { Crop } from "react-image-crop";
import { getCroppedImg } from "../helpers/formatter";
import { makeId } from "../helpers/generator";
import { Document } from "../types/type";
import Button from "./Button";
import ImageContainer from "./Container/ImageContainer";
import Paper from "./Paper";

const UPLOAD_IMAGE_MUTATION = gql`
  mutation (
    $file: Upload!
    $type: String!
    $roles: String
    $compressed: Boolean
    $documentable_id: ID
    $documentable_type: String
    $metadata: String
  ) {
    uploadDocument(
      file: $file
      roles: $roles
      type: $type
      compressed: $compressed
      documentable_id: $documentable_id
      documentable_type: $documentable_type
      metadata: $metadata
    ) {
      id
      path
      type
      metadata {
        original_name
      }
    }
  }
`;

export default function DocumentUploader(e: {
  name: string;
  type: "picture" | "document" | "audio" | "video";
  auto?: boolean;
  crop?: Partial<Crop>;
  roles?: string;
  documentable_id?: string;
  documentable_type?: string;
  onUploadFinish?: (e: Document) => void;
}) {
  const { type } = e;
  const [file, setFile] = useState<null | File>(null);
  const [document, setDocument] = useState<null | undefined | Document>(null);
  const [crop, setCrop] = useState<Partial<Crop>>({ ...e.crop });
  const [cropped, setCropped] = useState(false);
  const [mutateFunction, { loading: mutationLoading, error: mutationError }] =
    useMutation<{ uploadDocument: Document }>(UPLOAD_IMAGE_MUTATION);

  const handleUpload = async (x?: File) => {
    if (!imgRef.current) return;

    const uploadFile =
      x ?? cropped
        ? new File(
            //@ts-ignore
            [await getCroppedImg(imgRef.current, crop as Crop, makeId(10))],
            "fileName.jpg",
            { type: "image/jpeg" }
          )
        : file;
    mutateFunction({
      variables: {
        file: uploadFile,
        ...e,
        type,
        compressed: false,
        metadata: JSON.stringify({
          original_name: file?.name,
          original: file?.size,
          mime: file?.type,
        }),
      },
    }).then((x) => {
      setDocument(x.data?.uploadDocument);
      if (e.onUploadFinish && x.data?.uploadDocument) {
        e.onUploadFinish(x.data?.uploadDocument);
      }
    });
  };

  const imgRef = useRef(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const [upImg, setUpImg] = useState();

  return (
    <Paper name={e.name}>
      <div>
        {type == "picture" && (
          <div className="flex justify-center">
            {file && (
              <div>
                {document ? (
                  <ImageContainer src={document.path} />
                ) : (
                  <>
                    <ReactCrop
                      onImageLoaded={onLoad}
                      src={upImg as any}
                      crop={crop}
                      onChange={(newCrop) => {
                        setCrop(newCrop);
                        setCropped(true);
                      }}
                    />
                    <MdInfo size="1.5em" /> anda bisa memotong gambar ini ..
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {mutationError && <div>Error : {mutationError.message}</div>}
        {document && <p className="text-center">Berhasil Di Upload</p>}

        {!document && (
          <>
            {!mutationLoading && (
              <input
                type="file"
                accept="image/*"
                className="input-field inline-flex items-baseline border-none shadow-md bg-white placeholder-blue w-full p-4 no-outline text-dusty-blue-darker"
                onChange={(x) => {
                  //@ts-ignore
                  if (x.target?.files[0]) {
                    setFile(x.target.files[0]);

                    const reader = new FileReader();

                    reader.addEventListener("load", () =>
                      //@ts-ignore
                      setUpImg(reader.result)
                    );

                    reader.readAsDataURL(x.target.files[0]);

                    e.auto && handleUpload(x.target?.files[0]);
                  }
                }}
              />
            )}
            {mutationLoading ? (
              <AiOutlineLoading
                size="2.5em"
                className="animate-spin rounded  p-2 w-full my-4"
              />
            ) : e.auto ? (
              <div></div>
            ) : (
              <Button
                type="button"
                loading={mutationLoading}
                onClick={() => handleUpload()}
                color="BLUE"
              >
                UPLOAD
              </Button>
            )}
          </>
        )}
      </div>
    </Paper>
  );
}
