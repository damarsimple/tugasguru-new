import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React, { useState } from "react";
import { BiPencil } from "react-icons/bi";
import { MdCancel, MdCheck } from "react-icons/md";
import { toast } from "react-toastify";
import AttachmensViewer from "../../../components/AttachmensViewer";
import Button from "../../../components/Button";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import ImageContainer from "../../../components/Container/ImageContainer";
import Input from "../../../components/Forms/Input";
import Modal from "../../../components/Modal";
import PictureUploader from "../../../components/DocumentUploader";
import { CoreAssigmentsubmissionField } from "../../../fragments/fragments";
import { useUserStore } from "../../../store/user";
import { Assigment, Assigmentsubmission } from "../../../types/type";

function Id({ router }: { router: NextRouter }) {
  const { id } = router.query;
  const {
    data: { assigment } = {},
    error,
    loading,
    refetch,
  } = useQuery<{ assigment: Assigment }>(
    gql`
      ${CoreAssigmentsubmissionField}
      query GetAssigment($id: ID!) {
        assigment(id: $id) {
          id
          name
          close_at
          metadata {
            description
          }
          classroom {
            id
            name
            user {
              name
            }
            users {
              name
            }
          }

          documents {
            id
            path
            roles
          }

          myassigmentsubmission {
            ...CoreAssigmentsubmissionField
          }
          assigmentsubmissions {
            ...CoreAssigmentsubmissionField
          }
        }
      }
    `,
    {
      variables: { id },
    }
  );

  // const [updateAssigment,] = useMutation();
  const [updateSubmission] = useMutation(
    gql`
      mutation UpdateSubmission(
        $id: ID!
        $assigment_id: ID!
        $grade: Float
        $graded: Boolean
        $turned: Boolean
        $turned_at: String
        $metadata: String
        $documents: BasicOneToMany
      ) {
        updateAssigmentsubmission(
          id: $id
          input: {
            assigment_id: $assigment_id
            grade: $grade
            graded: $graded
            turned: $turned
            turned_at: $turned_at
            metadata: $metadata
            documents: $documents
          }
        ) {
          id
        }
      }
    `,
    {
      onCompleted: refetch,
    }
  );

  const { user } = useUserStore();

  const LoadingComponent = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4  shadow rounded p-2">
        <div className="flex flex-col gap-3">
          <div className="font-semibold text-lg bg-gray-200 h-6 animate-pulse" />
          <div className="font-semibold text-lg bg-gray-100 h-4 animate-pulse" />
          <div className="font-semibold text-lg bg-gray-100 h-4 animate-pulse" />
          <div className="font-semibold text-lg bg-gray-100 h-4 animate-pulse" />
          <div className="font-semibold text-lg bg-gray-100 h-4 animate-pulse" />
        </div>
        <hr />
        <div className="p-2 bg-gray-100 h-10 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {[...Array(4)].map((e, i) => (
            <div key={i} className="p-2 bg-gray-100 h-24 w-24 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  const AssigmentDetail = () => (
    <div className="flex flex-col gap-4 shadow rounded p-2">
      <div className="flex flex-col gap-3">
        <h1 className="font-semibold text-lg text-blue-400">
          {assigment?.name}
        </h1>
        <h2 className="font-semibold text-lg text-blue-400">
          {assigment?.user?.name}
        </h2>
        <p className="text-md">{assigment?.classroom?.name}</p>
        <p className="text-md">{assigment?.classroom?.user?.name}</p>
        <p className="text-md">
          Tenggat : {moment(assigment?.close_at).fromNow()}{" "}
          {moment(assigment?.close_at).format("HH:MM DD/MM")}
        </p>
      </div>
      <hr />
      <div className="p-2">{assigment?.metadata?.description}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <AttachmensViewer documents={assigment?.documents} />
      </div>
    </div>
  );

  const [openSubmission, setOpenSubmission] = useState(false);
  const [openGrading, setOpenGrading] = useState(false);
  const [submission, setSubmission] = useState<null | Assigmentsubmission>(
    null
  );
  const [grade, setGrade] = useState(0);

  const flipSubmission = () => setOpenSubmission(!openSubmission);
  const flipGrading = () => setOpenGrading(!openGrading);

  if (error) return <p>{error.message}</p>;

  return (
    <DashboardContainer title={assigment?.name}>
      <Modal open={openSubmission} flip={flipSubmission}>
        <div className="p-4 flex flex-col gap-2">
          {/* <Input label="External Link" />
          <Input label="Jawaban" /> */}
          <PictureUploader
            name="Upload Gambar"
            type="picture"
            onUploadFinish={(e) => {
              updateSubmission({
                variables: {
                  id: assigment?.myassigmentsubmission?.id,
                  assigment_id: assigment?.id,
                  documents: { connect: [e.id] },
                },
              });
            }}
          />
          <Button onClick={flipSubmission}>TUTUP</Button>
        </div>
      </Modal>
      <Modal open={openGrading} flip={flipGrading}>
        <div className="p-4 flex flex-col gap-2">
          <Input
            label="Nilai"
            type="number"
            onTextChange={(e) => setGrade(parseInt(e.toString()))}
          />
          <AttachmensViewer documents={submission?.documents} />
          <Button
            onClick={() =>
              updateSubmission({
                variables: {
                  id: submission?.id,
                  assigment_id: assigment?.id,
                  grade,
                  graded: true,
                },
              }).then(
                () => toast.success("Berhasil memberi nilai") && flipGrading()
              )
            }
          >
            Simpan
          </Button>
          <Button onClick={flipGrading}>TUTUP</Button>
        </div>
      </Modal>
      {loading ? (
        <LoadingComponent />
      ) : user?.roles == "STUDENT" ? (
        <div className="flex flex-col gap-4">
          <AssigmentDetail />
          <div className="flex flex-col gap-2 shadow rounded p-2">
            <div className="flex justify-between">
              <h1 className="font-semibold">Tugas Anda</h1>
              {assigment?.myassigmentsubmission?.turned_at && (
                <p>
                  {moment(assigment?.myassigmentsubmission?.turned_at).format(
                    "HH:MM DD/MM"
                  )}
                </p>
              )}
            </div>
            <hr />
            {!assigment?.myassigmentsubmission?.turned && (
              <Button onClick={flipSubmission}>TAMBAH TUGAS</Button>
            )}

            {assigment?.myassigmentsubmission?.turned ? (
              <Button
                color="RED"
                onClick={() =>
                  assigment?.myassigmentsubmission?.graded
                    ? toast.warning("Tugas Sudah dinilai !")
                    : updateSubmission({
                        variables: {
                          id: assigment?.myassigmentsubmission?.id,
                          assigment_id: assigment?.id,
                          turned: false,
                          turned_at: null,
                        },
                      })
                }
              >
                BATAL KUMPULKAN
              </Button>
            ) : (
              <Button
                color="GREEN"
                onClick={() =>
                  updateSubmission({
                    variables: {
                      id: assigment?.myassigmentsubmission?.id,
                      assigment_id: assigment?.id,
                      turned: true,
                      turned_at: moment().format(),
                    },
                  })
                }
              >
                KUMPULKAN
              </Button>
            )}
            <AttachmensViewer
              withDelete
              onDelete={refetch}
              documents={assigment?.myassigmentsubmission?.documents}
            />
          </div>
          <div className="flex flex-col gap-2 shadow rounded p-2">
            <div className="flex justify-between">
              <h1 className="font-semibold">Hasil</h1>
              {assigment?.myassigmentsubmission?.turned_at && (
                <p>
                  {moment(assigment?.myassigmentsubmission?.turned_at).format(
                    "HH:MM DD/MM"
                  )}
                </p>
              )}
            </div>
            <hr />
            <div className="p-2">
              <p>
                Nilai :{" "}
                {assigment?.myassigmentsubmission?.graded
                  ? assigment?.myassigmentsubmission?.grade
                  : "Belum dinilai"}
              </p>
              <p>
                Terakhir diubah pada :{" "}
                {moment(assigment?.myassigmentsubmission?.updated_at).format(
                  "HH:MM DD/MM"
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AssigmentDetail />
          <div className="flex flex-col gap-4 shadow rounded p-2">
            <h1 className="font-semibold">
              Terkumpul {assigment?.assigmentsubmissions?.length}/
              {assigment?.classroom?.users.length}
            </h1>
            {assigment?.assigmentsubmissions?.map((e) => (
              <div
                key={e.id}
                className="border-2 rounded p-2 grid grid-cols-12 gap-3"
              >
                <div className="col-span-2 flex items-center">
                  <ImageContainer
                    src={e.user.cover?.path}
                    fallback="profile"
                    width={75}
                    height={75}
                  />
                </div>
                <div className="col-span-8 flex flex-col gap-1">
                  <h1>{e.user.name}</h1>
                  {e.turned ? (
                    <p>
                      Dikumpulkan pada{" "}
                      {moment(e.turned_at).format("HH:MM DD/MM ")}
                    </p>
                  ) : (
                    <p>Belum dikumpulkan</p>
                  )}
                  <p>
                    {e.graded ? "Sudah dinilai " : "Belom dinilai"}
                    {e.grade != 0 && e.grade}
                  </p>
                </div>
                {e.graded ? (
                  <Button
                    color="RED"
                    className="col-span-2"
                    onClick={() =>
                      updateSubmission({
                        variables: {
                          assigment_id: assigment?.id,
                          id: e?.id,
                          grade: 0,
                          graded: false,
                        },
                      }).then(() => toast.success("Berhasil membatalkan aksi"))
                    }
                  >
                    <MdCancel />
                  </Button>
                ) : (
                  <Button
                    className="col-span-2"
                    onClick={() => {
                      flipGrading();
                      setSubmission(e);
                    }}
                  >
                    <BiPencil />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardContainer>
  );
}

export default withRouter(Id);
