/* eslint-disable react-hooks/exhaustive-deps */
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React, { useEffect, useState } from "react";
import { MdGamepad, MdMusicNote, MdPlayArrow, MdShare } from "react-icons/md";
import Button from "../../components/Button";
import AppContainer from "../../components/Container/AppContainer";
import ImageContainer from "../../components/Container/ImageContainer";
import { Switch } from "@headlessui/react";
import { BsClock, BsPlusSquare, BsSoundwave } from "react-icons/bs";
import { BiLaugh } from "react-icons/bi";
import { AiOutlineSound } from "react-icons/ai";
import { useQuizplayStore } from "../../store/quizplay";
import { gql, useMutation, useQuery } from "@apollo/client";
import { makeId } from "../../helpers/generator";
import { Quizplay, Quizsession, User } from "../../types/type";
import {
  CoreAnswerPlayField,
  CoreGenericOutput,
  CoreQuestionPlayField,
  CoreQuizssesionPlayField,
} from "../../fragments/fragments";
import Quizgameplay from "../../components/Quizgameplay";
import echo from "../../services/echo";
import { useUserStore } from "../../store/user";
import FriendCard from "../../components/Card/FriendCard";
import QuizInvitationCard from "../../components/Card/QuizInvitationCard";
import moment from "moment";

const GET_FRIEND = gql`
  query GetMeFriend {
    me {
      followers {
        id
        name
        roles
        cover {
          path
        }
      }
      followings {
        id
        name
        roles
        cover {
          path
        }
      }
    }
  }
`;

const CREATE_QUIZSESSION = gql`
  ${CoreQuizssesionPlayField}
  mutation CreateQuizsession($id: ID!, $password: String!) {
    createQuizsession(input: { quiz_id: $id, password: $password }) {
      ...CoreQuizssesionPlayField
    }
  }
`;

const UPDATE_QUIZSESSION = gql`
  mutation UpdateQuizsession($id: ID!, $start_at: String, $finish_at: String) {
    updateQuizsession(
      id: $id
      input: { start_at: $start_at, finish_at: $finish_at }
    ) {
      start_at
      finish_at
    }
  }
`;

const CREATE_QUIZPLAY = gql`
  ${CoreAnswerPlayField}
  mutation CreateQuizplay($sessionId: ID!, $id: ID!) {
    createQuizplay(input: { quizsession_id: $sessionId, quiz_id: $id }) {
      id
      start_at
      finish_at
      grade
      graded
      answers_map {
        grade
        question
        answer {
          ...CoreAnswerPlayField
        }
      }
    }
  }
`;

