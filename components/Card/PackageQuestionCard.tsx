import { take } from "lodash";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineNumber, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";
import { FaLevelUpAlt } from "react-icons/fa";
import { MdClass, MdClose, MdSubject } from "react-icons/md";
import { Packagequestion, Question } from "../../types/type";
import Button from "../Button";
import Modal from "../Modal";

export default function PackageQuestionCard({
  name,
  classtype,
  user,
  subject,
  questionsCount,
  questions,
}: Packagequestion) {
  const [open, setOpen] = useState(false);
  const flip = () => setOpen(!open);
  return (
    <>
      <Modal open={open} flip={flip}>
        <div>
          <div className="relative">
            <div className="absolute top-0 right-0 flex m-6 gap-2 ">
              <Button color="RED" onClick={flip}>
                <MdClose color="white" size="1.5em" />
              </Button>
            </div>
            <div className="flex gap-2 shadow rounded bg-gray-400 text-white p-2 font-semibold">
              <AiOutlineQuestionCircle color="white" size="1.5em" />
              {name}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            <div className="flex gap-2">
              <BiUser size="1.5em" /> {user?.name}
            </div>
            <div className="flex gap-2">
              <MdClass size="1.5em" /> Kelas: {classtype.level}
            </div>

            <div className="flex gap-2">
              <MdSubject size="1.5em" /> Mapel: {subject.name}
            </div>
            <div className="col-span-2">Contoh Pertanyaan</div>
            <div className="col-span-2 mt-2 p-2 grid grid-cols-1 bg-gray-200">
              {take(questions, 4).map((e, i) => (
                <div key={`${e.id}-${i}`}>
                  {i + 1}. {e.metadata?.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <div className="shadow rounded bg-gray-800 flex">
        <div className="bg-white w-full p-4">
          <button onClick={flip}>
            <div className="truncate">{name}</div>
          </button>
          <hr className="my-4" />

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <BiUser size="1.5em" /> {user?.name}
            </div>
            <div className="flex gap-2">
              <MdClass size="1.5em" /> Kelas: {classtype.level}
            </div>
            <div className="flex gap-2">
              <MdSubject size="1.5em" /> Mapel: {subject.name}
            </div>
            <div className="flex gap-2">
              <AiOutlineNumber size="1.5em" /> Total Soal: {questionsCount}
            </div>
          </div>
        </div>
      </div>
      <Button onClick={flip}>DETAIL SOAL</Button>
    </>
  );
}
