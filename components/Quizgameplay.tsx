/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useQuizplayStore } from "../store/quizplay";
import { useSpring, animated, config, Spring } from "react-spring";
import { find, get } from "lodash";
import { Answer, QuestionType, Quizplay, User } from "../types/type";
import { checkAnswer, isCorrect } from "../helpers/questions";
import echo from "../services/echo";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import Button from "./Button";
import { FaCoins, FaMedal } from "react-icons/fa";
import QuestionCard from "./Card/QuestionCard";
import Input from "./Forms/Input";
import { makeId } from "../helpers/generator";

const Transition = (e: {
  children: JSX.Element | JSX.Element[] | string;
  className?: string;
}) => {
  const styles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <animated.div
      className={e.className}
      style={{
        ...styles,
      }}
    >
      {e.children}
    </animated.div>
  );
};

const Color = ["#4ddae7", "#8de74d", "#4d56e8", "#e84d4d"];

interface GameMessage {
  type: "incorrect" | "correct";
  message: string;
}

const UPDATE_QUIZPLAY = gql`
  mutation UpdateQuizplay(
    $id: ID!
    $grade: Float!
    $answers_map: String
    $graded: Boolean
    $start_at: DateTime
    $finish_at: DateTime
  ) {
    updateQuizplay(
      id: $id
      input: {
        grade: $grade
        graded: $graded
        answers_map: $answers_map
        start_at: $start_at
        finish_at: $finish_at
      }
    ) {
      id
    }
  }
`;

