/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useMutation } from "@apollo/client";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React, { useEffect, useState } from "react";
import { MdPlayArrow, MdGamepad } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import FriendCard from "../../components/Card/FriendCard";
import AppContainer from "../../components/Container/AppContainer";
import Input from "../../components/Forms/Input";
import Quizgameplay from "../../components/Quizgameplay";
import {
  CoreAnswerPlayField,
  CoreQuizssesionPlayField,
} from "../../fragments/fragments";
import echo from "../../services/echo";
import { useQuizplayStore } from "../../store/quizplay";
import { useUserStore } from "../../store/user";
import { Quizplay, Quizsession, User } from "../../types/type";

const JOIN_QUIZSESSION = gql`
  ${CoreQuizssesionPlayField}
  mutation JoinQuizsession($password: String!) {
    joinQuizsession(input: { password: $password }) {
      quizsession {
        ...CoreQuizssesionPlayField
        quiz {
          id
        }
      }
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

function Join({ router }: { router: NextRouter }) {
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

  const [joinQuizsession] =
    useMutation<{ joinQuizsession: Quizplay }>(JOIN_QUIZSESSION);
  const [createQuizplay] =
    useMutation<{ createQuizplay: Quizplay }>(CREATE_QUIZPLAY);

  useEffect(() => {
    if (!quizsession) return;

    echo
      .join("quizsession." + quizsession.id)
      .here((users: User[]) => setPlayers(users))
      .joining((userA: User) => setPlayers([...players, userA]))
      .leaving((userA: User) =>
        setPlayers([...players.filter((x) => x.id == userA.id)])
      )
      .listen(
        "QuizsessionUpdated",
        ({ quizsession }: { quizsession: Quizsession }) => {
          if (quizsession.start_at) {
            setStarted(true);
          }
        }
      );

    return () => {};
  }, [quizsession]);

  const { password: passwordData } = router.query;

  useEffect(() => {
    setPassword(passwordData as string);
  }, [passwordData]);

  const [password, setPassword] = useState(passwordData as string);

  const { user } = useUserStore();

  const joinGame = () => {
    if (!password) {
      return toast.error("Anda belum mengisi password ...");
    }

    joinQuizsession({ variables: { password } }).then((e) => {
      if (!e.data) return;
      const quizsessionData: Quizsession = e.data?.joinQuizsession.quizsession;
      setQuizsession(quizsessionData);
      createQuizplay({
        variables: {
          id: quizsessionData?.quiz.id,
          sessionId: quizsessionData.id,
        },
      }).then((e) => {
        if (!e.data) return;
        const quizplayData: Quizplay = e.data?.createQuizplay;
        setMyquizplay(quizplayData);
        setQuizplays([...quizplays, quizplayData]);
      });
    });
  };

  return (
    <AppContainer>
      <div className="min-h-screen flex bg-black">
        {started ? (
          <Quizgameplay />
        ) : (
          <div className="m-auto">
            <div
              style={{ width: 400 }}
              className="bg-gray-800 shadow rounded p-4 flex flex-col gap-2"
            >
              {quizsession ? (
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
              ) : (
                <>
                  <Input
                    label="Password"
                    onTextChange={(e) => setPassword(e.toString())}
                    value={password}
                  />
                  <Button onClick={joinGame} color="GREEN">
                    <MdPlayArrow size="1.5em" color="white" />
                    Bergabung
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}

export default withRouter(Join);
