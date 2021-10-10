/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useMutation, useQuery } from "@apollo/client";
import { groupBy, shuffle, uniq } from "lodash";
import moment from "moment";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { AiOutlineLoading } from "react-icons/ai";
import { MdNotifications } from "react-icons/md";
import QRCode from "react-qr-code";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import BaseCard from "../../components/Card/BaseCard";
import ImageContainer from "../../components/Container/ImageContainer";
import { Editor } from "../../components/Editor";
import Input from "../../components/Forms/Input";
import HTMLRenderer from "../../components/HTMLRenderer";
import ErrorView from "../../components/View/ErrorView";
import LoadingView from "../../components/View/LoadingView";
import {
  CoreAnswerPlayField,
  CoreQuestionCopyField,
  CoreQuestionPlayField,
  CoreUserInfoMinimalField,
} from "../../fragments/fragments";
import { makeId, makeUUID } from "../../helpers/generator";
import useDebounces from "../../hooks/useDebounces";
import { useExamStore } from "../../store/exam";
import { useUserStore } from "../../store/user";
import {
  Answer,
  AnswerMap,
  Exam,
  Examplay,
  ExamplayGenericOutput,
  Question,
  QuestionType,
} from "../../types/type";

function Id({ router }: WithRouterProps) {
  const { id } = router.query;
  const {
    exam,
    examsession,
    isBegin,
    examplay,
    questionsMaps,
    answersMaps,
    setAnswersMaps,
    setQuestionsMaps,
    setExam,
    setExamplay,
    setExamsession,
    setIsBegin,
  } = useExamStore();
  const { loading, error } = useQuery<{ exam: Exam }>(
    gql`
      ${CoreQuestionPlayField}
      query GetExam($id: ID!) {
        exam(id: $id) {
          id
          name
          subject {
            id
            name
          }
          classroom {
            id
            user {
              id
              name
            }
          }
          questions {
            ...CoreQuestionPlayField
          }
          supervisors {
            id
            name
          }
          description
          hint
          time_limit
          year_start
          year_end
          examsessions {
            id
            name
            open_at
            close_at
            agenda {
              id
              uuid
            }
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only",
      variables: { id: id },
      onCompleted: (e) => {
        setExam(e.exam);

        type QMap = Record<string, Partial<Question>>;

        const qmaps: QMap = {};
        const questions = exam?.shuffle
          ? shuffle(e.exam.questions)
          : e.exam.questions;
        for (const x of questions) {
          if (!x.metadata?.uuid) return;

          qmaps[x.metadata.uuid] = {
            ...x,
          };
        }

        setQuestionsMaps(qmaps);

        setCurrentid(Object.keys(qmaps)[0]);

        handleDebounce();
      },
    }
  );

  const { user } = useUserStore();

  const [prepareStage, setPrepareStage] = useState("INITIAL");
  const [token, setToken] = useState("");

  const [handleSubmit, { loading: loadingToken }] = useMutation<{
    submitExamToken: ExamplayGenericOutput;
  }>(gql`
    ${CoreAnswerPlayField}
    ${CoreQuestionCopyField}
    mutation SubmitExamToken($examsession_id: ID!, $token: String!) {
      submitExamToken(token: $token, examsession_id: $examsession_id) {
        status
        message
        examplay {
          id
          last_activity
          minute_passed
          start_at
          finish_at
          grade
          graded
          answers_map {
            answer {
              ...CoreAnswerPlayField
            }
            question {
              ...CoreQuestionCopyField
            }
            grade
          }
        }
      }
    }
  `);

  const handleSubmitToken = () => {
    handleSubmit({ variables: { token, examsession_id: examsession?.id } })
      .then((e) => {
        toast.warn(e.data?.submitExamToken?.message);
        if (e.data?.submitExamToken.status) {
          if (
            e.data?.submitExamToken?.examplay?.finish_at ||
            e.data?.submitExamToken?.examplay?.graded
          ) {
            toast.error("Anda sudah mengerjakan ujian ini!");
            return;
          }
          setPrepareStage("PREPARATION");
          setExamplay(e?.data?.submitExamToken?.examplay as Examplay);
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const grouped = groupBy(
    Object.keys(questionsMaps).map((id) => {
      return {
        id,
        ...questionsMaps[id],
      };
    }),
    "metadata.type"
  );

  const indexMaps = Object.values(grouped)
    .flat()
    .map((e) => e.metadata?.uuid);

  const handleMove = (direction: "NEXT" | "PREV") => {
    if (direction == "NEXT") {
      const value = indexMaps.at(currentindex + 1);
      if (value) {
        setCurrentid(value);
        setCurrentindex(currentindex + 1);
      }
    } else {
      if (currentindex == 0) return;
      const value = indexMaps.at(currentindex - 1);
      if (value) {
        setCurrentid(value);
        setCurrentindex(currentindex - 1);
      }
    }
  };

  const [currentid, setCurrentid] = useState<undefined | string>(undefined);
  const [currentindex, setCurrentindex] = useState<number>(0);
  const { ready, handleDebounce } = useDebounces();

  const currentQuestion = currentid && questionsMaps[currentid];

  const checkAnswered = (e: string) => !!answersMaps[e]?.content;

  const [updateExamplay] = useMutation<{
    handleExamplay: ExamplayGenericOutput;
  }>(gql`
    mutation HandleExamplay(
      $type: ExamplayReportType!
      $id: ID!
      $answers_maps: String!
      $last_activity: String!
    ) {
      handleExamplay(
        type: $type
        id: $id
        answers_maps: $answers_maps
        last_activity: $last_activity
      ) {
        status
        message
      }
    }
  `);

  const getAnswerMaps = () => {
    const maps: AnswerMap[] = [];

    for (const x in questionsMaps) {
      const amap: AnswerMap = {
        answer: answersMaps[x] as Answer,
        question: questionsMaps[x] as Question,
        grade: 0,
        comment: null,
      };

      maps.push(amap);
    }
    return maps;
  };

  const handleSaveAnswer = () => {
    updateExamplay({
      variables: {
        id: examplay?.id,
        type: "SAVE",
        answers_maps: JSON.stringify(getAnswerMaps()),
        last_activity: moment().format(),
      },
    });

    handleMove("NEXT");
  };

  const handleHeartBeat = () => {
    updateExamplay({
      variables: {
        id: examplay?.id,
        type: "BEAT",
        answers_maps: JSON.stringify(getAnswerMaps()),
        last_activity: moment().format(),
      },
    });
  };

  const handleFinish = () => {
    updateExamplay({
      variables: {
        id: examplay?.id,
        type: "FINISH",
        answers_maps: JSON.stringify(getAnswerMaps()),
        last_activity: moment().format(),
      },
    }).then((e) => {
      if (e.data?.handleExamplay.status) {
        if (exam?.show_result) router.push(`/exams/${exam.id}/results`);
        else router.push("/dashboard");
      }
    });

    handleInterval.current && clearInterval(handleInterval.current);
  };

  const renderer = ({
    hours,
    minutes,
    seconds,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => (
    <span>
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );

  const handleInterval = useRef<any>(null);

  const [endDate, setEndDate] = useState<undefined | Date>(undefined);

  const handleBegin = () => {
    if (!examplay || !exam) return;
    console.log(exam.time_limit - (examplay?.minute_passed ?? 0));

    setEndDate(
      moment()
        .add(exam.time_limit - (examplay?.minute_passed ?? 0), "minute")
        .toDate()
    );
    setIsBegin(true);
    handleInterval.current = setInterval(() => {
      handleHeartBeat();
    }, 60000);
  };

  if (!id) return <p>id tidak ditemukan</p>;

  if (loading) return <LoadingView />;

  if (error) return <ErrorView error={error.message} />;

  if (!exam) return <p>Unknown Error ...</p>;

  return (
    <div>
      <nav className="bg-primary-base fixed top-0 w-full shadow  p-1 md:p-3 flex justify-between z-50 h-14">
        <div>
          <Link href="/">
            <a className="flex gap-1">
              <ImageContainer
                className="h-10 w-10"
                src="/android-chrome-192x192.png"
              />
              <h1 className="hidden md:block text-white text-xl font-bold">
                {"UJIAN - TUGAS GURU"}
              </h1>
            </a>
          </Link>
        </div>

        <div className="flex gap-2 text-white">
          <button className="flex p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
            {endDate && (
              <Countdown
                date={endDate}
                intervalDelay={0}
                precision={3}
                renderer={renderer}
                onComplete={handleFinish}
              />
            )}
          </button>
        </div>
      </nav>
      <div className="grid grid-cols-12 h-screen pt-16 gap-3">
        <div className="col-span-12 sm:col-span-4 md:col-span-3 shadow rounded">
          <Tabs>
            <TabList>
              {!isBegin && <Tab>QR</Tab>}
              {isBegin && <Tab>Pertanyaan</Tab>}
              <Tab>Pengawas</Tab>
            </TabList>
            {!isBegin && (
              <TabPanel className="flex items-center justify-center">
                {examsession ? (
                  <QRCode value={examsession.agenda.uuid} size={200} />
                ) : (
                  <p>Anda harus memilih sesi terlebih dahulu ... </p>
                )}
              </TabPanel>
            )}
            {isBegin && (
              <TabPanel className="flex flex-col gap-3 items-center justify-center">
                <div className="flex flex-col gap-2">
                  {Object.keys(QuestionType).map((e, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="grid grid-cols-2">
                        <h1>{(QuestionType as any)[e]}</h1>
                      </div>
                      <div className="p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {grouped[(QuestionType as any)[e]]?.map((e, x) => (
                          <Button
                            onClick={() => {
                              setCurrentid(e.metadata?.uuid);
                              handleDebounce();
                              setCurrentindex(i + x);
                            }}
                            key={x}
                            color={
                              currentid == e.metadata?.uuid
                                ? "BLUE"
                                : checkAnswered(e.metadata?.uuid ?? "")
                                ? "GREEN"
                                : "YELLOW"
                            }
                          >
                            {x + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={handleFinish}>Selesai</Button>
              </TabPanel>
            )}

            <TabPanel className="flex flex-col gap-2">
              {exam?.supervisors.map((e) => {
                return <BaseCard {...e} key={e.id} />;
              })}
            </TabPanel>
          </Tabs>
        </div>
        <div className="col-span-12 sm:col-span-8 md:col-span-9 shadow rounded ">
          {isBegin ? (
            currentQuestion && (
              <div className="min-h-full flex flex-col items-center gap-4 p-20">
                {!ready ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <AiOutlineLoading className="animate-spin" size="5em" />
                  </div>
                ) : (
                  <>
                    <div className="h-1/2">
                      <HTMLRenderer
                        className="text-xl"
                        html={currentQuestion?.metadata?.content}
                      />
                    </div>
                    <div className="h-1/2 w-full flex flex-col gap-3">
                      {currentQuestion?.metadata?.type ==
                      QuestionType.Multi_choice ? (
                        <div className="grid grid-cols-1 gap-2 w-full">
                          {currentQuestion.metadata.answers?.map((e) => (
                            <Button
                              onClick={() => {
                                if (!currentQuestion.metadata?.uuid) return;
                                setAnswersMaps({
                                  ...answersMaps,
                                  [currentQuestion.metadata?.uuid]: e,
                                });

                                handleSaveAnswer();
                              }}
                              key={e.uuid}
                              color={true ? "BLUE" : "GREEN"}
                            >
                              <HTMLRenderer html={e.content ?? ""} />
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <Editor
                            defaultValue={
                              (currentQuestion.metadata?.uuid &&
                                answersMaps[currentQuestion.metadata?.uuid]
                                  ?.content) ??
                              ""
                            }
                            onChange={(e) => {
                              if (!currentQuestion.metadata?.uuid) return;
                              setAnswersMaps({
                                ...answersMaps,
                                [currentQuestion.metadata?.uuid]: {
                                  uuid: makeUUID(),
                                  content: e,
                                },
                              });
                            }}
                          />
                        </div>
                      )}
                      <Button onClick={handleSaveAnswer}>SIMPAN</Button>
                      <div className="flex gap-3">
                        <Button onClick={() => handleMove("PREV")}>
                          SEBELUMNYA
                        </Button>
                        <Button onClick={() => handleMove("NEXT")}>
                          SELANJUTNYA
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          ) : (
            <>
              {prepareStage == "INITIAL" && (
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                  <ImageContainer
                    height={200}
                    width={200}
                    fallback="profile"
                    src={user?.cover?.path}
                  />
                  <h1 className="text-xl font-bold uppercase">{exam?.name}</h1>
                  <p className="text-md font-bold uppercase">
                    {exam?.classroom?.user?.name} - {exam.subject?.name}
                  </p>
                  <p className="text-md">{exam?.hint}</p>
                  <p className="text-md">{exam?.time_limit} Menit</p>
                  <p className="text-md">
                    {exam?.year_start}/{exam?.year_end}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-10">
                    <div className="col-span-2 text-center">
                      <h2 className="text-lg font-bold uppercase">
                        Silahkan Pilih Sesi Ujian
                      </h2>
                    </div>
                    {exam?.examsessions?.map((e) => {
                      return (
                        <Button
                          onClick={() => {
                            setExamsession(e);
                            setPrepareStage("TOKEN");
                            setToken("");
                          }}
                          disabled={!moment().isBetween(e.open_at, e.close_at)}
                          key={e.id}
                        >
                          {e.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              {prepareStage == "TOKEN" && (
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                  <Button
                    className="w-96"
                    onClick={() => {
                      setExamsession(undefined);
                      setPrepareStage("INITIAL");
                      setToken("");
                    }}
                  >
                    KEMBALI
                  </Button>
                  <Input label="TOKEN" onTextChange={setToken} value={token} />
                  <Button
                    loading={loadingToken}
                    onClick={handleSubmitToken}
                    className="w-96"
                  >
                    Validasi Token
                  </Button>
                </div>
              )}
              {prepareStage == "PREPARATION" && (
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                  <Button
                    className="w-96"
                    onClick={() => {
                      setToken("");
                      setPrepareStage("TOKEN");
                    }}
                  >
                    KEMBALI
                  </Button>
                  <Button
                    onClick={() => {
                      setToken("");
                      handleBegin();
                    }}
                    className="w-96"
                  >
                    Mulai
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Id);
