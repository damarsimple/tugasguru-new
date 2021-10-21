import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Button from "../../../../components/Button";
import AppContainer from "../../../../components/Container/AppContainer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import create from "zustand";
import { get } from "lodash";
import Select from "../../../../components/Select";
import { SimpleSelect } from "../../../../components/SimpleSelect";
import { gql, useMutation } from "@apollo/client";
import { useUserStore } from "../../../../store/user";
import { toast } from "react-toastify";
import { UPLOAD_DOCUMENT_MUTATION } from "../../../../components/DocumentUploader";

interface Grade {
  sikap: Record<string, number>;
  name: string;
  exams: Record<string, number>;
  finalExam: number;
  finalSikap: number;
  finalGrade: number;
}

type StudentGrade = Record<string, Grade>;

interface EditorStore {
  name: string;
  educationYear: string;
  isOdd: boolean;
  kkm: number;
  subjectName: string;
  className: string;
  cityName: string;
  students: StudentGrade;
  sikap: string[];
  exams: Record<string, number>;
  setSikap: (e: string[]) => void;
  setExams: (e: Record<string, number>) => void;
  setStudents: (e: StudentGrade) => void;
  finalSikapWeight: number;
  finalExamWeight: number;
  setFinalExamWeight: (by: number) => void;
  setFinalSikapWeight: (by: number) => void;
  setName: (by: string) => void;
  setEducationyear: (by: string) => void;
  setIsOdd: (by: boolean) => void;
  setKKM: (by: number) => void;
  setSubjectName: (by: string) => void;
  setClassName: (by: string) => void;
  setCityName: (by: string) => void;
}

const SIKAP_SELECT = [
  {
    name: "A",
    value: "100",
  },
  {
    name: "B",
    value: "80",
  },
  {
    name: "C",
    value: "60",
  },
  {
    name: "D",
    value: "40",
  },
  {
    name: "E",
    value: "20",
  },
  {
    name: "D",
    value: "0",
  },
];

const SIKAP_MAP = SIKAP_SELECT.reduce((prev, cur) => {
  return { ...prev, [cur.value]: cur.name };
}, {} as Record<string, string>);

export const useEditorStore = create<EditorStore>((set, get) => ({
  name: "Laporan Nilai",
  educationYear: "2020/2021",
  isOdd: false,
  kkm: 75,
  subjectName: "Biologi",
  className: "Test",
  cityName: "Simeule",
  students: {
    test: {
      name: "Damar",
      exams: { Tugas: 100, "Ulangan Harian": 100 },
      finalExam: 0,
      finalGrade: 0,
      finalSikap: 0,
      sikap: {
        Jujur: 0,
        Disiplin: 0,
        "Tanggung Jawab": 0,
        Toleransi: 0,
        "Gotong Royong": 0,
        "Santun Percaya Diri": 0,
        Spiritual: 0,
      },
    },
  },
  sikap: [
    "Jujur",
    "Disiplin",
    "Tanggung Jawab",
    "Toleransi",
    "Gotong Royong",
    "Santun Percaya Diri",
    "Spiritual",
  ],
  exams: { Tugas: 20, "Ulangan Harian": 80 },
  finalExamWeight: 60,
  finalSikapWeight: 40,
  setSikap: (sikap) => set({ sikap }),
  setExams: (exams) => set({ exams }),
  setStudents: (students) => set({ students }),
  setFinalExamWeight: (finalExamWeight) => set({ finalExamWeight }),
  setFinalSikapWeight: (finalSikapWeight) => set({ finalSikapWeight }),
  setName: (name) => set({ name }),
  setEducationyear: (educationYear) => set({ educationYear }),
  setIsOdd: (isOdd) => set({ isOdd }),
  setKKM: (kkm) => set({ kkm }),
  setSubjectName: (subjectName) => set({ subjectName }),
  setClassName: (className) => set({ className }),
  setCityName: (cityName) => set({ cityName }),
}));

