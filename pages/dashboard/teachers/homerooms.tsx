import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import Select from "../../../components/Select";
import Table from "../../../components/Table";
import { CorePageInfoField } from "../../../fragments/fragments";
import { Examplay, User } from "../../../types/type";

export default function Homeroom() {
  const [classroom, setClassroom] = useState<undefined | string>(undefined);
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
      <Tabs>
        <TabList>
          <Tab>Data Nilai</Tab>
          <Tab>Data Kehadiran</Tab>
          <Tab>Data Panggilan</Tab>
        </TabList>
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
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}
