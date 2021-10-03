import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import Loader from "../../../components/BoxLoader";
import Button from "../../../components/Button";
import { BaseCardSkeleton } from "../../../components/Card/BaseCard";
import ExamCard from "../../../components/Card/ExamCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import Input from "../../../components/Forms/Input";
import Paper from "../../../components/Paper";
import { CorePageInfoField } from "../../../fragments/fragments";
import { selectExtractor } from "../../../helpers/formatter";
import useTeacherData from "../../../hooks/useTeacherData";
import { useUserStore } from "../../../store/user";
import { Exam, Examtype, Subject, User } from "../../../types/type";
import examtypes from "../../admin/examtypes";
import subjects from "../../admin/subjects";

export default function Index() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
  const [subject, setSubject] = useState<undefined | string>(undefined);
  const [examtype, setExamtype] = useState<undefined | string>(undefined);
  const [odd, setOdd] = useState(false);
  const { user } = useUserStore();
  const { data: { subjectsAll, me, examtypesAll } = {} } = useQuery<{
    me: User;
    subjectsAll: Subject[];
    examtypesAll: Examtype[];
  }>(gql`
    query GetMeData {
      examtypesAll {
        id
        name
      }
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
        <Button href="/dashboard/teachers/exams/create">
          <BiPlus />
          Buat ujian baru
        </Button>
        <Paper name="Filter">
          <Input
            type="select"
            label="Ruang Kelas"
            values={me?.classrooms?.map(selectExtractor)}
            onTextChange={setClassroom}
            required
          />
          <Input
            type="checkbox"
            onCheckChange={setOdd}
            label="Semester Genap ?"
          />
          <Input
            type="select"
            label="Mata Pelajaran"
            values={subjectsAll?.map(selectExtractor)}
            onTextChange={setSubject}
          />
          <Input
            type="select"
            label="Tipe Ujian"
            values={examtypesAll?.map(selectExtractor)}
            onTextChange={setExamtype}
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
                <ExamCard {...e} buttonLabel="Buka Ujian" route="/exams/" />
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
