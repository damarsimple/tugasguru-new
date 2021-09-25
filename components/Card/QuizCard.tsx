import React, { useState } from "react";
import { Quiz } from "../../types/type";
import Button from "../Button";
import ImageContainer from "../Container/ImageContainer";
import Modal from "../Modal";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsPlay } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { MdClass, MdClose, MdShare, MdSubject } from "react-icons/md";
import { FaLevelUpAlt } from "react-icons/fa";
import { take } from "lodash";
import Link from "next/link";

export default function QuizCard(node: Quiz) {
  const [open, setOpen] = useState(false);
  const flip = () => setOpen(!open);
  return (
    <>
      <Modal open={open} flip={flip}>
        <div>
          <div className="relative">
            <ImageContainer
              fallback="quiz"
              className="w-full"
              src={node.cover?.path}
              alt={node.name}
              width={200}
              height={150}
            />
            <div className="absolute top-0 right-0 flex m-6 gap-2 ">
              <Button color="GRAY" onClick={flip}>
                <MdShare color="white" size="1.5em" />
              </Button>
              <Button color="RED" onClick={flip}>
                <MdClose color="white" size="1.5em" />
              </Button>
            </div>
            <div className="absolute bottom-0 flex flex-col m-6 ">
              <div className="flex gap-2 shadow rounded bg-gray-400 text-white p-2 font-semibold">
                <AiOutlineQuestionCircle color="white" size="1.5em" />
                {node.questions?.length} Pertanyaan
              </div>
              <div className="flex gap-2 shadow rounded bg-gray-400 text-white mt-6 p-2 font-semibold">
                <BsPlay color="white" size="1.5em" />
                {node.played_count} bermain
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            <div className="flex gap-2">
              <BiUser size="1.5em" /> {node.user?.name}
            </div>
            <div className="flex gap-2">
              <MdClass size="1.5em" /> Kelas: {node.classtype.level}
            </div>
            <div className="flex gap-2">
              <FaLevelUpAlt size="1.5em" /> Kesulitan: {node.difficulty}
            </div>
            <div className="flex gap-2">
              <MdSubject size="1.5em" /> Mapel: {node.subject.name}
            </div>
            <div className="col-span-2">Contoh Pertanyaan</div>
            <div className="col-span-2 mt-2 p-2 grid grid-cols-1 bg-gray-200">
              {take(node.questions, 4).map((e, i) => (
                <div key={`${e.id}-${i}`}>
                  {i + 1}. {e.metadata?.content}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 col-span-2">
              <Link href={"/quiz/" + node.id}>
                <a>
                  <Button>bermain</Button>
                </a>
              </Link>
              <Link href={"/quiz/" + node.id + "?multiplayer=true"}>
                <a>
                  <Button color="GREEN">undang teman</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col gap-2 text-center shadow rounded">
        <ImageContainer
          fallback="quiz"
          className="w-full"
          src={node.cover?.path}
          alt={node.name}
          width={200}
          height={200}
        />
        <div>
          <h1 className="text-md sm:text-lg font-semibold truncate">
            {node.name}
          </h1>
          <Button color="BLUE" onClick={flip}>
            BERMAIN
          </Button>
        </div>
      </div>
    </>
  );
}

export function QuizCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 text-center shadow rounded">
      <div className="flex justify-center">
        <div className="h-56 w-full animate-pulse bg-gray-200" />
      </div>
      <div className="p-4">
        <h1 className="bg-gray-100 rounded animate-pulse"></h1>
        <p className="h-6 bg-gray-100 rounded animate-pulse"></p>
        <Button color="GRAY" loading>
          Loading ...
        </Button>
      </div>
    </div>
  );
}
