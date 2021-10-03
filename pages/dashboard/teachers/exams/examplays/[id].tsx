import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React, { useState } from "react";
import { MdClose, MdEdit, MdSave } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../../../../../components/Button";
import QuestionCard from "../../../../../components/Card/QuestionCard";
import DashboardContainer from "../../../../../components/Container/DashboardContainer";
import ImageContainer from "../../../../../components/Container/ImageContainer";
import FormModal from "../../../../../components/FormModal";
import Form from "../../../../../components/Forms/Form";
import Input from "../../../../../components/Forms/Input";
import Modal from "../../../../../components/Modal";
import {
  CoreAnswerPlayField,
  CoreQuestionCopyField,
  CoreQuestionPlayField,
} from "../../../../../fragments/fragments";
import { makeId } from "../../../../../helpers/generator";
import {
  Answer,
  AnswerMap,
  Examplay,
  Maybe,
  Question,
} from "../../../../../types/type";

function ID({ router }: { router: NextRouter }) {
  const { id } = router.query;

  const {
    data: { examplay } = {},
    loading,
    error,
    refetch,
  } = useQuery<{ examplay: Examplay }>(
    gql`
      ${CoreQuestionPlayField}
      ${CoreAnswerPlayField}
      ${CoreQuestionCopyField}
      query GetExamplay($id: ID!) {
        examplay(id: $id) {
          id
          graded
          grade
          answers_map {
            answer {
              ...CoreAnswerPlayField
            }
            question {
              ...CoreQuestionCopyField
            }
            grade
          }
          exam {
            id
            name
            questions {
              ...CoreQuestionPlayField
            }
          }
          user {
            id
            name
            cover {
              path
            }
          }
        }
      }
    `,
    {
      variables: { id },
      onCompleted: (e) => {
        setStagingGrade(e.examplay.grade);
        setGraded(e.examplay.graded);
        if (e.examplay.answers_map) {
          const cp: { [e: string]: number } = {};

          for (const x of e.examplay.answers_map) {
            if (x.question.metadata?.uuid)
              cp[x.question.metadata?.uuid] = x.grade;
          }

          setGradeMap(cp);
        }
      },
    }
  );

  console.log(examplay?.answers_map);

  const [gradeMap, setGradeMap] = useState<{ [e: string]: number }>({});
  const [gradeComment, setGradeComment] = useState<{ [e: string]: string }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<undefined | string>(
    undefined
  );

  const [openQuestion, setOpenQuestion] = useState(false);

  const flipQuestion = () => setOpenQuestion(!openQuestion);

  const [openEdit, setOpenEdit] = useState(false);

  const flipEdit = () => setOpenEdit(!openEdit);

  const [handleUpdate, { loading: loadingUpdate }] = useMutation(gql`
    mutation UpdateExamplay($id: ID!, $grade: Float, $graded: Boolean) {
      updateExamplay(id: $id, input: { grade: $grade, graded: $graded }) {
        id
      }
    }
  `);

  const [stagingGrade, setStagingGrade] = useState(0);
  const [graded, setGraded] = useState(false);

  const handleGrade = () => {
    const mapped: AnswerMap[] = [];

    for (const x of examplay?.answers_map ?? []) {
      mapped.push({
        answer: x.answer,
        grade: gradeMap[x.question.metadata?.uuid ?? ""],
        comment: gradeComment[x.question.metadata?.uuid ?? ""],
        question: x.question,
      });
    }

    handleUpdate({
      variables: {
        id,
        grade: stagingGrade,
        graded,
        answers_map: JSON.stringify(mapped),
      },
    })
      .then((e) => {
        toast.success("berhasil memberi nilai");
        flipEdit();
        refetch();
      })
      .catch((e) => toast.error("Gagal memeberi nilai"));
  };

  const grades = Object.values(gradeMap);

  const average =
    grades.reduce((e, i) => {
      return e + i;
    }, 0) / grades.length;
  return (
    <DashboardContainer>
      <Modal open={openEdit} flip={flipEdit}>
        <div className="p-6">
          <Input
            label="Nilai Ulangan"
            type="number"
            defaultValue={stagingGrade}
            onTextChange={(e) => {
              setStagingGrade(parseInt(e));
            }}
          />
          <Input
            label="Sudah Dinilai"
            type="checkbox"
            defaultValue={graded}
            onCheckChange={(e) => {
              setGraded(e);
            }}
          />
          <div className="flex flex-col gap-3">
            <Button loading={loadingUpdate} onClick={handleGrade}>
              <MdSave color="white" size="1.5em" />
              Simpan Nilai
            </Button>
            <Button color="RED" onClick={flipEdit}>
              <MdClose color="white" size="1.5em" />
            </Button>
          </div>
        </div>
      </Modal>
      <Modal open={openQuestion} flip={flipQuestion}>
        <div className="p-6">
          <Input
            label="Nilai Soal"
            type="number"
            defaultValue={gradeMap[selectedQuestion ?? ""]}
            onTextChange={(e) => {
              selectedQuestion &&
                setGradeMap({ ...gradeMap, [selectedQuestion]: parseInt(e) });
            }}
          />
          <Input
            label="Komentar"
            defaultValue={gradeComment[selectedQuestion ?? ""]}
            onTextChange={(e) => {
              selectedQuestion &&
                setGradeComment({ ...gradeComment, [selectedQuestion]: e });
            }}
          />
          <Button color="RED" onClick={flipQuestion}>
            <MdClose color="white" size="1.5em" />
          </Button>
        </div>
      </Modal>
      <div className="flex flex-col gap-3">
        <Button href={`/dashboard/teachers/exams/${examplay?.exam.id}`}>
          KEMBALI
        </Button>
        <div className="border-2 rounded p-2 grid grid-cols-12 gap-3">
          <div className="col-span-2 flex items-center">
            <ImageContainer
              src={examplay?.user?.cover?.path}
              fallback="profile"
              width={75}
              height={75}
            />
          </div>
          <div className="col-span-8 flex flex-col gap-1">
            <h1>{examplay?.user?.name}</h1>
            {examplay?.graded ? (
              <p>
                Diubah pada{" "}
                {moment(examplay?.updated_at).format("HH:MM DD/MM ")}
              </p>
            ) : (
              <p>Belum dikumpulkan</p>
            )}
            <p>
              {examplay?.graded ? "Sudah dinilai " : "Belom dinilai"}
              {examplay?.grade != 0 && examplay?.grade}
            </p>
          </div>
          <Button color="BLUE" className="col-span-2 h-full">
            <MdSave />
          </Button>
        </div>
        <Button onClick={flipEdit}>UBAH NILAI</Button>
        <div>
          Rata - Rata : {average} dari {grades.length} soal yang sudah nilai
        </div>
        {examplay?.answers_map?.map((e, i) => {
          return (
            <div className="grid grid-cols-12" key={i}>
              <div className="col-span-10">
                <QuestionCard
                  myanswer={e.answer}
                  {...(e.question as Question)}
                  key={i}
                  index={i + 1}
                  grade={gradeMap[e.question.metadata?.uuid ?? ""]}
                />
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => {
                    flipQuestion();
                    setSelectedQuestion(e.question.metadata?.uuid);
                  }}
                  color="BLUE"
                  className="h-full"
                >
                  <MdEdit />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button>MASUKKAN NILAI</Button>
    </DashboardContainer>
  );
}

export default withRouter(ID);
