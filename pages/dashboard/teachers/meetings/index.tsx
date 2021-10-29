import gql from "graphql-tag";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Loader from "../../../../components/BoxLoader";
import Button from "../../../../components/Button";
import { BaseCardSkeleton } from "../../../../components/Card/BaseCard";
import MeetingCard from "../../../../components/Card/MeetingCard";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Input from "../../../../components/Forms/Input";
import Paper from "../../../../components/Paper";
import { CorePageInfoField } from "../../../../fragments/fragments";
import {
  BOOLEAN_SELECT_VALUE,
  selectExtractor,
} from "../../../../helpers/formatter";
import useTeacherData from "../../../../hooks/useTeacherData";
import { Meeting } from "../../../../types/type";

export default function Index() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
  const { myclassrooms } = useTeacherData();
  return (
    <DashboardContainer>
      <div className="flex flex-col gap-2">
        <Button href="/dashboard/teachers/meetings/create">
          <BiPlus />
          Buat meeting baru
        </Button>
        <Paper name="Filter">
          <Input
            type="select"
            label="Ruang Kelas"
            values={myclassrooms?.map(selectExtractor)}
            onTextChange={setClassroom}
            required
          />
        </Paper>
        {classroom ? (
          <Loader<Meeting>
            query={gql`
              ${CorePageInfoField}
              query MeetingQuery(
                $classroom_id: ID!
                $first: Int!
                $after: String
              ) {
                meetings(
                  first: $first
                  after: $after
                  classroom_id: $classroom_id
                ) {
                  edges {
                    node {
                      id
                      name
                      uuid
                    }
                  }
                  pageInfo {
                    ...CorePageInfoField
                  }
                }
              }
            `}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-10"
            perPage={20}
            fields={"meetings"}
            fetchPolicy="network-only"
            withSearchbar
            variables={{
              classroom_id: classroom,
            }}
            Component={(e) => (
              <div>
                <MeetingCard {...e} />
              </div>
            )}
            SkeletonComponent={BaseCardSkeleton}
          />
        ) : (
          <p>Anda harus memilih ruang kelas ...</p>
        )}
      </div>
    </DashboardContainer>
  );
}
