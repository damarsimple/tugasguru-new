import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Loader from "../../../../components/BoxLoader";
import Button from "../../../../components/Button";
import PackageQuestionCard from "../../../../components/Card/PackageQuestionCard";
import QuestionCard from "../../../../components/Card/QuestionCard";
import UserCard, {
  UserCardSkeleton,
} from "../../../../components/Card/UserCard";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Form from "../../../../components/Forms/Form";
import Input from "../../../../components/Forms/Input";
import {
  CoreAnswerPlayField,
  CorePageInfoField,
} from "../../../../fragments/fragments";
import { selectExtractor } from "../../../../helpers/formatter";
import { makeId } from "../../../../helpers/generator";
import useTeacherData from "../../../../hooks/useTeacherData";
import {
  Exam,
  Examsession,
  Packagequestion,
  Question,
  School,
  User,
} from "../../../../types/type";

export default function Create() {
  const [handleCreateExam, { loading }] = useMutation(gql`
    mutation CreateExam(
      $name: String!
      $subject_id: ID!
      $classroom_id: ID!
      $questions: [ID!]!
      $supervisors: [ID!]!
      $odd: Boolean
      $examtype_id: ID!
      $examsessions: [CreateExamsession!]!
    ) {
      createExam(
        input: {
          examsessions: { create: $examsessions }
          examtype_id: $examtype_id
          is_odd_semester: $odd
          name: $name
          subject_id: $subject_id
          classroom_id: $classroom_id
          questions: { connect: $questions }
          supervisors: { connect: $supervisors }
        }
      ) {
        id
      }
    }
  `);

  const [subject, setSubject] = useState("");
  const [classroom, setClassroom] = useState("");

  const exampleExamsession = {
    name: "Sesi ke 1",
    token: makeId(5).toUpperCase(),
  };

  const [supervisors, setSupervisors] = useState<Array<User>>([]);
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [examsessions, setExamsessions] = useState<Array<Partial<Examsession>>>(
    [exampleExamsession]
  );
  const router = useRouter();
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

  const { myclassrooms, subjects, examtypes } = useTeacherData();

  const selectedClassroom = myclassrooms?.filter((e) => e.id == classroom)[0];
  const selectedSubject = subjects?.filter((e) => e.id == subject)[0];

  const filterVar = {
    classtype_id: selectedClassroom?.id,
    subject_id: selectedSubject?.id,
  };

  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Detail Ujian</Tab>
          <Tab>Tambah Soal Ujian</Tab>
          <Tab>Tampilkan Soal Ujian</Tab>
          <Tab>Sesi Ujian</Tab>
          <Tab>Pengawas</Tab>
        </TabList>
        <TabPanel>
          <div>
            <Form<Exam, { createExam: Exam }>
              attributes={[
                {
                  label: "Nama",
                  name: "name",
                  required: true,
                },
                {
                  label: "Tipe",
                  type: "select",
                  name: "examtype_id",
                  values: examtypes?.map(selectExtractor),
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
                  required: true,
                },
                {
                  label: "Tahun Ajaran Akhir",
                  name: "metadata.year_end",
                  type: "number",
                  required: true,
                },
                {
                  label: "Batas Waktu (menit)",
                  name: "metadata.time_limit",
                  type: "number",
                  required: true,
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
                if (name == "classroom_id") {
                  for (const x of myclassrooms ?? []) {
                    if (value == x?.id) {
                      setSchoolId(x.school.id);
                      setClassroom(x.id);
                      break;
                    }
                  }
                }
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
              mutationQuery={gql`
                mutation CreateExam(
                  $name: String!
                  $subject_id: ID!
                  $classroom_id: ID!
                  $questions: [ID!]!
                  $supervisors: [ID!]!
                  $odd: Boolean
                  $examtype_id: ID!
                  $examsessions: [CreateExamsession!]!
                ) {
                  createExam(
                    input: {
                      examsessions: { create: $examsessions }
                      examtype_id: $examtype_id
                      is_odd_semester: $odd
                      name: $name
                      subject_id: $subject_id
                      classroom_id: $classroom_id
                      questions: { connect: $questions }
                      supervisors: { connect: $supervisors }
                    }
                  ) {
                    id
                  }
                }
              `}
              fields={"createExam"}
              successMessage="Berhasil membuat Ujian !"
              afterSubmit={() => {
                router.back();
              }}
            />
          </div>
        </TabPanel>
        <TabPanel className="flex flex-col gap-3">
          Total soal saat ini {questions.length}
          <Button onClick={() => setShowpackage(!showpackage)}>
            {showpackage ? "Tunjukkan Soal" : "Tunjukkan Paket Soal"}
          </Button>
          {classroom || subject ? (
            <>
              {showpackage ? (
                <Loader<Packagequestion>
                  withSearchbar
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-3"
                  query={gql`
                    ${CorePageInfoField}
                    ${CoreAnswerPlayField}
                    query GetPackagequestions(
                      $first: Int!
                      $after: String
                      $name: String
                      $classtype_id: ID
                      $subject_id: ID
                    ) {
                      packagequestions(
                        first: $first
                        after: $after
                        name: $name
                        classtype_id: $classtype_id
                        subject_id: $subject_id
                      ) {
                        edges {
                          node {
                            id
                            name
                            questionsCount
                            classtype {
                              level
                            }
                            subject {
                              name
                            }
                            user {
                              name
                            }
                            questions {
                              id
                              metadata {
                                uuid
                                type
                                content
                                correctanswer
                                answers {
                                  ...CoreAnswerPlayField
                                }
                              }
                            }
                          }
                        }
                        pageInfo {
                          ...CorePageInfoField
                        }
                      }
                    }
                  `}
                  perPage={10}
                  fetchPolicy="network-only"
                  fields={"packagequestions"}
                  Component={(e) => {
                    return (
                      <div>
                        <PackageQuestionCard {...e} />
                        <Button
                          onClick={() => {
                            setQuestions([...questions, ...e.questions]);
                            toast.success("Berhasil menambah paket soal");
                          }}
                        >
                          TAMBAH SOAL
                        </Button>
                      </div>
                    );
                  }}
                  // SkeletonComponent={QuestionCard}
                  variables={filterVar}
                />
              ) : (
                <Loader<Question>
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-3"
                  query={gql`
                    ${CorePageInfoField}
                    ${CoreAnswerPlayField}
                    query GetQuestions(
                      $first: Int!
                      $after: String
                      $classtype_id: ID
                      $subject_id: ID
                    ) {
                      questions(
                        first: $first
                        after: $after
                        classtype_id: $classtype_id
                        subject_id: $subject_id
                      ) {
                        edges {
                          node {
                            id
                            metadata {
                              uuid
                              type
                              content
                              correctanswer
                              answers {
                                ...CoreAnswerPlayField
                              }
                            }
                          }
                        }
                        pageInfo {
                          ...CorePageInfoField
                        }
                      }
                    }
                  `}
                  perPage={10}
                  fetchPolicy="network-only"
                  fields={"questions"}
                  Component={(e) => {
                    return (
                      <QuestionCardWrapper
                        type="ADD"
                        {...e}
                        handleAdd={() => {
                          setQuestions([...questions, e]);
                          toast.success("Berhasil menambah soal ");
                        }}
                      />
                    );
                  }}
                  //   SkeletonComponent={QuestionCardSke}
                  variables={filterVar}
                />
              )}
            </>
          ) : (
            <p>
              Anda harus memilih ruang kelas dan mata pelajaran terlebih dahulu
              ...
            </p>
          )}
        </TabPanel>
        <TabPanel>
          <div className="flex flex-col gap-3">
            {questions.map((e) => (
              <QuestionCardWrapper
                type="DELETE"
                key={e.id}
                {...e}
                handleRemove={() => {
                  setQuestions(questions.filter((x) => x.id != e.id));
                  toast.success("Berhasil menghapus soal ");
                }}
              />
            ))}
          </div>
        </TabPanel>
        <TabPanel className="flex flex-col gap-2">
          <Button
            onClick={() => {
              setExamsessions([
                ...examsessions,
                {
                  ...exampleExamsession,
                  token: makeId(5).toUpperCase(),
                  name: "Sesi ke " + `${examsessions?.length + 1}`,
                },
              ]);
            }}
          >
            BUAT SESI BARU
          </Button>
          {examsessions?.map((e, i) => (
            <div key={i} className="shadow rounded p-10">
              {JSON.stringify(examsessions[i])}
              <Input
                label="Nama Sesi"
                onTextChange={(name) => {
                  const cp = examsessions;
                  cp[i] = { ...cp[i], name: name };
                  setExamsessions([...cp]);
                }}
                defaultValue={e.name}
                required
              />
              <Input
                label="Token"
                defaultValue={e.token}
                onTextChange={(token) => {
                  const cp = examsessions;
                  cp[i] = { ...cp[i], token };
                  setExamsessions([...cp]);
                }}
                required
              />
              <Input
                label="Dibuka Pada (WIB/GMT+7)"
                onTextChange={(open_at) => {
                  const cp = examsessions;
                  cp[i] = { ...cp[i], open_at };
                  setExamsessions([...cp]);
                }}
                type="datetime"
                required
                defaultValue={moment(e.open_at).add(1, "day").format()}
              />
              <Input
                label="Ditutup Pada (WIB/GMT+7)"
                onTextChange={(close_at) => {
                  const cp = examsessions;
                  cp[i] = { ...cp[i], close_at };
                  setExamsessions([...cp]);
                }}
                type="datetime"
                required
                defaultValue={moment(e.close_at).add(1, "day").format()}
              />
              <Button
                onClick={() => {
                  setExamsessions(examsessions.filter((x) => x.id != e.id));
                }}
                color="RED"
              >
                Hapus sesi ini
              </Button>
            </div>
          ))}
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

interface QuestionWrapper extends Question {
  type: "ADD" | "DELETE";
  handleAdd?: () => void;
  handleRemove?: () => void;
}

const QuestionCardWrapper = (e: QuestionWrapper) => {
  const handle = () => {
    if (e.type == "ADD") {
      e.handleAdd && e.handleAdd();
    } else {
      e.handleRemove && e.handleRemove();
    }
  };

  return (
    <div>
      <QuestionCard {...e} />
      <Button
        onClick={() => {
          handle();
        }}
      >
        {e.type == "DELETE" ? "hapus" : "tambah"} SOAL
      </Button>
    </div>
  );
};
