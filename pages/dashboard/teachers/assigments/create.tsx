import gql from "graphql-tag";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React from "react";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Form from "../../../../components/Forms/Form";
import { selectExtractor } from "../../../../helpers/formatter";
import useTeacherData from "../../../../hooks/useTeacherData";
import { Assigment } from "../../../../types/type";

function Create({ router }: { router: NextRouter }) {
  const { myclassrooms, subjects } = useTeacherData();
  return (
    <DashboardContainer>
      <div>
        <Form<Assigment, { createAssigment: Assigment }>
          attributes={[
            {
              label: "Nama",
              name: "name",
              required: true,
            },
            {
              label: "Ruang Kelas",
              type: "select",
              name: "classroom_id",
              values: myclassrooms?.map(selectExtractor),
              required: true,
            },
            {
              label: "Mata Pelajaran",
              type: "select",
              name: "subject_id",
              values: subjects?.map(selectExtractor),
              required: true,
            },
            {
              label: "Semester Genap",
              name: "is_odd_semester",
              type: "checkbox",
            },
            {
              label: "Tutup Pada",
              name: "close_at",
              type: "datetime",
              required: true,
            },
            {
              label: "Deskripsi",
              name: "metadata.description",
            },
          ]}
          mutationQuery={gql`
            mutation CreateAssigment(
              $name: String!
              $subject_id: ID!
              $close_at: String!
              $classroom_id: ID!
              $is_odd_semester: Boolean
              $metadata: String
            ) {
              createAssigment(
                input: {
                  is_odd_semester: $is_odd_semester
                  name: $name
                  subject_id: $subject_id
                  metadata: $metadata
                  close_at: $close_at
                  classroom_id: $classroom_id
                }
              ) {
                id
              }
            }
          `}
          fields={"createAssigment"}
          successMessage="Berhasil membuat tugas !"
          afterSubmit={() => {
            router.back();
          }}
        />
      </div>
    </DashboardContainer>
  );
}

export default withRouter(Create);
