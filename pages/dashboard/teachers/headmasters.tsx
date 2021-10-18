import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";
import { toast } from "react-toastify";
import BaseCard from "../../../components/Card/BaseCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import FormModal from "../../../components/FormModal";
import Select from "../../../components/Select";
import Table from "../../../components/Table";
import { CorePageInfoField } from "../../../fragments/fragments";
import { selectObjectExtractor } from "../../../helpers/formatter";
import {
  Agenda,
  Examplay,
  Report,
  ReportStatus,
  ReportType,
  User,
} from "../../../types/type";

export default function Headmaster() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
  const [school, setSchool] = useState<undefined | string>(undefined);

  const { data, loading } = useQuery<{ me: User }>(gql`
    query Schools {
      me {
        schools {
          id
          name
          classrooms {
            id
            name
          }
        }
      }
    }
  `);

  return (
    <DashboardContainer>
      <Select
        attributes={
          data?.me?.schools?.map((e) => {
            return { label: e.name, value: e.id };
          }) ?? []
        }
        label={"Sekolah"}
        loading={loading}
        onChange={setSchool}
      />
      {school && (
        <Tabs>
          <TabList>
            <Tab>Sekolah</Tab>
            <Tab>Buat Absensi / Kehadiran</Tab>
            <Tab>Data Nilai</Tab>
            <Tab>Data Kehadiran</Tab>
            <Tab>Data Panggilan</Tab>
          </TabList>
          <TabPanel>
            {data?.me.schools?.map((e) => (
              <BaseCard key={e.id} name={e.name} />
            ))}
          </TabPanel>
          <TabPanel>
            <FormModal<Agenda>
              mutationQuery={gql`
                mutation CreateAgenda(
                  $uuid: String!
                  $finish_at: String!
                  $start_at: String!
                  $name: String!
                  $metadata: String
                ) {
                  CreateAgenda(
                    input: {
                      uuid: $consultant_id
                      finish_at: $consultant_id
                      start_at: $consultant_id
                      name: $name
                      metadata: $metadata
                    }
                  ) {
                    id
                  }
                }
              `}
              openMessage="buat absensi baru"
              fields={"createAgenda"}
              submitName="Buat"
              editAttributes={[
                {
                  label: "Judul Absensi",
                  name: "name",
                  required: true,
                },
                {
                  label: "Mulai Pada",
                  name: "start_at",
                  required: true,
                  type: "datetime",
                },
                {
                  label: "Tutup Pada",
                  name: "finish_at",
                  required: true,
                  type: "datetime",
                },
                {
                  label: "Deksripsi",
                  name: "metadata.description",
                },
                {
                  label: "Alasan",
                  name: "metadata.reason",
                },
              ]}
              successMessage="Berhasil membuat absensi"
            />
          </TabPanel>
          <TabPanel>
            <Select
              attributes={
                data?.me?.schools
                  ?.map((e) => e.classrooms)
                  .flat()
                  .map((e) => {
                    return { label: e.name, value: e.id };
                  }) ?? []
              }
              label={"Ruang Kelas"}
              loading={loading}
              onChange={setClassroom}
            />

            {classroom && (
              <Table<Examplay>
                query={gql`
                  ${CorePageInfoField}
                  query GetExamplays(
                    $first: Int!
                    $after: String
                    $classroom_id: ID
                  ) {
                    examplays(
                      first: $first
                      after: $after
                      classroom_id: $classroom_id
                    ) {
                      edges {
                        node {
                          id
                          grade
                          user {
                            name
                            id
                          }
                          examsession {
                            name
                            id
                          }
                          exam {
                            name
                            id
                          }
                        }
                      }
                      pageInfo {
                        ...CorePageInfoField
                      }
                    }
                  }
                `}
                perPage={10}
                fields={"examplays"}
                fetchPolicy="network-only"
                variables={{
                  classroom_id: classroom,
                }}
                headers={[
                  {
                    name: "exam.name",
                    label: "Nama Ujian",
                  },
                  {
                    name: "examsession.name",
                    label: "Sesi Ujian",
                  },
                  {
                    name: "user.name",
                    label: "Pengumpul",
                  },
                  {
                    name: "grade",
                    label: "nilai",
                  },
                ]}
              />
            )}
          </TabPanel>
          <TabPanel>
            <Select
              attributes={
                data?.me?.schools
                  ?.map((e) => e.classrooms)
                  .flat()
                  .map((e) => {
                    return { label: e.name, value: e.id };
                  }) ?? []
              }
              label={"Ruang Kelas"}
              loading={loading}
              onChange={setClassroom}
            />

            {classroom && (
              <Table<Agenda>
                query={gql`
                  ${CorePageInfoField}
                  query GetAgendas(
                    $first: Int!
                    $after: String
                    $classroom_id: ID
                  ) {
                    agendas(
                      first: $first
                      after: $after
                      classroom_id: $classroom_id
                    ) {
                      edges {
                        node {
                          id
                          grade
                          user {
                            name
                            id
                          }
                          examsession {
                            name
                            id
                          }
                          exam {
                            name
                            id
                          }
                        }
                      }
                      pageInfo {
                        ...CorePageInfoField
                      }
                    }
                  }
                `}
                perPage={10}
                fields={"examplays"}
                fetchPolicy="network-only"
                variables={{
                  classroom_id: classroom,
                }}
                headers={[
                  {
                    name: "name",
                    label: "Nama Absensi",
                  },
                  {
                    name: "start_at",
                    label: "Mulai Pada",
                  },
                  {
                    name: "finish_at",
                    label: "Selesai Pada",
                  },
                  {
                    name: "agendaable_type",
                    label: "Tipe Absen",
                  },
                ]}
              />
            )}
          </TabPanel>
          <TabPanel>
            <Table<Report>
              fetchPolicy="network-only"
              withAction
              withSearchbar
              fields="reports"
              variables={{ type: ReportType.Parent_call, school_id: school }}
              query={gql`
                ${CorePageInfoField}
                query GetReports(
                  $first: Int!
                  $after: String
                  $name: String
                  $type: ReportType
                  $school_id: ID
                ) {
                  reports(
                    first: $first
                    after: $after
                    name: $name
                    type: $type
                    school_id: $school_id
                  ) {
                    edges {
                      node {
                        id
                        name
                        receiver {
                          id
                          name
                        }
                        status
                        type
                        metadata {
                          name
                          content
                        }
                        rejected_reason
                      }
                    }
                    pageInfo {
                      ...CorePageInfoField
                    }
                  }
                }
              `}
              perPage={10}
              editAttributes={[
                {
                  label: "Status Laporan",
                  name: "status",
                  type: "select",
                  values: selectObjectExtractor(ReportStatus),
                },
                {
                  label: "Alasan Penolakan",
                  name: "status",
                  type: "text",
                  values: selectObjectExtractor(ReportStatus),
                },
              ]}
              deleteQuery={gql`
                mutation DeleteReport($id: ID!) {
                  deleteReport(id: $id) {
                    id
                  }
                }
              `}
              editQuery={gql`
                mutation UpdateReport(
                  $id: ID!
                  $name: String
                  $rejected_reason: String
                  $status: ReportStatus
                ) {
                  updateReport(
                    id: $id
                    input: {
                      name: $name
                      rejected_reason: $rejected_reason
                      status: $status
                    }
                  ) {
                    id
                  }
                }
              `}
              editFields="updateReport"
              headers={[
                {
                  label: "Target",
                  name: "receiver.name",
                },
                {
                  label: "Tipe",
                  name: "type",
                },
                {
                  label: "Status",
                  name: "status",
                },
                {
                  label: "Nama",
                  name: "metadata.name",
                },
                {
                  label: "Surat Pemanggilan",
                  name: "metadata.content",
                },
                {
                  label: "Alasan Penolakan Pemanggilan",
                  name: "rejected_reason",
                },
              ]}
            />
          </TabPanel>
        </Tabs>
      )}
    </DashboardContainer>
  );
}
