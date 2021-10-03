import create from "zustand";
import { Exam, Examplay, Examsession } from "../types/type";

interface ExamState {
  exam?: Exam;
  examsession?: Examsession;
  examplay?: Examplay;
  isBegin: boolean;
  setExam: (e: Exam) => void;
  setExamsession: (e: Examsession | undefined) => void;
  setExamplay: (e: Examplay) => void;
  setIsBegin: (e: boolean) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  exam: undefined,
  examsession: undefined,
  examplay: undefined,
  isBegin: false,
  setExam: (exam) => set((state) => ({ exam })),
  setIsBegin: (isBegin) => set((state) => ({ isBegin })),
  setExamsession: (examsession) => set((state) => ({ examsession })),
  setExamplay: (examplay) => set((state) => ({ examplay })),
}));
