import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { uniq } from "lodash";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import FormModal from "../../../components/FormModal";
import Table from "../../../components/Table";
import {
  CorePageInfoField,
  CoreUserInfoMinimalField,
} from "../../../fragments/fragments";
import { selectExtractor } from "../../../helpers/formatter";
import useDebounces from "../../../hooks/useDebounces";
import useTeacherData from "../../../hooks/useTeacherData";
import { useUserStore } from "../../../store/user";
import { Consultation, School } from "../../../types/type";

export default function Consultations() {
  const { schools } = useTeacherData();
  const { user } = useUserStore();
  const { ready, handleDebounce } = useDebounces();
  const [school, setSchool] = useState<undefined | string>(undefined);

  const { data: { school: schoolData } = {} } = useQuery<{
    school: School;
  }>(
    gql`
      ${CoreUserInfoMinimalField}
      query GetSchool($id: ID!) {
        school(id: $id) {
          homerooms {
            ...CoreUserInfoMinimalField
          }
          counselors {
            ...CoreUserInfoMinimalField
          }
        }
      }
    `,
    {
      variables: {
        id: school,
      },
    }
  );

  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Konsultasi Saya</Tab>
          <Tab>Konsultasi Ditujukan ke Saya</Tab>
        </TabList>
        <TabPanel>
          <FormModal<Consultation>
            mutationQuery={gql`
              mutation createConsultation(
                $school_id: ID!
                $consultant_id: ID!
                $name: String!
                $metadata: String
              ) {
                createConsultation(
                  input: {
                    school_id: $school_id
                    consultant_id: $consultant_id
                    name: $name
                    metadata: $metadata
                  }
                ) {
                  id
                }
              }
            `}
            openMessage="buat konsultasi baru"
            fields={"createConsultation"}
            submitName="Tambah"
            onValueChange={(e, v) => {
              if (e == "school_id") {
                setSchool(v as string);
              }
            }}
            editAttributes={[
              {
                label: "Judul Konsultasi",
                name: "name",
                required: true,
              },
              {
                label: "Masalah",
                name: "metadata.problem",
                required: true,
              },
              {
                label: "Sekolah",
                name: "school_id",
                type: "select",
                values: schools?.map(selectExtractor),
                required: true,
              },
              {
                label: "Konsultant",
                name: "consultant_id",
                type: "select",
                values:
                  schoolData &&
                  uniq([
                    ...schoolData?.homerooms,
                    ...schoolData?.counselors,
                  ])?.map(selectExtractor),
                required: true,
              },
            ]}
            afterSubmit={() => {
              toast.success("Berhasil menambah");
              handleDebounce();
            }}
            successMessage="Berhasil mengirim konsultasi"
          />
          {ready && (
            <Table<Consultation>
              withSearchbar
              query={gql`
                ${CorePageInfoField}
                query GetMyConsultations(
                  $first: Int!
                  $after: String
                  $user_id: ID
                  $name: String
                ) {
                  consultations(
                    first: $first
                    after: $after
                    user_id: $user_id
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
            />
          )}
        </TabPanel>

        <TabPanel>
          {ready && (
            <Table<Consultation>
              withSearchbar
              query={gql`
                ${CorePageInfoField}
                query GetMyConsultations(
                  $first: Int!
                  $after: String
                  $consultant_id: ID
                  $name: String
                ) {
                  consultations(
                    first: $first
                    after: $after
                    consultant_id: $consultant_id
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
                  updateConsultation(id: $id, input: { metadata: $metadata }) {
                    id
                  }
                }
              `}
            />
          )}
        </TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}
