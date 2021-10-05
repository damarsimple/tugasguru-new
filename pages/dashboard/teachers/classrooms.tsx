import { gql, useQuery } from "@apollo/client";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import Loader from "../../../components/BoxLoader";
import Button from "../../../components/Button";
import BaseCard, { BaseCardSkeleton } from "../../../components/Card/BaseCard";
import ClassroomCard, {
  ClassroomCardSkeleton,
} from "../../../components/Card/ClassroomCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import FormModal from "../../../components/FormModal";
import { CorePageInfoField } from "../../../fragments/fragments";
import { selectExtractor } from "../../../helpers/formatter";
import useDebounces from "../../../hooks/useDebounces";
import useTeacherData from "../../../hooks/useTeacherData";
import { useUserStore } from "../../../store/user";
import { Classroom, Subject } from "../../../types/type";

export default function Classrooms() {
  const { user } = useUserStore();

  const { classtypes, schools } = useTeacherData();

  const {
    data: { subjectsAll } = {},
    loading,
    error,
    refetch: refetchSubject,
  } = useQuery<{ subjectsAll: Subject[] }>(
    gql`
      query GetSubject($user_id: ID) {
        subjectsAll(user_id: $user_id) {
          id
          name
        }
      }
    `,
    {
      variables: { user_id: user?.id },
    }
  );

  const { data: { subjectsAll: allSubjects } = {} } = useQuery<{
    subjectsAll: Subject[];
  }>(gql`
    query GetSubjects {
      subjectsAll {
        id
        name
      }
    }
  `);

  const { ready, handleDebounce } = useDebounces();
  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Ruang Kelas</Tab>
          <Tab>Mata Pelajaran</Tab>
        </TabList>
        <TabPanel>
          <FormModal<Classroom>
            mutationQuery={gql`
              mutation createClassroom(
                $school_id: ID!
                $classtype_id: ID!
                $name: String!
              ) {
                createClassroom(
                  input: {
                    school_id: $school_id
                    classtype_id: $classtype_id
                    name: $name
                  }
                ) {
                  id
                }
              }
            `}
            openMessage="buat ruang kelas baru"
            fields={"assignSubject"}
            submitName="Tambah"
            editAttributes={[
              {
                label: "Nama",
                name: "name",
                required: true,
              },
              {
                label: "Sekolah",
                type: "select",
                values: schools?.map(selectExtractor),
                required: true,
                name: "school_id",
              },
              {
                label: "Tipe Kelas",
                type: "select",
                values: classtypes
                  ?.map((e) => {
                    return { ...e, name: `Kelas ${e.level}` };
                  })
                  .map(selectExtractor),
                required: true,
                name: "classtype_id",
              },
            ]}
            afterSubmit={() => {
              toast.success("Berhasil menambah");
              refetchSubject();
              handleDebounce();
            }}
          />
          {ready && (
            <Loader<Classroom>
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              fetchPolicy="network-only"
              Component={ClassroomCard}
              fields="classrooms"
              query={gql`
                ${CorePageInfoField}
                query GetUsers($first: Int!, $after: String, $user_id: ID) {
                  classrooms(first: $first, after: $after, user_id: $user_id) {
                    edges {
                      node {
                        id
                        name

                        school {
                          id
                          name
                        }
                        classtype {
                          id
                          level
                        }
                        user {
                          name
                          cover {
                            path
                          }
                        }
                        notifications {
                          id
                          type
                          read_at
                          data {
                            id
                            message
                            start_at
                            finish_at
                            type
                            name
                            definition
                          }
                        }
                      }
                    }
                    pageInfo {
                      ...CorePageInfoField
                    }
                  }
                }
              `}
              SkeletonComponent={ClassroomCardSkeleton}
              perPage={10}
              variables={{ user_id: user?.id }}
            />
          )}
        </TabPanel>

        <TabPanel>
          <div className="flex  gap-2">
            <FormModal
              mutationQuery={gql`
                mutation AssignSubject($subject_id: ID!) {
                  assignSubject(subject_id: $subject_id) {
                    status
                  }
                }
              `}
              openMessage="tambah mata pelajaran yang diajarkan"
              fields={"assignSubject"}
              submitName="Tambah"
              editAttributes={[
                {
                  label: "Mata Pelajaran",
                  type: "select",
                  values: allSubjects?.map(selectExtractor),
                  required: true,
                  name: "subject_id",
                },
              ]}
              afterSubmit={() => {
                toast.success("Berhasil menambah");
                refetchSubject();
              }}
            />
            {/* <FormModal
              openMessage="ajukan mata pelajaran"
              createQuery={gql`
                mutation AssignSubject($subject_id: ID!) {
                  assignSubject(subject_id: $subject_id) {
                    id
                  }
                }
              `}
            /> */}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {subjectsAll?.map((e) => (
              <div key={e.id}>
                <BaseCard name={e.name} />
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}
