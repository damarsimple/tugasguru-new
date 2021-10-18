import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import Select from "../../../components/Select";
import SelectLoader from "../../../components/SelectLoader";
import Table from "../../../components/Table";
import { CorePageInfoField } from "../../../fragments/fragments";
import { useUserStore } from "../../../store/user";
import { Consultation, User } from "../../../types/type";

export default function Counselors() {
  const { user } = useUserStore();

  const [schoolId, setSchoolId] = useState<undefined | string>(undefined);
  const { data, loading } = useQuery<{ me: User }>(gql`
    query Schools {
      me {
        schools {
          id
          name
        }
      }
    }
  `);
  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Konsultasi Masalah</Tab>
          <Tab>Data Kelanjutan Pendidikan Siswa</Tab>
        </TabList>
        <TabPanel>
          <div>
            <Select
              attributes={
                data?.me?.schools?.map((e) => {
                  return { label: e.name, value: e.id };
                }) ?? []
              }
              label={"Sekolah"}
              loading={loading}
              onChange={setSchoolId}
            />

            {schoolId && (
              <Table<Consultation>
                withSearchbar
                query={gql`
                  ${CorePageInfoField}
                  query GetMyConsultations(
                    $first: Int!
                    $after: String
                    $consultant_id: ID
                    $school_id: ID
                    $name: String
                  ) {
                    consultations(
                      first: $first
                      after: $after
                      consultant_id: $consultant_id
                      school_id: $school_id
                      name: $name
                    ) {
                      edges {
                        node {
                          id
                          name
                          metadata {
                            note
                            problem
                            advice
                          }
                          consultant {
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
                fields={"consultations"}
                fetchPolicy="network-only"
                variables={{
                  user_id: user?.id,
                  school_id: schoolId,
                }}
                headers={[
                  {
                    name: "name",
                    label: "Judul Konsultasi",
                  },
                  {
                    name: "consultant.name",
                    label: "Konsultant",
                  },
                  {
                    name: "metadata.problem",
                    label: "Masalah",
                  },
                  {
                    name: "metadata.advice",
                    label: "Saran",
                  },
                  {
                    name: "metadata.note",
                    label: "Catatan",
                  },
                ]}
                withAction
                editAttributes={[
                  {
                    label: "Saran",
                    name: "metadata.advice",
                  },
                  {
                    label: "Catatan",
                    name: "metadata.note",
                  },
                ]}
                editFields={"updateConsultation"}
                editQuery={gql`
                  mutation UpdateConsultation($id: ID!, $metadata: String) {
                    updateConsultation(
                      id: $id
                      input: { metadata: $metadata }
                    ) {
                      id
                    }
                  }
                `}
              />
            )}
          </div>
        </TabPanel>
        <TabPanel>Menunggu Penjelasan</TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}
