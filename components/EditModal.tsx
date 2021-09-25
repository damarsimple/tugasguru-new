import { take } from "lodash";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";
import { FaLevelUpAlt } from "react-icons/fa";
import { MdShare, MdClose, MdClass, MdSubject } from "react-icons/md";
import Button from "./Button";
import ImageContainer from "./Container/ImageContainer";
import Modal from "./Modal";

export default function EditModal() {
  const [open, setOpen] = useState(true);
  const flip = () => setOpen(!open);

  return (
    <Modal open={open} flip={flip}>
      <div>
        <div className="relative">
          <ImageContainer
            fallback="quiz"
            className="w-full"
            //   src={node.cover?.path}
            //   alt={node.name}
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
              0Pertanyaan
            </div>
            <div className="flex gap-2 shadow rounded bg-gray-400 text-white mt-6 p-2 font-semibold">
              <BsPlay color="white" size="1.5em" />0 bermain
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="flex gap-2">
            <BiUser size="1.5em" /> 0
          </div>
          <div className="flex gap-2">
            <MdClass size="1.5em" /> 0
          </div>
          <div className="flex gap-2">
            <FaLevelUpAlt size="1.5em" /> 0
          </div>
          <div className="flex gap-2">
            <MdSubject size="1.5em" />0
          </div>
          <div className="col-span-2">Contoh Pertanyaan</div>
          <div className="col-span-2 mt-2 p-2 grid grid-cols-1 bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-2 col-span-2">
            <Link href={"/quiz/"}>
              <a>
                <Button>bermain</Button>
              </a>
            </Link>
            <Link href={"/quiz/" + "?multiplayer=true"}>
              <a>
                <Button color="GREEN">undang teman</Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
