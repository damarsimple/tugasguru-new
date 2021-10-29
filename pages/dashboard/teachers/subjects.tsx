import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import BaseCard from "../../../components/Card/BaseCard";
import ConfirmModal from "../../../components/ConfirmModal";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import FormModal from "../../../components/FormModal";
import {
  selectExtractor,
  selectObjectExtractor,
} from "../../../helpers/formatter";
import { useUserStore } from "../../../store/user";
import { getTranslation } from "../../../translation";
import { GenericOutput, Subject, SubjectType } from "../../../types/type";

export default function Subjects() {
  const { user } = useUserStore();
  const {
    data: { subjectsAll } = {},
    loading,
    error,
    refetch: refetchSubject,
  } = useQuery<{ subjectsAll: Subject[] }>(
    gql`
      query GetSubject($user_id: ID) {
        subjectsAll(user_id: $user_id) {
          id
          name
        }
      }
    `,
    {
      variables: { user_id: user?.id },
    }
  );

  const { data: { subjectsAll: allSubjects } = {} } = useQuery<{
    subjectsAll: Subject[];
  }>(gql`
    query GetSubjects {
      subjectsAll {
        id
        name
      }
    }
  `);

  const [handleMutation] = useMutation<{
    deleteUserSubject: GenericOutput;
  }>(gql`
    mutation ($id: ID!) {
      deleteUserSubject(id: $id) {
        status
        message
      }
    }
  `);

  const mysubjects = subjectsAll?.map((e) => e.id);

  return (
    <DashboardContainer>
      <div className="flex  gap-2">
        <FormModal
          mutationQuery={gql`
            mutation AssignSubject($subject_id: ID!) {
              assignSubject(subject_id: $subject_id) {
                status
              }
            }
          `}
          openMessage="tambah mata pelajaran yang diajarkan"
          fields={"assignSubject"}
          submitName="Tambah"
          editAttributes={[
            {
              label: "Mata Pelajaran",
              type: "select",
              values: allSubjects
                ?.filter((e) => !mysubjects?.includes(e.id))
                .map(selectExtractor),
              required: true,
              name: "subject_id",
            },
          ]}
          afterSubmit={() => {
            toast.success("Berhasil menambah");
            refetchSubject();
          }}
        />
        <FormModal
          mutationQuery={gql`
            mutation CreateReportAdmin($metadata: String) {
              createReportAdmin(
                input: {
                  receiver_id: "1"
                  name: "Pengajuan Mata Pelajaran"
                  type: ADD_SUBJECT
                  metadata: $metadata
                }
              ) {
                id
              }
            }
          `}
          openMessage="ajukan mata pelajaran"
          fields={"createReportAdmin"}
          submitName="Ajukan"
          editAttributes={[
            {
              label: "Nama Mata Pelajaran",
              required: true,
              name: "metadata.name",
            },
            {
              label: "Tipe Mata Pelajaran",
              required: true,
              type: "select",
              values: selectObjectExtractor(SubjectType).map((e) => ({
                ...e,
                name: getTranslation(e.name),
              })),
              name: "metadata.content",
            },
          ]}
          afterSubmit={() => {
            toast.success("Berhasil mengajukan");
            refetchSubject();
          }}
        />
        {/* <FormModal
              openMessage="ajukan mata pelajaran"
              createQuery={gql`
                mutation AssignSubject($subject_id: ID!) {
                  assignSubject(subject_id: $subject_id) {
                    id
                  }
                }
              `}
            /> */}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {subjectsAll?.map((e) => (
          <div key={e.id}>
            <div className="shadow rounded p-4 grid grid-cols-12">
              <div className="col-span-10 flex items-center">
                <h1 className="text-lg font-semibold text-center">{e.name}</h1>
              </div>
              <ConfirmModal
                title={`Anda yakin menghapus ${e.name} dari mata pelajaran yang anda ajarkan ?`}
                openMessage="X"
                next={() => {
                  handleMutation({ variables: { id: e.id } }).then((e) => {
                    toast.warn(e?.data?.deleteUserSubject.message);
                    refetchSubject();
                  });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardContainer>
  );
}
