import React, { useState } from "react";
import { MdClose, MdPlusOne } from "react-icons/md";
import { makeId, makeUUID } from "../helpers/generator";
import { Question, QuestionType } from "../types/type";
import Button from "./Button";
import { Editor } from "./Editor";
import Input from "./Forms/Input";
import Modal from "./Modal";

import create from "zustand";
import { groupBy } from "lodash";
import { toast } from "react-toastify";
import useDebounces from "../hooks/useDebounces";
//@ts-ignore
import readXlsxFile from "read-excel-file";
import useTeacherData from "../hooks/useTeacherData";
import { selectExtractor } from "../helpers/formatter";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
const correctId = makeUUID();

type QMap = Record<string, Partial<Question>>;

interface EditorStore {
  currentid: undefined | string;
  setCurrentid: (by: undefined | string) => void;
  questionsMaps: QMap;
  setQuestionsMaps: (e: QMap) => void;
}

export const ReadQuestionExcel = async (CurrentFile: File) => {
  const TransMap: Record<string, QuestionType> = {
    PG: QuestionType.Multi_choice,
    ISIAN: QuestionType.Filler,
    ESSAY: QuestionType.Essay,
  };
  const e = await readXlsxFile(CurrentFile);
  if (Array.isArray(e)) {
    const cp = e;

    cp.shift();

    const xd = cp
      .map((e: Array<any>) => {
        const id = makeId(5);
        const question: Partial<Question> = {
          id,
          metadata: {
            uuid: id,
            type: TransMap[e[1]?.toUpperCase()],
            content: e[0],
            correctanswer: "",
            answers: [],
          },
        };

        switch (question.metadata?.type) {
          case QuestionType.Essay:
          case QuestionType.Filler:
            question.metadata.answers = [
              {
                content: e[2],
                uuid: makeId(5),
                attachment: "",
                attachment_type: "",
              },
            ];

            question.metadata.correctanswer = question.metadata.answers[0].uuid;
            break;
          case QuestionType.Multi_choice:
            question.metadata.answers = [...e.slice(3, 8)].map((e) => {
              return {
                content: e,
                uuid: makeId(5),
                attachment: "",
                attachment_type: "",
              };
            });
            const correctIndex = e[2]?.toUpperCase()?.charCodeAt(0) - 65;

            question.metadata.correctanswer =
              question.metadata.answers[correctIndex].uuid;

            if (question.metadata.answers.length != 5) return null;

            break;
          default:
            return null;
        }

        return question;
      })
      .filter((e) => !!e);

    return xd;
  }
};

const MultiChoiceExample = {
  metadata: {
    type: QuestionType.Multi_choice,
    content: "",
    answers: [
      {
        uuid: correctId,
        content: "",
        attachment: "",
        attachment_type: "",
      },
      {
        uuid: makeUUID(),
        content: "",
        attachment: "",
        attachment_type: "",
      },
      {
        uuid: makeUUID(),
        content: "",
        attachment: "",
        attachment_type: "",
      },
      {
        uuid: makeUUID(),
        content: "",
        attachment: "",
        attachment_type: "",
      },
      {
        uuid: makeUUID(),
        content: "",
        attachment: "",
        attachment_type: "",
      },
    ],
    uuid: makeUUID(),
    correctanswer: correctId,
  },
};

export const useQuestionEditorStore = create<EditorStore>((set) => ({
  currentid: undefined,
  setCurrentid: (currentid: undefined | string) => set({ currentid }),
  questionsMaps: {},
  setQuestionsMaps: (questionsMaps: QMap) => set({ questionsMaps }),
}));

