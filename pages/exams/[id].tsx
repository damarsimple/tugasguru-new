import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import React, { useState } from "react";
import { MdNotifications } from "react-icons/md";
import QRCode from "react-qr-code";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import BaseCard from "../../components/Card/BaseCard";
import ImageContainer from "../../components/Container/ImageContainer";
import Input from "../../components/Forms/Input";
import ErrorView from "../../components/View/ErrorView";
import LoadingView from "../../components/View/LoadingView";
import {
  CoreAnswerPlayField,
  CoreQuestionCopyField,
  CoreQuestionPlayField,
  CoreUserInfoMinimalField,
} from "../../fragments/fragments";
import { useExamStore } from "../../store/exam";
import { useUserStore } from "../../store/user";
import { Exam, ExamplayGenericOutput } from "../../types/type";

function Id({ router }: WithRouterProps) {
  const { id } = router.query;
  const {
    exam,
    examsession,
    setExam,
    setExamplay,
    setExamsession,
    setIsBegin,
    isBegin,
    examplay,
  } = useExamStore();
  const { loading, error } = useQuery<{ exam: Exam }>(
    gql`
      ${CoreQuestionPlayField}
      query GetExam($id: ID!) {
        exam(id: $id) {
          id
          name
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
      variables: { id },
      onCompleted: (e) => {
        setExam(e.exam);
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
          setPrepareStage("PREPARATION");
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  if (loading) return <LoadingView />;

  if (error) return <ErrorView error={error.message} />;

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
            <MdNotifications size="1.5em" /> {10}
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
              <TabPanel className="flex items-center justify-center"></TabPanel>
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
            <div></div>
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
                            console.log("logged");
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
                      setIsBegin(true);
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
