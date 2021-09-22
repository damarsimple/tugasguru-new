/* eslint-disable react-hooks/exhaustive-deps */
import { take } from "lodash";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";
import { FaLevelUpAlt } from "react-icons/fa";
import { MdShare, MdClose, MdClass, MdSubject } from "react-icons/md";
import echo from "../services/echo";
import { useUserStore } from "../store/user";
import { User, Quizsession, Quiz } from "../types/type";
import Button from "./Button";
import ImageContainer from "./Container/ImageContainer";
import Modal from "./Modal";
import create from "zustand";

interface UseStore {
  quiz: Quiz | null | undefined;
  quizsession: Quizsession | null | undefined;
  invitor: User | null | undefined;
  invitee: User | null | undefined;
  open: boolean;
  setOpen: (by: boolean) => void;
  setQuiz: (by: Quiz | null | undefined) => void;
  setQuizsession: (by: Quizsession | null | undefined) => void;
  setInvitor: (by: User | null | undefined) => void;
  setInvitee: (by: User | null | undefined) => void;
}

const useStore = create<UseStore>((set) => ({
  open: false,
  quiz: null,
  quizsession: null,
  invitor: null,
  invitee: null,
  setOpen: (open: boolean) => set({ open }),
  setQuiz: (quiz: Quiz | null | undefined) => set({ quiz }),
  setQuizsession: (quizsession: Quizsession | null | undefined) =>
    set({ quizsession }),
  setInvitor: (invitor: User | null | undefined) => set({ invitor }),
  setInvitee: (invitee: User | null | undefined) => set({ invitee }),
}));

export function QuizInvitePopup() {
  const { user } = useUserStore();
  const {
    quizsession,
    setQuizsession,
    open,
    setOpen,
    quiz,
    setQuiz,
    invitor,
    setInvitor,
    invitee,
    setInvitee,
  } = useStore();

  const flip = () => setOpen(!open);

  useEffect(() => {
    console.log("registering ...");
    if (!user) return;
    console.log("registered ...");

    echo
      .private("quizinvitation." + user.id)
      .listen(
        "QuizInvitation",
        ({
          invitee,
          invitor,
          match,
        }: {
          invitor: User;
          invitee: User;
          match: Quizsession;
        }) => {
          setOpen(true);
          setQuizsession(match);
          setQuiz(match.quiz);
          setInvitor(invitor);
          setInvitee(invitee);
        }
      );
  }, []);

  return (
    <Modal open={open} flip={flip}>
      <div>
        <div className="relative">
          <ImageContainer
            fallback="quiz"
            className="w-full"
            src={quiz?.cover?.path}
            alt={quiz?.name}
            width={200}
            height={150}
          />
          <div className="absolute top-0 right-0 flex m-6 gap-2 ">
            <div className="shadow rounded bg-blue-400 text-white p-2 font-semibold">
              <MdShare color="white" size="1.5em" />
            </div>
            <div className="shadow rounded bg-red-400 text-white p-2 font-semibold">
              <MdClose color="white" size="1.5em" />
            </div>
          </div>
          <div className="absolute bottom-0 flex flex-col m-6 ">
            <div className="flex gap-2 shadow rounded bg-gray-400 text-white p-2 font-semibold">
              <AiOutlineQuestionCircle color="white" size="1.5em" />
              {quiz?.questions?.length} Pertanyaan
            </div>
            <div className="flex gap-2 shadow rounded bg-gray-400 text-white mt-6 p-2 font-semibold">
              <BsPlay color="white" size="1.5em" />
              {quiz?.played_count} bermain
            </div>
          </div>
        </div>
        <h1 className="uppercase text-md font-bold p-4">
          Anda diundang bermain quiz oleh {invitee?.name ?? "Seseorang"}
        </h1>
        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="flex gap-2">
            <BiUser size="1.5em" /> {quiz?.user?.name}
          </div>
          <div className="flex gap-2">
            <MdClass size="1.5em" /> Kelas: {quiz?.classtype.level}
          </div>
          <div className="flex gap-2">
            <FaLevelUpAlt size="1.5em" /> Kesulitan: {quiz?.difficulty}
          </div>
          <div className="flex gap-2">
            <MdSubject size="1.5em" /> Mapel: {quiz?.subject.name}
          </div>
          <div className="col-span-2">Contoh Pertanyaan</div>
          <div className="col-span-2 mt-2 p-2 grid grid-cols-1 bg-gray-200">
            {take(quiz?.questions, 4).map((e, i) => (
              <div key={e.id}>
                {i + 1}. {e.metadata.content}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Link href={"/quiz/join?password=" + quizsession?.password}>
              <a className="w-full">
                <Button onClick={flip}>masuk ke game</Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
