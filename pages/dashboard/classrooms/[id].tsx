import { gql, useQuery } from "@apollo/client";
import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Loader from "../../../components/BoxLoader";
import AssigmentCard from "../../../components/Card/AssigmentCard";
import { BaseCardSkeleton } from "../../../components/Card/BaseCard";
import ExamCard from "../../../components/Card/ExamCard";
import UserCard from "../../../components/Card/UserCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import {
  CorePageInfoField,
  CoreUserInfoMinimalField,
} from "../../../fragments/fragments";
import { Assigment, Classroom, Exam } from "../../../types/type";

function Id({ router }: WithRouterProps) {
  const { id } = router.query;

  const { data: { classroom } = {} } = useQuery<{ classroom: Classroom }>(
    gql`
      ${CoreUserInfoMinimalField}
      query GetClassroom($id: ID!) {
        classroom(id: $id) {
          id
          name
          user {
            ...CoreUserInfoMinimalField
          }
          users {
            ...CoreUserInfoMinimalField
          }
        }
      }
    `,
    {
      variables: { id },
    }
  );

  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Anggota Kelas</Tab>
          <Tab>Ujian</Tab>
          <Tab>Tugas</Tab>
        </TabList>
        <TabPanel className="flex flex-col gap-2">
          <h2 className="font-semibold text-xl">Guru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {classroom?.user && <UserCard {...classroom.user} />}
          </div>
          <hr />
          <h2 className="font-semibold text-xl">Siswa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {classroom?.users?.map((e) => {
              return <UserCard {...e} key={e.id} />;
            })}
          </div>
        </TabPanel>
        <TabPanel>
          <Loader<Exam>
            query={gql`
              ${CorePageInfoField}
              query GetExams(
                $first: Int!
                $after: String
                $name: String
                $classroom_id: ID
              ) {
                exams(
                  first: $first
                  after: $after
                  name: $name
                  classroom_id: $classroom_id
                ) {
                  edges {
                    node {
                      id
                      name
                      examplaysCount
                    }
                  }
                  pageInfo {
                    ...CorePageInfoField
                  }
                }
              }
            `}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-10"
            perPage={10}
            fields={"exams"}
            fetchPolicy="network-only"
            withSearchbar
            variables={{
              classroom_id: id,
            }}
            Component={(e) => (
              <div>
                <ExamCard {...e} buttonLabel="Buka Ujian" route="/exams/" />
              </div>
            )}
            SkeletonComponent={BaseCardSkeleton}
          />
        </TabPanel>
        <TabPanel>
          <Loader<Assigment>
            query={gql`
              ${CorePageInfoField}
              query GetAssigments(
                $first: Int!
                $after: String
                $name: String
                $classroom_id: ID
              ) {
                assigments(
                  first: $first
                  after: $after
                  name: $name
                  classroom_id: $classroom_id
                ) {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                  pageInfo {
                    ...CorePageInfoField
                  }
                }
              }
            `}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-10"
            perPage={10}
            fields={"assigments"}
            fetchPolicy="network-only"
            withSearchbar
            variables={{
              classroom_id: id,
            }}
            Component={(e) => (
              <div>
                <AssigmentCard {...e} buttonLabel="Buka Tugas" />
              </div>
            )}
            SkeletonComponent={BaseCardSkeleton}
          />
        </TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}

export default withRouter(Id);
