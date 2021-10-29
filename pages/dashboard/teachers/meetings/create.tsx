import gql from "graphql-tag";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React from "react";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Form from "../../../../components/Forms/Form";
import { selectExtractor } from "../../../../helpers/formatter";
import { makeId } from "../../../../helpers/generator";
import useTeacherData from "../../../../hooks/useTeacherData";
import { Meeting } from "../../../../types/type";

function Create({ router }: { router: NextRouter }) {
  const { myclassrooms } = useTeacherData();
  return (
    <DashboardContainer>
      <div>
        <Form<Meeting, { createMeeting: Meeting }>
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
              label: "Mulai Pada",
              name: "open_at",
              type: "datetime",
              required: true,
            },
            {
              label: "Selesai Pada",
              name: "finish_at",
              type: "datetime",
              required: true,
            },
            {
              label: "Deskripsi",
              name: "metadata.description",
            },
          ]}
          defaultValueMap={{ uuid: makeId(5) }}
          mutationQuery={gql`
            mutation CreateMeeting(
              $name: String!
              $uuid: String!
              $classroom_id: ID!
              $open_at: String!
              $finish_at: String!
            ) {
              createMeeting(
                input: {
                  name: $name
                  uuid: $uuid
                  classroom_id: $classroom_id
                  open_at: $open_at
                  finish_at: $finish_at
                }
              ) {
                id
              }
            }
          `}
          fields={"createMeeting"}
          successMessage="Berhasil membuat meeting !"
          afterSubmit={() => {
            router.back();
          }}
        />
      </div>
    </DashboardContainer>
  );
}

export default withRouter(Create);
