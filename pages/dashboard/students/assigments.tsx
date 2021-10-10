import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Loader from "../../../components/BoxLoader";
import Button from "../../../components/Button";
import AssigmentCard from "../../../components/Card/AssigmentCard";
import { BaseCardSkeleton } from "../../../components/Card/BaseCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import Input from "../../../components/Forms/Input";
import Paper from "../../../components/Paper";
import { CorePageInfoField } from "../../../fragments/fragments";
import {
  BOOLEAN_SELECT_VALUE,
  selectExtractor,
} from "../../../helpers/formatter";
import { useUserStore } from "../../../store/user";
import { User, Subject, Assigment } from "../../../types/type";

export default function Index() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
  const [subject, setSubject] = useState<undefined | string>(undefined);
  const [examtype, setExamtype] = useState<undefined | string>(undefined);
  const [odd, setOdd] = useState(false);
  const { user } = useUserStore();

  const { data: { subjectsAll, me } = {} } = useQuery<{
    me: User;
    subjectsAll: Subject[];
  }>(gql`
    query GetMeData {
      subjectsAll {
        id
        name
      }
      me {
        classrooms {
          id
          name
        }
      }
    }
  `);

  return (
    <DashboardContainer>
      <div className="flex flex-col gap-2">
        <Paper name="Filter">
          <Input
            type="select"
            label="Ruang Kelas"
            values={me?.classrooms?.map(selectExtractor)}
            onTextChange={setClassroom}
            required
          />
          <Input
            type="select"
            values={BOOLEAN_SELECT_VALUE}
            onCheckChange={setOdd}
            label="Semester Genap"
          />
          <Input
            type="select"
            label="Mata Pelajaran"
            values={subjectsAll?.map(selectExtractor)}
            onTextChange={setSubject}
          />
        </Paper>
        {classroom ? (
          <Loader<Assigment>
            query={gql`
              ${CorePageInfoField}
              query GetAssigments(
                $first: Int!
                $after: String
                $name: String
                $classroom_id: ID
                $subject_id: ID
                $is_odd_semester: Boolean
              ) {
                assigments(
                  first: $first
                  after: $after
                  name: $name
                  classroom_id: $classroom_id
                  subject_id: $subject_id
                  is_odd_semester: $is_odd_semester
                ) {
                  edges {
                    node {
                      id
                      name
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
            fields={"assigments"}
            fetchPolicy="network-only"
            withSearchbar
            variables={{
              classroom_id: classroom,
              subject_id: subject,
              odd,
            }}
            Component={(e) => (
              <div>
                <AssigmentCard {...e} buttonLabel="Buka Tugas" />
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