export default function Quizgameplay() {
  const {
    index,
    setIndex,
    setting,
    quizplays,
    myquizplay,
    quizsession,
    finished,
    setFinished,
    setMyquizplay,
    setPlayers,
    players,
    setQuizplays,
  } = useQuizplayStore();

  const [updateQuizplay] = useMutation(UPDATE_QUIZPLAY);
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState<null | GameMessage>(null);

  const currentQuestion = quizsession?.quiz.questions[index];
  const [textAnswer, setTextAnswer] = useState("");
  useEffect(() => {
    if (!quizsession) return;

    interface EventQuizplay extends Quizplay {
      user_id: string;
    }

    echo
      .join("quizsession." + quizsession.id)
      .here((users: User[]) => setPlayers(users))
      .joining((user: User) => setPlayers([...players, user]))
      .leaving((user: User) =>
        setPlayers([...players.filter((x) => x.id == user.id)])
      )
      .listen(
        "QuizplayUpdated",
        function ({ quizplay }: { quizplay: EventQuizplay }) {
          if (find(quizplays, { id: quizplay.id })) {
            setQuizplays(
              [...quizplays].map((e) => {
                if (e.id == quizplay.id) {
                  return {
                    ...quizplay,
                    user: find(players, { id: quizplay.user_id }) as User,
                  };
                }
                return { ...e };
              })
            );
          } else {
            setQuizplays([
              ...quizplays,
              {
                ...quizplay,
                user: find(players, { id: quizplay.user_id }) as User,
              },
            ]);
          }
        }
      );

    return () => {};
  }, [quizsession]);

  const handleAnswer = (myanswer: Answer) => {
    if (!currentQuestion || !myquizplay) return;

    if (index == questions.length - 1) {
      setMyquizplay({ ...myquizplay, graded: true });
      setFinished(true);
    }

    const grade = checkAnswer(myanswer, currentQuestion);

    if (isCorrect(grade)) {
      setMessage({ type: "correct", message: "Kamu Benar !" });
    } else {
      setMessage({ type: "incorrect", message: "Kamu Salah !" });
    }

    const cp = {
      ...myquizplay,
      grade: myquizplay.grade + grade,
      answers_map: [
        ...(myquizplay.answers_map ?? []),
        { answer: myanswer, grade, question: currentQuestion.metadata.uuid },
      ],
    };

    setMyquizplay(cp);

    updateQuizplay({
      variables: { ...cp, answers_map: JSON.stringify(cp.answers_map) },
    }).catch(console.error);

    setShow(false);
    setTextAnswer("");
    setTimeout(() => setShow(true), 300);
    setTimeout(() => setMessage(null), 1500);
    setIndex(index + 1);
  };

  const [result, setResult] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const WIDTH = 200;
  const HEIGHT = 400;

  if (!quizsession) return <></>;
  const { quiz } = quizsession;

  const { questions } = quiz;
  const ranks = quizplays.sort((e, b) => b.grade - e.grade);
  const percentage = (myquizplay?.grade ?? 0) / questions.length;
  const answerMap: { [e: string]: Answer } =
    myquizplay?.answers_map?.reduce((prev, current) => {
      if (!current.question) return prev;
      return { ...prev, [current.question]: current.answer };
    }, {}) ?? {};

  if (result) {
    return (
      <div className="shadow rounded p-4 w-full flex flex-col gap-2 h-full px-56 pt-20">
        <div className="bg-gray-900 p-4 shadow rounded">
          <h1 className="font-bold text-lg text-white">
            Akurasi {percentage.toFixed(0)}%{JSON.stringify(ranks[1].user)}
          </h1>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
              ></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-gray-900 p-4 shadow rounded">
          <div className="bg-gray-800 p-4 shadow rounded flex justify-between">
            <div className="flex flex-col gap-1 text-white">
              <div>Peringkat</div>
              <div>
                {quizplays?.reduce((prev, cur) => {
                  if (cur.id == myquizplay?.id) {
                    return prev + 1;
                  } else {
                    prev != 0;
                  }
                  {
                    return prev;
                  }
                }, 0)}
                /{quizplays.length}
              </div>
            </div>
            <div>
              <FaMedal color="white" size="3.5em" />
            </div>
          </div>
          <div className="bg-gray-800 p-4 shadow rounded flex justify-between">
            <div className="flex flex-col gap-1 text-white">
              <div>Skor</div>
              <div>{myquizplay?.grade}</div>
            </div>
            <div>
              <FaCoins color="white" size="3.5em" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 bg-gray-900 p-4 shadow rounded overflow-y-auto overflow-x-hidden">
          <h1 className="font-bold text-lg text-white">Hasil</h1>
          {questions.map((e, i) => (
            <QuestionCard
              index={i + 1}
              {...e}
              key={e.id}
              correct={
                answerMap[e.metadata.uuid]?.uuid == e.metadata.correctanswer
              }
              myanswer={answerMap[e.metadata.uuid]?.uuid}
            />
          ))}
        </div>
      </div>
    );
  }
  if (finished)
    return (
      <div className="bg-gray-900 text-white pt-16 w-full">
        <div className="flex h-full">
          <div className="m-auto grid grid-cols-3 gap-4">
            {showFirst ? (
              <Spring
                from={{ opacity: 0, transform: "scale(0)" }}
                to={{
                  opacity: 1,
                  transform: "scale(1.3)",
                }}
                config={config.default}
                onRest={() => {
                  setTimeout(() => {
                    setResult(true);
                  }, 3000);
                }}
              >
                {(styles) => (
                  <animated.div
                    style={{ ...styles, width: WIDTH, height: HEIGHT }}
                    className="bg-gray-800 shadow rounded text-center p-4 order-2"
                  >
                    <div className="flex justify-center my-24">
                      <div className="p-4 h-24 w-24 border-2 border-yellow-400 rounded-full flex">
                        <div className="m-auto">
                          <span className="text-4xl">1</span>
                        </div>
                      </div>
                    </div>
                    <div>{ranks[0]?.user?.name}</div>
                    <div>{ranks[0]?.grade}</div>
                  </animated.div>
                )}
              </Spring>
            ) : (
              <div />
            )}
            {showSecond ? (
              <Spring
                from={{ opacity: 0, width: 0, height: 0 }}
                to={{
                  opacity: 1,
                  width: WIDTH,
                  height: HEIGHT,
                }}
                config={config.default}
                onRest={() => {
                  setTimeout(() => {
                    setShowFirst(true);
                  }, 1500);
                }}
              >
                {(styles) => (
                  <animated.div
                    style={styles}
                    className="bg-gray-800 shadow rounded text-center p-4 order-first"
                  >
                    <div className="flex justify-center my-24">
                      <div className="p-4 h-24 w-24 border-2 border-gray-400 rounded-full flex">
                        <div className="m-auto">
                          <span className="text-4xl">2</span>
                        </div>
                      </div>
                    </div>
                    <div>{ranks[1]?.user?.name}</div>
                    <div>{ranks[1]?.grade}</div>
                  </animated.div>
                )}
              </Spring>
            ) : (
              <div />
            )}
            <Spring
              from={{ opacity: 0, width: 0, height: 0 }}
              to={{ opacity: 1, width: WIDTH, height: HEIGHT }}
              config={config.default}
              onRest={() => {
                setTimeout(() => {
                  setShowSecond(true);
                }, 1000);
              }}
            >
              {(styles) => (
                <animated.div
                  style={styles}
                  className="bg-gray-800 shadow rounded text-center p-4 order-last"
                >
                  <div className="flex justify-center my-24">
                    <div className="p-4 h-24 w-24 border-2 border-red-400 rounded-full flex">
                      <div className="m-auto">
                        <span className="text-4xl">3</span>
                      </div>
                    </div>
                  </div>
                  <div>{ranks[2]?.user?.name}</div>
                  <div>{ranks[2]?.grade}</div>
                </animated.div>
              )}
            </Spring>
          </div>
        </div>
      </div>
    );

  return (
    <div className="text-white text-4xl font-bold h-full w-full bg-gray-900 pt-14">
      {show && (
        <Transition className="flex flex-col h-full">
          <div className="h-1/2 flex m-auto text-center min-w-full">
            <div className="m-auto">
              {index + 1}. {questions[index].metadata.content}
            </div>
          </div>
          <div className="h-1/2 min-w-full">
            {questions[index].metadata.type == QuestionType.Multi_choice ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 p-4 h-full">
                {questions[index].metadata.answers.map((e, i) => (
                  <button
                    className="shadow rounded p-4 text-center min-h-full"
                    key={e.uuid}
                    onClick={() => handleAnswer(e)}
                    style={{
                      backgroundColor: get(Color, i) ?? "lightblue",
                    }}
                  >
                    {e.content}
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-full w-full">
                <Input
                  label="Jawaban Anda"
                  value={textAnswer}
                  onTextChange={(e) => setTextAnswer(e.toString())}
                />
                <Button
                  onClick={() =>
                    handleAnswer({
                      content: textAnswer,
                      uuid: makeId(5),
                      attachment: "",
                      attachment_type: "",
                    })
                  }
                >
                  MASUKKAN JAWABAN
                </Button>
              </div>
            )}
          </div>
        </Transition>
      )}

      {message && (
        <Transition
          className={
            "fixed bottom-0 w-full  z-50 h-12 text-center " +
            (message.type == "correct" ? "bg-green-300" : "bg-red-300")
          }
        >
          {message.message}
        </Transition>
      )}
    </div>
  );
}
