import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import UserCard from "../../../components/Card/UserCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import ImageContainer from "../../../components/Container/ImageContainer";
import SchoolView from "../../../components/View/SchoolView";
import { CoreUserInfoMinimalField } from "../../../fragments/fragments";
import { useUserStore } from "../../../store/user";
import { School } from "../../../types/type";

export default function SchoolPage() {
  const { user } = useUserStore();
  const { data: { school } = {} } = useQuery<{ school: School }>(
    gql`
      ${CoreUserInfoMinimalField}
      query GetSchool($id: ID!) {
        school(id: $id) {
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
    `,
    {
      variables: {
        id: user?.school?.id,
      },
    }
  );
  return (
    <DashboardContainer>
      <SchoolView school={school} />
    </DashboardContainer>
  );
}
