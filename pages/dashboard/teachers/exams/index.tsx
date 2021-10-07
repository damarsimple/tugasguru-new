import gql from "graphql-tag";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Loader from "../../../../components/BoxLoader";
import Button from "../../../../components/Button";
import BaseCard, {
  BaseCardSkeleton,
} from "../../../../components/Card/BaseCard";
import ExamCard from "../../../../components/Card/ExamCard";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Input from "../../../../components/Forms/Input";
import Paper from "../../../../components/Paper";
import { CorePageInfoField } from "../../../../fragments/fragments";
import {
  BOOLEAN_SELECT_VALUE,
  selectExtractor,
  wildCardFormatter,
} from "../../../../helpers/formatter";
import useTeacherData from "../../../../hooks/useTeacherData";
import { useUserStore } from "../../../../store/user";
import { Exam, User } from "../../../../types/type";

export default function Index() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
  const [subject, setSubject] = useState<undefined | string>(undefined);
  const [examtype, setExamtype] = useState<undefined | string>(undefined);
  const [odd, setOdd] = useState(false);
  const { user } = useUserStore();
  const { subjects, myclassrooms, examtypes } = useTeacherData();
  return (
    <DashboardContainer>
      <div className="flex flex-col gap-2">
        <Button href="/dashboard/teachers/exams/create">
          <BiPlus />
          Buat ujian baru
        </Button>
        <Paper name="Filter">
          <Input
            type="select"
            label="Ruang Kelas"
            values={myclassrooms?.map(selectExtractor)}
            onTextChange={setClassroom}
            required
          />
          <Input
            type="select"
            label="Tipe Ujian"
            values={examtypes?.map(selectExtractor)}
            onTextChange={setExamtype}
          />
          <Input
            type="select"
            values={BOOLEAN_SELECT_VALUE}
            onCheckChange={setOdd}
            label="Semester Genap ?"
          />
          <Input
            type="select"
            label="Mata Pelajaran"
            values={subjects?.map(selectExtractor)}
            onTextChange={setSubject}
          />
        </Paper>
        {classroom ? (
          <Loader<Exam>
            query={gql`
              ${CorePageInfoField}
              query GetExams(
                $first: Int!
                $after: String
                $name: String
                $classroom_id: ID
                $subject_id: ID
                $examtype_id: ID
                $is_odd_semester: Boolean
              ) {
                exams(
                  first: $first
                  after: $after
                  name: $name
                  classroom_id: $classroom_id
                  subject_id: $subject_id
                  is_odd_semester: $is_odd_semester
                  examtype_id: $examtype_id
                ) {
                  edges {
                    node {
                      id
                      name
                      examplaysCount
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
            fields={"exams"}
            fetchPolicy="network-only"
            withSearchbar
            variables={{
              classroom_id: classroom,
              subject_id: subject,
              examtype_id: examtype,
              odd,
            }}
            Component={(e) => (
              <div>
                <ExamCard {...e} />
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
