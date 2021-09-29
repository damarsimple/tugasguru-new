import React from "react";
import { Question } from "../../types/type";

interface CardProp extends Question {
  myanswer?: string;
  correct?: boolean;
  index?: number;
}

export default function QuestionCard({
  index,
  myanswer,
  correct,
  metadata,
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
        <div>{metadata?.type}</div>
        <hr className="my-4" />
        <div className="flex flex-col gap-2">
          {metadata?.answers.map((e) =>
            myanswer == e.uuid ? (
              <div key={e.uuid} className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-green-200" />
                <div>{e.content}</div>
              </div>
            ) : (
              <div key={e.uuid} className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200" />
                <div>{e.content}</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
