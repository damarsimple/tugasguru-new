import gql from "graphql-tag";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Button from "../../../../components/Button";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import Input from "../../../../components/Forms/Input";
import Paper from "../../../../components/Paper";
import Table from "../../../../components/Table";
import { CorePageInfoField } from "../../../../fragments/fragments";
import { selectExtractor } from "../../../../helpers/formatter";
import useTeacherData from "../../../../hooks/useTeacherData";
import { Assigmentsubmission, Examplay } from "../../../../types/type";

export default function Grades() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
  const { myclassrooms } = useTeacherData();
  return (
    <DashboardContainer>
      <Button href="/dashboard/teachers/grades/create">
        Buat Laporan Nilai
      </Button>
      <Paper name="Filter">
        <Input
          type="select"
          label="Ruang Kelas"
          values={myclassrooms?.map(selectExtractor)}
          onTextChange={setClassroom}
          required
        />
      </Paper>
      <div className="my-10" />
      {classroom && (
        <Tabs>
          <TabList>
            <Tab>Nilai Tugas</Tab>
            <Tab>Nilai Ujian</Tab>
          </TabList>
          <TabPanel>
            <Table<Assigmentsubmission>
              query={gql`
                ${CorePageInfoField}
                query GetAssigmentsSubmissions(
                  $first: Int!
                  $after: String
                  $classroom_id: ID
                ) {
                  assigmentsubmissions(
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
                        assigment {
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
              fields={"assigmentsubmissions"}
              fetchPolicy="network-only"
              variables={{
                classroom_id: classroom,
              }}
              headers={[
                {
                  name: "assigment.name",
                  label: "Nama Tugas",
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
          </TabPanel>
          <TabPanel>
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
          </TabPanel>
        </Tabs>
      )}
    </DashboardContainer>
  );
}
