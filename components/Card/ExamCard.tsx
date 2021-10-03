import React from "react";
import { Exam } from "../../types/type";
import Button from "../Button";

interface ExamCardProp extends Exam {
  buttonLabel?: string;
  route?: string;
}

export default function ExamCard(e: ExamCardProp) {
  return (
    <div className="shadow rounded">
      <div className="p-4">
        <h2 className="text-gray-900 font-bold text-lg truncate">{e.name}</h2>
        <p className="mt-2 text-gray-600 text-sm">{e.metadata?.description}</p>

        <div className="flex flex-col gap-2 mt-3">
          <h2 className="text-gray-700 font-bold text-md">
            {e.examplaysCount} Pengumpul
          </h2>
          <Button
            href={(e.route ? e.route : "/dashboard/teachers/exams/") + e.id}
          >
            {e.buttonLabel ?? "     Koreksi Ujian"}
          </Button>
        </div>
      </div>
    </div>
  );
}
