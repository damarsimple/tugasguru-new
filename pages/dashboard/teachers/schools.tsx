import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Loader from "../../../components/BoxLoader";
import UserCard from "../../../components/Card/UserCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import ImageContainer from "../../../components/Container/ImageContainer";
import FormModal from "../../../components/FormModal";
import SchoolView from "../../../components/View/SchoolView";
import {
  CorePageInfoField,
  CoreUserInfoMinimalField,
} from "../../../fragments/fragments";
import { useUserStore } from "../../../store/user";
import { GenericOutput, School, SchoolConnection } from "../../../types/type";

export default function SchoolPage() {
  const { user } = useUserStore();

  const { data: { schools } = {}, refetch } = useQuery<{
    schools: SchoolConnection;
  }>(
    gql`
      ${CoreUserInfoMinimalField}
      ${CorePageInfoField}
      query GetSchool($first: Int!, $after: String, $teacher_id: ID) {
        schools(first: $first, after: $after, teacher_id: $teacher_id) {
          edges {
            node {
              id
              name
              cover {
                path
              }
              teachers {
                ...CoreUserInfoMinimalField
              }
              students {
                ...CoreUserInfoMinimalField
              }
              administrators {
                ...CoreUserInfoMinimalField
              }
              counselors {
                ...CoreUserInfoMinimalField
              }
            }
          }
          pageInfo {
            ...CorePageInfoField
          }
        }
      }
    `,
    {
      variables: {
        first: 100,
        teacher_id: user?.id,
      },
    }
  );

  return (
    <DashboardContainer>
      <FormModal<{ joinSchool: GenericOutput }>
        mutationQuery={gql`
          mutation JoinSchool($school_id: ID!) {
            JoinSchool(school_id: $school_id) {
              status
              message
            }
          }
        `}
        openMessage="gabung ke sekolah"
        fields={"JoinSchool"}
        submitName="Tambah"
        editAttributes={[
          {
            label: "Sekolah",
            type: "select",
            values: [],
            required: true,
            name: "school_id",
          },
        ]}
        afterSubmit={(e) => {
          e.joinSchool?.status
            ? toast.success(e?.joinSchool.message)
            : toast.error(e.joinSchool.message);
          refetch();
        }}
      />
      <Tabs>
        <TabList>
          {schools?.edges.map((e) => (
            <Tab key={e.node.id}>{e.node?.name}</Tab>
          ))}
        </TabList>
        {schools?.edges.map((e) => (
          <TabPanel key={e.node.id}>
            <SchoolView school={e.node} />
          </TabPanel>
        ))}
      </Tabs>
    </DashboardContainer>
  );
}
