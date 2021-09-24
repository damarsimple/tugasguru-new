import { gql, useMutation } from "@apollo/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdInfo } from "react-icons/md";
import ReactCrop, { Crop } from "react-image-crop";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import { getCroppedImg } from "../helpers/formatter";
import { makeId } from "../helpers/generator";
import { Picture } from "../types/type";
import Button from "./Button";
import ImageContainer from "./Container/ImageContainer";
import Paper from "./Paper";

const UPLOAD_IMAGE_MUTATION = gql`
  mutation (
    $file: Upload!
    $roles: String
    $pictureable_id: ID
    $pictureable_type: String
    $metadata: String
  ) {
    uploadPicture(
      file: $file
      roles: $roles
      pictureable_id: $pictureable_id
      pictureable_type: $pictureable_type
      metadata: $metadata
    ) {
      id
      path
      metadata {
        original_name
      }
    }
  }
`;

export default function PictureUploader(e: {
  name: string;
  auto?: boolean;
  crop?: Partial<Crop>;
  roles?: string;
  pictureable_id?: string;
  pictureable_type?: string;
  onUploadFinish?: (e: Picture) => void;
}) {
  const [file, setFile] = useState<null | File>(null);
  const [picture, setPicture] = useState<null | undefined | Picture>(null);
  const [crop, setCrop] = useState<Partial<Crop>>({ ...e.crop });
  const [cropped, setCropped] = useState(false);
  const [mutateFunction, { loading: mutationLoading, error: mutationError }] =
    useMutation<{ uploadPicture: Picture }>(UPLOAD_IMAGE_MUTATION);

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
        metadata: JSON.stringify({
          original_name: file?.name,
          original: file?.size,
        }),
      },
    }).then((x) => {
      setPicture(x.data?.uploadPicture);
      if (e.onUploadFinish && x.data?.uploadPicture) {
        e.onUploadFinish(x.data?.uploadPicture);
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
        {mutationError && <div>Error : {mutationError.message}</div>}
        <div className="flex justify-center">
          {file && (
            <div>
              {picture ? (
                <ImageContainer src={picture.path} />
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
        {picture && <p className="text-center">Berhasil Di Upload</p>}

        {!picture && (
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