const QuestionEditorView = ({
  question,
  onChange,
}: {
  question: Partial<Question>;
  onChange: (e: Partial<Question>) => void;
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Editor
          defaultValue={question.metadata?.content}
          onChange={(e) => {
            onChange({
              ...question,
              //@ts-ignore
              metadata: { ...question.metadata, content: e },
            });
          }}
        />
        {question.metadata?.type == QuestionType.Multi_choice ? (
          <div>
            <div className="">
              Kunci Jawaban :{" "}
              {String.fromCharCode(
                question.metadata?.answers.findIndex(
                  (e) => e.uuid == question.metadata?.correctanswer
                )
              )}
            </div>
            {question.metadata?.answers.map((e, i) => (
              <div key={i} className="grid grid-cols-12 gap-4">
                <div className="col-span-1 flex items-center text-center">
                  <Button
                    onClick={() =>
                      onChange({
                        ...question,
                        //@ts-ignore
                        metadata: {
                          ...question.metadata,
                          correctanswer: e.uuid,
                        },
                      })
                    }
                    color={
                      e.uuid == question.metadata?.correctanswer
                        ? "GREEN"
                        : "RED"
                    }
                  >
                    {String.fromCharCode(i + 65)}
                  </Button>
                </div>
                <div className="col-span-11">
                  <Editor
                    defaultValue={question.metadata?.answers[i]?.content ?? ""}
                    onChange={(e) => {
                      const answers = question.metadata?.answers;
                      if (!answers) return;
                      answers[i] = { ...answers[i], content: e };
                      onChange({
                        ...question,
                        //@ts-ignore
                        metadata: { ...question.metadata, answers: answers },
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Editor
            defaultValue={question.metadata?.answers[0]?.content ?? ""}
            onChange={(e) => {
              const answers = question.metadata?.answers;
              if (!answers) return;
              answers[0] = { ...answers[0], content: e };
              onChange({
                ...question,
                //@ts-ignore
                metadata: { ...question.metadata, answers: answers },
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default function QuestionEditor() {
  const [openviewer, setOpenviewer] = useState(false);
  const [openexcel, setOpenexcel] = useState(false);

  const { questionsMaps, setQuestionsMaps, setCurrentid, currentid } =
    useQuestionEditorStore();

  const grouped = groupBy(
    Object.keys(questionsMaps).map((id) => {
      return {
        id,
        ...questionsMaps[id],
      };
    }),
    "metadata.type"
  );

  const flipViewer = () => setOpenviewer(!openviewer);
  const flipExcel = () => setOpenexcel(!openexcel);

  const { ready, handleDebounce } = useDebounces();

  const handleDelete = () => {
    if (!currentid) return;
    const cp = { ...questionsMaps };

    delete cp[currentid];

    setQuestionsMaps(cp);

    toast.success("Berhasil menghapus soal");

    setCurrentid(undefined);
  };

  // useEffect(() => {
  //   handleDebounce();
  // }, [currentid, handleDebounce]);

  const check = (e: string) => {
    const cur = questionsMaps[e];
    return (
      cur.metadata?.correctanswer &&
      cur.metadata.content &&
      cur.metadata.answers.filter((e) => !e.content).length == 0
    );
  };

  const [name, setName] = useState<number | string>("");

  const [subject, setSubject] = useState<undefined | string | number>(
    undefined
  );

  const [classtype, setClasstype] = useState<undefined | string | number>(
    undefined
  );

  const checkAll = () => {
    console.log(questionsMaps);
    for (const key in questionsMaps) {
      if (!check(key)) {
        toast.error("Soal belum lengkap");
        setOpenviewer(true);
        return false;
      }
    }

    if (!subject || !classtype || !name) {
      toast.warn(
        "Anda belum memilih tipe soal atau mata pelajaran atau nama paket soal"
      );
      return false;
    }

    toast.success("Soal sudah lengkap");

    return true;
  };

  const [handleCreatePackage, { loading }] = useMutation(gql`
    mutation CretatePackageQuestion(
      $name: String!
      $subject_id: ID!
      $classtype_id: ID!
      $questions: [CreateQuestion!]!
    ) {
      createPackagequestion(
        input: {
          name: $name
          subject_id: $subject_id
          classtype_id: $classtype_id
          questions: { create: $questions }
        }
      ) {
        id
      }
    }
  `);

  const router = useRouter();

  const handleSubmit = () => {
    if (!checkAll()) {
      return;
    }

    const y = {
      questions: Object.keys(questionsMaps).map((e) => {
        return {
          ...questionsMaps[e],
          classtype_id: classtype,
          subject_id: subject,
          metadata: JSON.stringify({
            ...questionsMaps[e],
            uuid: e,
          }),
        };
      }),
      subject_id: subject,
      classtype_id: classtype,
      name,
    };

    let exists = false;
    for (const x in y.questions) {
      exists = true;
      break;
    }

    if (!exists) {
      toast.error("Anda belum memiliki soal !");
      return;
    }

    handleCreatePackage({
      variables: {
        ...y,
      },
    })
      .then((e) => {
        toast.success("Berhasil membuat paket soal");
        router.push("/dashboard/teachers/questions?index=1");
      })
      .catch((e) => toast.error("Gagal membuat paket soal " + e));
  };

  const [excelFile, setExcelFile] = useState<File | undefined>(undefined);

  const handleParseExcel = async () => {
    if (!excelFile) {
      toast.error("File belum dimasukkan !");
      return;
    }
    const questions = await ReadQuestionExcel(excelFile);

    toast.success(`Berhasil menemukan ${questions?.length} soal`);

    const qmaps: QMap = {};
    for (const x of questions ?? []) {
      if (x?.id) {
        qmaps[x.id] = x;
      }
    }

    setQuestionsMaps({ ...questionsMaps, ...qmaps });
    flipExcel();
    if (!currentid) {
      setCurrentid(Object.keys(questionsMaps)[0] ?? Object.keys(qmaps)[0]);
    }
  };

  const { subjects, classtypes } = useTeacherData();
  const [currentindex, setCurrentindex] = useState<number>(0);
  const indexMaps = Object.values(grouped)
    .flat()
    .map((e) => e.metadata?.uuid);

  const handleMove = (direction: "NEXT" | "PREV") => {
    if (direction == "NEXT") {
      const value = indexMaps.at(currentindex + 1);
      if (value) {
        setCurrentid(value);
        setCurrentindex(currentindex + 1);
      }
    } else {
      if (currentindex == 0) return;
      const value = indexMaps.at(currentindex - 1);
      if (value) {
        setCurrentid(value);
        setCurrentindex(currentindex - 1);
      }
    }
  };
  return (
    <>
      <Modal open={openviewer} flip={flipViewer}>
        <div className="p-6 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {Object.keys(QuestionType).map((e, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="grid grid-cols-2">
                  <h1>{(QuestionType as any)[e]}</h1>
                  <Button
                    onClick={() => {
                      const id = makeId(5);
                      setQuestionsMaps({
                        ...questionsMaps,
                        [id]: {
                          ...MultiChoiceExample,
                          id,
                          metadata: {
                            ...MultiChoiceExample.metadata,
                            content: "",
                            type: (QuestionType as any)[e],
                            answers:
                              (QuestionType as any)[e] ==
                              QuestionType.Multi_choice
                                ? [...MultiChoiceExample.metadata.answers]
                                : [MultiChoiceExample.metadata.answers[0]],
                          },
                        },
                      });
                    }}
                  >
                    <MdPlusOne />
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {grouped[(QuestionType as any)[e]]?.map((e, i) => (
                    <Button
                      onClick={() => {
                        setCurrentid(e.id);
                        handleDebounce();
                        flipViewer();
                      }}
                      key={i}
                      color={
                        currentid == e.id
                          ? "RED"
                          : check(e.id)
                          ? "GREEN"
                          : "BLUE"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button color="RED" onClick={flipViewer}>
            <MdClose color="white" size="1.5em" />
          </Button>
        </div>
      </Modal>
      <Modal open={openexcel} flip={flipExcel}>
        <div className="p-6 flex flex-col gap-3">
          <Input
            type="file"
            label="File Excel"
            required
            onFileChange={setExcelFile}
          />
          <a
            className="underline text-blue-600"
            href="/question-template-excel.xlsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            download template contoh excel
          </a>
          <Button color="GREEN" onClick={handleParseExcel}>
            PROSES EXCEL
          </Button>
          <Button color="RED" onClick={flipExcel}>
            <MdClose color="white" size="1.5em" />
          </Button>
        </div>
      </Modal>
      <div className="grid grid-cols-12 h-screen gap-2">
        <div className="col-span-12 lg:col-span-8 shadow rounded p-4 flex flex-col gap-3">
          {currentid && ready && questionsMaps[currentid] ? (
            <>
              <QuestionEditorView
                onChange={(e) => {
                  setQuestionsMaps({ ...questionsMaps, [currentid]: e });
                }}
                question={questionsMaps[currentid]}
              />
              <div className="flex gap-3">
                <Button onClick={() => handleMove("PREV")}>SEBELUMNYA</Button>
                <Button color="GREEN" onClick={() => handleMove("NEXT")}>
                  SELANJUTNYA
                </Button>
              </div>
            </>
          ) : (
            <>
              {Object.keys(QuestionType).map((e, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="grid grid-cols-2">
                    <h1>{(QuestionType as any)[e]}</h1>
                    <Button
                      onClick={() => {
                        const id = makeId(5);
                        setQuestionsMaps({
                          ...questionsMaps,
                          [id]: {
                            ...MultiChoiceExample,
                            id,
                            metadata: {
                              ...MultiChoiceExample.metadata,
                              content: "",
                              type: (QuestionType as any)[e],
                              answers:
                                (QuestionType as any)[e] ==
                                QuestionType.Multi_choice
                                  ? [...MultiChoiceExample.metadata.answers]
                                  : [MultiChoiceExample.metadata.answers[0]],
                            },
                          },
                        });
                        setCurrentid(id);
                      }}
                    >
                      Buat soal {(QuestionType as any)[e]}
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="col-span-12 lg:col-span-4 shadow rounded p-4">
          <div className="flex flex-col gap-3">
            <Input label="Nama Paket Soal" required onTextChange={setName} />
            <Input
              label="Mata Pelajaran"
              type="select"
              values={subjects?.map(selectExtractor) ?? []}
              required
              onTextChange={setSubject}
            />
            <Input
              label="Kelas"
              type="select"
              onTextChange={setClasstype}
              values={
                classtypes
                  ?.map((e) => {
                    return { ...e, name: `Kelas ${e.level}` };
                  })
                  .map(selectExtractor) ?? []
              }
              required
            />
            <Button color="RED" onClick={handleDelete}>
              hapus soal ini
            </Button>
            <Button onClick={flipViewer}>pindah atau buat soal</Button>
            <Button onClick={flipExcel}>Upload EXCEL</Button>
            <Button onClick={checkAll}>CHECK SOAL</Button>
            {/* <Button>LOAD AUTOSAVE</Button> */}
            <Button loading={loading} onClick={handleSubmit}>
              Simpan ke bank soal
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