export default function Create() {
  const {
    name,
    cityName,
    subjectName,
    className,
    kkm,
    educationYear,
    sikap,
    setSikap,
    setStudents,
    students,
    exams,
    setExams,
    finalExamWeight,
    finalSikapWeight,
    setFinalExamWeight,
    setFinalSikapWeight,
  } = useEditorStore();
  const [blobUrl, setBlobUrl] = useState("");
  const [editWeightMode, SetEditWeightMode] = useState(false);

  const handleRecalculateWeight = () => {
    for (const x in students) {
      calculateStudent(x, students[x]);
    }
  };
  const calculateStudent = (key: string, student: Grade) => {
    const finalSikap =
      Object.values(student.sikap).reduce((prev, curr) => {
        return prev + curr;
      }, 0) / sikap.length;

    const finalExam = Object.keys(exams).reduce((prev, curr) => {
      const x = student.exams[curr] * (exams[curr] / 100);
      return prev + x;
    }, 0);

    const finalGrade =
      finalSikap * (finalSikapWeight / 100) +
      finalExam * (finalExamWeight / 100);

    const newStudent = { ...student, finalSikap, finalGrade, finalExam };

    setStudents({ ...students, [key]: newStudent });
  };
  const { user } = useUserStore();
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(`Mata Pelajaran : ${subjectName}`, 15, 20);
    doc.text(`Kelas : ${className}`, 15, 25);
    doc.text(`KKM : ${kkm}`, 15, 30);
    doc.text(`Tahun Ajaran : ${educationYear}`, 15, 35);

    autoTable(doc, {
      startY: 40,
      headStyles: {
        fontSize: 8,
      },
      head: [
        [
          {
            content: "NISN",
            rowSpan: 2,
          },
          {
            content: "NAMA SISWA",
            rowSpan: 2,
          },

          ...Object.keys(exams).map((e, i) => ({ content: e, rowSpan: 2 })),
          {
            content: "PENILAIAN SIKAP",
            rowSpan: 1,
            colSpan: sikap.length,
          },
          {
            content: "NILAI UJIAN",
            rowSpan: 2,
          },
          {
            content: "TOTAL NILAI SIKAP",
            rowSpan: 2,
          },
          {
            content: "NILAI AKHIR",
            rowSpan: 2,
          },
          {
            content: "KETUNTASAN",
            rowSpan: 2,
          },
        ],
        [...sikap.map((e, i) => ({ content: i + 1, rowSpan: 1 }))],
      ],

      body: Object.keys(students).map((e) => {
        const student = get(students, e);
        const exams = Object.values(student.exams);
        const sikap = Object.values(student.sikap);
        return [
          e,
          student.name,
          ...exams,
          ...sikap.map((e) => SIKAP_MAP[e]),
          student.finalExam,
          student.finalSikap,
          student.finalGrade,
          student.finalGrade > kkm ? "Tuntas" : "Tidak Tuntas",
        ];
      }),
    });
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY;

    doc.text("Keterangan Nilai Sikap", 15, finalY + 5);
    for (let index = 1; index <= sikap.length; index++) {
      doc.text(`${index}. ${sikap[index - 1]}`, 15, finalY + (2 + index) * 5);
    }

    doc.text(`${cityName}, 21 October 2021`, 150, finalY + 5);
    doc.text(`Guru Mata Pelajaran`, 150, finalY + 10);
    doc.text(`${user?.name}`, 150, finalY + 30);

    return doc;
  };

  const [tabIndex, setTabIndex] = useState(0);

  const selectHandler = (e: number) => {
    if (e == 1) {
      setBlobUrl(URL.createObjectURL(new Blob([generatePDF().output()])));
    }
    setTabIndex(e);
  };

  const handleSerialize = () => {
    return JSON.stringify({
      data: { students, sikap, exams, finalExamWeight, finalSikapWeight },
    });
  };

  const [saveReport] = useMutation(gql`
    mutation createReport($name: String!, $metadata: String) {
      createReport(input: { name: $name, type: GRADE, metadata: $metadata }) {
        id
      }
    }
  `);

  const [mutateFunction, { loading: mutationLoading, error: mutationError }] =
    useMutation<{ uploadDocument: Document }>(UPLOAD_DOCUMENT_MUTATION);

  const handleSave = () => {
    saveReport({
      variables: { name, metadata: handleSerialize() },
    }).then((e) => {
      toast.success("Berhasil menyimpan laporan");
      mutateFunction({
        variables: {
          file: new File([generatePDF().output("blob")], `${name}.pdf`),
          ...e,
          type: "document",
          compressed: false,
          metadata: JSON.stringify({
            original_name: `${name}.pdf`,
            type: "application/pdf",
          }),
        },
      }).then((x) => {
        toast.success("Berhasil mengupload file");
      });
    });
  };
  return (
    <AppContainer>
      <div className="pt-10 p-4">
        <Tabs tabIndex={tabIndex} onSelect={selectHandler}>
          <TabList>
            <Tab>Editor</Tab>
            <Tab>Preview</Tab>
          </TabList>
          <TabPanel>
            <div className="grid grid-cols-4 gap-2">
              <Button>Kirim ke guru</Button>
              <Button
                onClick={() => {
                  if (editWeightMode) {
                    handleRecalculateWeight();
                  }
                  SetEditWeightMode(!editWeightMode);
                }}
              >
                {editWeightMode ? "Simpan" : "Edit"} Bobot Nilai
              </Button>
              <Button>Edit Data Nilai</Button>
              <Button onClick={handleSave}>Simpan Data Nilai Akhir</Button>
            </div>
            <table className="w-full table p-4 bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    NISN
                  </th>
                  <th
                    rowSpan={2}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    NAMA SISWA
                  </th>

                  {Object.keys(exams).map((e) => (
                    <th
                      key={e}
                      rowSpan={1}
                      className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                    >
                      {e}
                    </th>
                  ))}

                  <th
                    rowSpan={1}
                    colSpan={sikap.length}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    PENILAIAN SIKAP
                  </th>
                  <th
                    rowSpan={1}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    NILAI UJIAN
                  </th>
                  <th
                    rowSpan={1}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    TOTAL NILAI SIKAP
                  </th>
                  <th
                    rowSpan={2}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    NILAI AKHIR
                  </th>
                  <th
                    rowSpan={2}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    KETUNTASAN
                  </th>
                </tr>
                <tr>
                  {Object.keys(exams).map((e) => (
                    <th
                      key={e}
                      rowSpan={1}
                      className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                    >
                      {!editWeightMode ? (
                        <div> BOBOT : {exams[e]}%</div>
                      ) : (
                        <input
                          className="border-2 w-8"
                          type="number"
                          defaultValue={exams[e]}
                          onChange={(x) =>
                            setExams({ ...exams, [e]: x.target.valueAsNumber })
                          }
                        />
                      )}
                    </th>
                  ))}
                  {sikap.map((e) => (
                    <th
                      key={e}
                      rowSpan={1}
                      className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                    >
                      {e}
                    </th>
                  ))}
                  <th
                    rowSpan={1}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    {!editWeightMode ? (
                      <div> BOBOT : {finalExamWeight}%</div>
                    ) : (
                      <input
                        className="border-2 w-8"
                        type="number"
                        defaultValue={finalExamWeight}
                        onChange={(e) =>
                          setFinalExamWeight(e.target.valueAsNumber)
                        }
                      />
                    )}
                  </th>
                  <th
                    rowSpan={1}
                    className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900"
                  >
                    {!editWeightMode ? (
                      <div> BOBOT : {finalSikapWeight}%</div>
                    ) : (
                      <input
                        className="border-2 w-8"
                        type="number"
                        defaultValue={finalSikapWeight}
                        onChange={(e) =>
                          setFinalSikapWeight(e.target.valueAsNumber)
                        }
                      />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(students).map((e) => {
                  const student = get(students, e);
                  return (
                    <tr className="text-gray-700" key={e}>
                      <td className="border p-4 dark:border-dark-5">{e}</td>
                      <td className="border p-4 dark:border-dark-5">
                        {student.name}
                      </td>

                      {Object.keys(exams).map((x) => (
                        <td className="border p-4 dark:border-dark-5" key={x}>
                          {student.exams[x].toFixed(2)}
                        </td>
                      ))}
                      {sikap.map((x) => (
                        <td className="border p-4 dark:border-dark-5" key={x}>
                          <SimpleSelect
                            defaultValue={student.sikap[x]}
                            values={SIKAP_SELECT}
                            onChange={(y) => {
                              const cpStudent = {
                                ...student,
                                sikap: {
                                  ...student.sikap,
                                  [x]: parseInt(y),
                                },
                              };
                              setStudents({
                                ...students,
                                [e]: cpStudent,
                              });

                              calculateStudent(e, cpStudent);
                            }}
                          />
                        </td>
                      ))}
                      <td className="border p-4 dark:border-dark-5">
                        {student.finalExam.toFixed(2)}
                      </td>
                      <td className="border p-4 dark:border-dark-5">
                        {student.finalSikap.toFixed(2)}
                      </td>
                      <td className="border p-4 dark:border-dark-5">
                        {student.finalGrade.toFixed(2)}
                      </td>
                      <td className="border p-4 dark:border-dark-5">
                        {student.finalGrade > 75 ? "Tuntas" : "Tidak Tuntas"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <div className="grid grid-cols-1 gap-2">
              <Button onClick={() => generatePDF().save("table.pdf")}>
                Download ke pdf
              </Button>
            </div>
            <object data={blobUrl} type="application/pdf">
              <embed src={blobUrl} type="application/pdf" />
            </object>
          </TabPanel>
        </Tabs>
      </div>
    </AppContainer>
  );
}