function Id({ router }: { router: NextRouter }) {
  const {
    data: { me } = {},
    loading,
    error,
  } = useQuery<{ me: User }>(GET_FRIEND);

  const { id, multiplayer: IsMultiplayer } = router.query;
  const [multiplayer, setMultiplayer] = useState(!!IsMultiplayer);
  const {
    quizsession,
    setting,
    setSetting,
    started,
    quizplays,
    setQuizplays,
    setMyquizplay,
    setQuizsession,
    setStarted,
    setPlayers,
    players,
  } = useQuizplayStore();
  const [createQuizsession] =
    useMutation<{ createQuizsession: Quizsession }>(CREATE_QUIZSESSION);
  const [updateQuizsession] =
    useMutation<{ updateQuizsession: Quizsession }>(UPDATE_QUIZSESSION);

  const [createQuizplay] =
    useMutation<{ createQuizplay: Quizplay }>(CREATE_QUIZPLAY);

  const handlePrepare = (multiplayer?: boolean) => {
    createQuizsession({ variables: { id, password: makeId(8) } }).then((e) => {
      if (!e.data) return;
      const quizsessionData: Quizsession = e.data?.createQuizsession;
      setQuizsession(quizsessionData);
      user && setPlayers([...players, user]);
      createQuizplay({ variables: { id, sessionId: quizsessionData.id } }).then(
        (e) => {
          if (!e.data) return;
          const quizplayData: Quizplay = e.data?.createQuizplay;
          setMyquizplay(quizplayData);
          setQuizplays([...quizplays, quizplayData]);
        }
      );
    });
  };

  const handleGameStart = (quizsession: Quizsession) => {
    if (!quizsession) {
      return;
    }
    updateQuizsession({
      variables: { id: quizsession.id, start_at: moment().format() },
    }).then((e) => {
      if (!e.data) return;

      if (e.data.updateQuizsession.start_at) {
        setStarted(true);
      }
    });
  };

  const handleMultiplayer = () => {
    setMultiplayer(true);
    handlePrepare(true);
  };

  useEffect(() => {
    if (!quizsession) return;

    echo
      .join("quizsession." + quizsession.id)
      .here((users: User[]) => setPlayers(users))
      .joining((userA: User) => setPlayers([...players, userA]))
      .leaving((userA: User) =>
        setPlayers([...players.filter((x) => x.id == userA.id)])
      );

    return () => {};
  }, [quizsession]);

  const { user } = useUserStore();

  return (
    <AppContainer>
      <div className="bg-black flex min-h-screen pt-10">
        {started ? (
          <Quizgameplay />
        ) : (
          <>
            <div className="m-auto">
              <div className="grid grid-cols-2 gap-6">
                <div
                  style={{ width: 400 }}
                  className="bg-gray-800 shadow rounded p-4 flex flex-col gap-2"
                >
                  {quizsession && multiplayer ? (
                    <Button
                      onClick={() => handleGameStart(quizsession)}
                      color="GREEN"
                    >
                      <MdPlayArrow size="1.5em" color="white" />
                      MULAI PERMAINAN
                    </Button>
                  ) : (
                    <Button onClick={handlePrepare} color="GREEN">
                      <MdPlayArrow size="1.5em" color="white" />
                      MULAI
                    </Button>
                  )}
                  {!multiplayer ? (
                    <Button onClick={handleMultiplayer} color="BLUE">
                      <MdGamepad size="1.5em" color="white" />
                      AJAK TEMAN BERMAIN
                    </Button>
                  ) : (
                    <>
                      <h1 className="font-semibold text-sm text-white">
                        Peserta{" "}
                        <span className="h-6 w-6 rounded-full bg-red-300 text-white p-2">
                          {players.length}
                        </span>
                      </h1>
                      <div className="h-72 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-2">
                          {players?.map((e) => (
                            <FriendCard {...e} key={e.id} />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {multiplayer && (
                  <div
                    style={{ width: 400 }}
                    className="bg-gray-800 shadow rounded p-4 flex flex-col gap-2 max-h-96 overflow-y-auto"
                  >
                    <h1 className="font-semibold text-sm text-white">
                      {"Undang Pengikut"}
                    </h1>
                    {quizsession && (
                      <div className="grid grid-cols-1 gap-2">
                        {me?.followers?.map((e) => (
                          <QuizInvitationCard
                            user={e}
                            quizsession={quizsession}
                            key={e.id}
                          />
                        ))}
                        <hr />
                        {me?.followings?.map((e) => (
                          <QuizInvitationCard
                            user={e}
                            quizsession={quizsession}
                            key={e.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!multiplayer && (
                  <div
                    style={{ width: 400 }}
                    className="bg-gray-800 shadow rounded p-4 flex flex-col gap-2"
                  >
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-1">
                        <ImageContainer
                          fallback="quiz"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="col-span-5">
                        <h1 className="font-semibold text-sm text-white">
                          {"Quiz Name"}
                        </h1>
                        <p className="font-semibold text-sm text-white">
                          10 Soal
                        </p>
                      </div>
                    </div>
                    <Button color="GRAY">
                      <MdShare size="1.5em" color="white" />
                      Share
                    </Button>
                  </div>
                )}
                <div
                  style={{ width: 400 }}
                  className="bg-gray-800 shadow rounded p-4 flex flex-col gap-2"
                >
                  <h1 className="font-semibold text-sm text-white">
                    {"Settings"}
                  </h1>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <MdMusicNote size="1.5em" color="white" />
                        <h2 className="font-semibold text-sm text-white">
                          {"Musik"}
                        </h2>
                      </div>
                      <Switch
                        checked={setting.music}
                        onChange={() =>
                          setSetting({ ...setting, music: !setting.music })
                        }
                        className={`${
                          setting.music ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable Music</span>
                        <span
                          className={`${
                            setting.music ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <BiLaugh size="1.5em" color="white" />
                        <h2 className="font-semibold text-sm text-white">
                          {"Meme"}
                        </h2>
                      </div>
                      <Switch
                        checked={setting.memes}
                        onChange={() =>
                          setSetting({ ...setting, memes: !setting.memes })
                        }
                        className={`${
                          setting.memes ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable Meme</span>
                        <span
                          className={`${
                            setting.memes ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <AiOutlineSound size="1.5em" color="white" />
                        <h2 className="font-semibold text-sm text-white">
                          {"Efek Suara"}
                        </h2>
                      </div>
                      <Switch
                        checked={setting.sound_effect}
                        onChange={() =>
                          setSetting({
                            ...setting,
                            sound_effect: !setting.sound_effect,
                          })
                        }
                        className={`${
                          setting.sound_effect ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable Sound Effect</span>
                        <span
                          className={`${
                            setting.sound_effect
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <BsClock size="1.5em" color="white" />
                        <h2 className="font-semibold text-sm text-white">
                          {"Timer"}
                        </h2>
                      </div>
                      <Switch
                        checked={setting.timer}
                        onChange={() => {
                          setSetting({ ...setting, timer: !setting.timer });
                          console.log(setting.timer);
                        }}
                        className={`${
                          setting.timer ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                      >
                        <span className="sr-only">Enable Timer</span>
                        <span
                          className={`${
                            setting.timer ? "translate-x-6" : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppContainer>
  );
}

export default withRouter(Id);
