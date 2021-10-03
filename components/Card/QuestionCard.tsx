import React from "react";
import { Answer, Question, QuestionCopy } from "../../types/type";

interface CardProp extends Question {
  myanswer?: Answer;
  correct?: boolean;
  index?: number;
  grade?: number;
}

export default function QuestionCard({
  index,
  myanswer,
  correct,
  metadata,
  grade,
}: CardProp) {
  return (
    <div className="h-full shadow rounded bg-gray-800 flex">
      {correct ? (
        <div className="bg-green-300 h-full w-2" />
      ) : (
        <div className="bg-red-300 h-full w-2" />
      )}
      <div className="bg-white w-full p-4">
        <div>
          {`${index ?? ""}.`} {metadata?.content}
        </div>
        <div className="flex flex-col gap-2">
          <div>Tipe Soal : {metadata?.type}</div>
          <div>Nilai: {grade}</div>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-2">
          {metadata?.answers.map((e) =>
            myanswer?.uuid == e.uuid ? (
              <div className="grid grid-cols-2 gap-2">
                <div key={e.uuid} className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-200" />
                  <div>Jawaban Soal : {e.content}</div>
                </div>
                <div>Jawaban Anda : {myanswer?.content}</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div key={e.uuid} className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-red-200" />
                  <div>Jawaban Soal : {e.content}</div>
                </div>
                <div>Jawaban Anda : {myanswer?.content}</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
