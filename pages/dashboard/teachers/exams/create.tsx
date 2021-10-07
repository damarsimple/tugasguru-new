import { gql, useQuery } from "@apollo/client";
import { isEmpty, xor } from "lodash";
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
import ConfirmModal from "../../../../components/ConfirmModal";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Form from "../../../../components/Forms/Form";
import Input from "../../../../components/Forms/Input";
import {
  CoreAnswerPlayField,
  CorePageInfoField,
} from "../../../../fragments/fragments";
import {
  BOOLEAN_SELECT_VALUE,
  selectExtractor,
} from "../../../../helpers/formatter";
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

export const exampleExamsession = {
  name: "Sesi ke 1",
  token: makeId(5).toUpperCase(),
};
export default function Create() {
  const [subject, setSubject] = useState("");
  const [classroom, setClassroom] = useState("");

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

  const steps = [
    "Detail Ujian",
    "Tambah Soal Ujian",
    "Tampilkan Soal Ujian",
    "Sesi Ujian",
    "Pengawas",
  ];

  const [requireds, setRequireds] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [filled, setFilled] = useState<{ [e: string]: boolean }>({});

  const FORM_ATTR = [
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
      name: "year_start",
      type: "number",
      required: true,
    },
    {
      label: "Tahun Ajaran Akhir",
      name: "year_end",
      type: "number",
      required: true,
    },
    {
      label: "Batas Waktu (menit)",
      name: "time_limit",
      type: "number",
      required: true,
    },
    {
      label: "Acak",
      name: "shuffle",
      type: "select",
      values: BOOLEAN_SELECT_VALUE,
    },
    {
      label: "Izinkan Melihat Hasil",
      name: "show_result",
      type: "select",
      values: BOOLEAN_SELECT_VALUE,
    },
  ];

  const musts = FORM_ATTR.filter((e) => e.required).map((e) => e.name);

  return (
    <DashboardContainer>
      <div className="py-5 flex flex-row justify-center">
        {steps.map((e, i) => (
          <button
            key={i}
            onClick={() => {
              (tabIndex || filled[e]) && setTabIndex(i);
            }}
            className="flex flex-col w-24 items-center cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div
                className={`rounded-full ${
                  i < tabIndex || filled[e] ? "bg-blue-700" : "bg-gray-300"
                } text-sm text-blue-100 transition-all transform ease-in-out duration-200 w-6 h-6 font-bold flex justify-center relative`}
              >
                {i + 1}
              </div>
            </div>
            <div className="my-4 text-teal-700 text-xs text-center">{e}</div>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div>
          {filled["Detail Ujian"] && (
            <Button
              onClick={() =>
                setTabIndex(tabIndex > steps.length - 2 ? 0 : tabIndex + 1)
              }
            >
              Selanjutnya
            </Button>
          )}
        </div>
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList className="hidden">
            {steps?.map((e) => (
              <Tab key={e}>Detail Ujian</Tab>
            ))}
          </TabList>
          <TabPanel>
            <div>
              <Form<Exam, { createExam: Exam }>
                beforeSubmit={(e) => {
                  if (questions.length == 0) {
                    throw new Error("Anda belum memiliki soal !");
                  }
                }}
                attributes={FORM_ATTR}
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

                  if (!requireds.includes(name) && !!value) {
                    const newRequired = [...requireds, name];
                    setRequireds(newRequired);
                    setFilled({
                      ...filled,
                      ["Detail Ujian"]: isEmpty(xor(newRequired, musts)),
                    });
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
                    $metadata: String
                    $time_limit: Int!
                    $year_start: Int!
                    $year_end: Int!
                    $shuffle: Boolean
                    $show_result: Boolean
                    $examsessions: [CreateExamsessionMany!]!
                  ) {
                    createExam(
                      input: {
                        examsessions: { create: $examsessions }
                        examtype_id: $examtype_id
                        is_odd_semester: $odd
                        name: $name
                        subject_id: $subject_id
                        metadata: $metadata
                        classroom_id: $classroom_id
                        hint: $hint
                        description: $description
                        time_limit: $time_limit
                        year_start: $year_start
                        year_end: $year_end
                        shuffle: $shuffle
                        show_result: $show_result
                        questions: { connect: $questions }
                        supervisors: { connect: $supervisors }
                      }
                    ) {
                      id
                    }
                  }
                `}
                disableSubmit={
                  !(filled["Detail Ujian"] && filled["Tambah Soal Ujian"])
                }
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
                              setFilled({
                                ...filled,
                                ["Tambah Soal Ujian"]: true,
                                ["Tampilkan Soal Ujian"]: true,
                                ["Sesi Ujian"]: true,
                                ["Pengawas"]: true,
                              });
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
                Anda harus memilih ruang kelas dan mata pelajaran terlebih
                dahulu ...
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
                <ConfirmModal
                  openMessage="Hapus sesi ini"
                  next={() => {
                    setExamsessions(examsessions.filter((x) => x.id != e.id));
                  }}
                />
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
        <div>
          {filled["Detail Ujian"] && (
            <Button
              onClick={() =>
                setTabIndex(tabIndex > steps.length - 2 ? 0 : tabIndex + 1)
              }
            >
              Selanjutnya
            </Button>
          )}
        </div>
      </div>
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
