import { gql, useQuery } from "@apollo/client";
import React from "react";
import { toast } from "react-toastify";
import BaseCard from "../../../components/Card/BaseCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import FormModal from "../../../components/FormModal";
import { selectExtractor } from "../../../helpers/formatter";
import { useUserStore } from "../../../store/user";
import { Subject } from "../../../types/type";

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
              values: allSubjects?.map(selectExtractor),
              required: true,
              name: "subject_id",
            },
          ]}
          afterSubmit={() => {
            toast.success("Berhasil menambah");
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
            <BaseCard name={e.name} />
          </div>
        ))}
      </div>
    </DashboardContainer>
  );
}
