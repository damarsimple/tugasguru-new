import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import { NextRouter, useRouter, withRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { MdCancel, MdEdit } from "react-icons/md";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Button from "../../../../components/Button";
import UserCard, {
  UserCardSkeleton,
} from "../../../../components/Card/UserCard";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import ImageContainer from "../../../../components/Container/ImageContainer";
import FormModal from "../../../../components/FormModal";
import Form from "../../../../components/Forms/Form";
import PaperLoading from "../../../../components/PaperLoading";
import Table from "../../../../components/Table";
import { selectExtractor } from "../../../../helpers/formatter";
import useTeacherData from "../../../../hooks/useTeacherData";
import {
  Exam,
  Examsession,
  Question,
  School,
  User,
} from "../../../../types/type";
import examtypes from "../../../admin/examtypes";
import subjects from "../../../admin/subjects";
import questions from "../questions";
import { exampleExamsession } from "./create";

function ID({ router }: { router: NextRouter }) {
  const { id } = router.query;
  const [subject, setSubject] = useState("");
  const [supervisors, setSupervisors] = useState<Array<User>>([]);
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [examsessions, setExamsessions] = useState<Array<Partial<Examsession>>>(
    [exampleExamsession]
  );
  const { myclassrooms, subjects, examtypes } = useTeacherData();
  const [schoolId, setSchoolId] = useState("");
  const [showpackage, setShowpackage] = useState(true);
  const { data: { school } = {}, loading: loadingSupervisors } = useQuery<{
    school: School;
  }>(
    gql`
      query GetSchool($id: ID!) {
        school(id: $id) {
          id
          name
          teachers {
            id
            name
            username
            cover {
              path
            }
          }
        }
      }
    `,
    {
      variables: { id: schoolId },
      fetchPolicy: "network-only",
    }
  );

  const {
    data: { exam } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ exam: Exam }>(
    gql`
      query GetExam($id: ID!) {
        exam(id: $id) {
          id
          name
          classroom {
            id
          }
          examplays {
            id
            graded
            grade
            user {
              id
              name
              cover {
                path
              }
            }
          }
          examsessions {
            id
            name
            token
            open_at
            close_at
          }
          metadata {
            hint
            description
            year_start
            year_end
            time_limit
            shuffle
            show_result
          }
        }
      }
    `,
    {
      variables: { id },
      onCompleted: (e) => {
        setSchoolId(e.exam.classroom.id);
      },
    }
  );

  if (error) return <p>{error.message}</p>;

  if (loading) return <PaperLoading />;

  return (
    <DashboardContainer>
      <Button href="/dashboard/teachers/exams">KEMBALI</Button>
      <div className="my-4" />
      <Tabs>
        <TabList>
          <Tab>Koreksi Ujian</Tab>
          <Tab>Detail</Tab>
          <Tab>Sesi Ujian</Tab>
          <Tab>Pengawas</Tab>
        </TabList>
        <TabPanel>
          {exam?.examplays.map((e, i) => (
            <div
              key={i}
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
                {e.graded ? (
                  <p>
                    Diubah pada {moment(e.updated_at).format("HH:MM DD/MM ")}
                  </p>
                ) : (
                  <p>Belum dikumpulkan</p>
                )}
                <p>
                  {e.graded ? "Sudah dinilai " : "Belom dinilai"}
                  {e.grade != 0 && e.grade}
                </p>
              </div>
              <Button
                color="BLUE"
                className="col-span-2 h-full"
                href={`/dashboard/teachers/exams/examplays/${e.id}`}
              >
                <MdEdit />
              </Button>
            </div>
          ))}
        </TabPanel>
        <TabPanel>
          <Form<Exam, { updateExam: Exam }>
            attributes={[
              {
                label: "Nama",
                name: "name",
              },
              {
                label: "Tipe",
                type: "select",
                name: "examtype_id",
                values: examtypes?.map(selectExtractor),
              },
              {
                label: "Mata Pelajaran",
                type: "select",
                name: "subject_id",
                values: subjects?.map(selectExtractor),
              },
              {
                label: "Deskripsi",
                name: "description",
              },
              {
                label: "Petunjuk",
                name: "hint",
              },
              {
                label: "Tahun Ajaran Awal",
                name: "metadata.year_start",
                type: "number",
              },
              {
                label: "Tahun Ajaran Akhir",
                name: "metadata.year_end",
                type: "number",
              },
              {
                label: "Batas Waktu (menit)",
                name: "metadata.time_limit",
                type: "number",
              },
              {
                label: "Acak",
                name: "metadata.shuffle",
                type: "checkbox",
              },
              {
                label: "Izinkan Melihat Hasil",
                name: "metadata.show_result",
                type: "checkbox",
              },
            ]}
            onValueChange={(name, value) => {
              if (name == "subject_id") {
                for (const x of myclassrooms ?? []) {
                  if (value == x?.id) {
                    setSubject(x.school.id);
                    break;
                  }
                }
              }
            }}
            addedValueMap={{
              examsessions,
              supervisors: supervisors.map((e) => e.id),
              questions: questions.map((e) => e.id),
            }}
            defaultValueMap={exam}
            mutationQuery={gql`
              mutation updateExam(
                $name: String!
                $subject_id: ID!
                $classroom_id: ID!
                $questions: [ID!]!
                $supervisors: [ID!]!
                $odd: Boolean
                $examtype_id: ID!
                $metadata: String
                $examsessions: [updateExamsession!]!
              ) {
                updateExam(
                  input: {
                    examsessions: { create: $examsessions }
                    examtype_id: $examtype_id
                    is_odd_semester: $odd
                    name: $name
                    subject_id: $subject_id
                    classroom_id: $classroom_id
                    metadata: $metadata
                    questions: { connect: $questions }
                    supervisors: { connect: $supervisors }
                  }
                ) {
                  id
                }
              }
            `}
            fields={"updateExam"}
            successMessage="Berhasil membuat Ujian !"
            afterSubmit={() => {
              router.back();
            }}
          />
        </TabPanel>
        <TabPanel>
          <FormModal
            addedValueMap={{
              exam_id: exam?.id,
            }}
            openMessage="Buat Sesi Baru"
            editAttributes={[
              {
                label: "Nama Sesi",
                name: "name",
                required: true,
              },
              {
                label: "Token",
                name: "token",
                required: true,
              },
              {
                label: "Dibuka Pada (WIB/GMT+7)",
                name: "open_at",
                type: "datetime",
                required: true,
              },
              {
                label: "Ditutup Pada (WIB/GMT+7)",
                name: "close_at",
                type: "datetime",
                required: true,
              },
            ]}
            mutationQuery={gql`
              mutation CreateExamsession(
                $name: String!
                $exam_id: ID!
                $token: String
                $open_at: String
                $close_at: String
              ) {
                createExamsession(
                  input: {
                    name: $name
                    exam_id: $exam_id
                    token: $token
                    open_at: $open_at
                    close_at: $close_at
                  }
                ) {
                  id
                }
              }
            `}
            fields={"createExamsession"}
            successMessage="Berhasil membuat Sesi baru !"
            afterSubmit={() => {
              refetch();
            }}
          />
          {exam?.examsessions && (
            <Table<Examsession>
              data={exam.examsessions}
              headers={[
                {
                  label: "Nama sesi",
                  name: "name",
                },
                {
                  label: "Token",
                  name: "token",
                },
                {
                  label: "Dibuka Pada (WIB/GMT+7)",
                  name: "open_at",
                },
                {
                  label: "Ditutup Pada (WIB/GMT+7)",
                  name: "close_at",
                },
              ]}
            />
          )}
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-2 gap-3">
            {schoolId ? (
              !loadingSupervisors ? (
                school?.teachers.map((e) => {
                  const inSide = !!supervisors.findIndex((x) => e.id == x.id);
                  return (
                    <UserCard
                      key={e.id}
                      {...e}
                      clickAction={() => {
                        inSide
                          ? setSupervisors([...supervisors, e])
                          : setSupervisors(
                              supervisors.filter((x) => x.id != e.id)
                            );
                      }}
                      actionLabel={
                        inSide ? "Tambah Pengawas" : "Hapus Pengawas"
                      }
                    />
                  );
                })
              ) : (
                [...Array(10)].map((e, i) => <UserCardSkeleton key={i} />)
              )
            ) : (
              <p>Anda harus memilih ruang kelas terlebih dahulu ...</p>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}

export default withRouter(ID);
