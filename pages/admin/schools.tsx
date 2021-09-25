import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { School } from "../../types/type";

export default function Schools() {
  return (
    <DashboardContainer admin title="Sekolah">
      <Loader<School>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="schools"
        query={gql`
          ${CorePageInfoField}
          query GetSchools(
            $first: Int!
            $after: String
            $document_id: ID
            $name: String
            $npsn: String
            $teachers: [User]
            $homerooms: [User]
            $administrators: [User]
            $counselors: [User]
            $user_id: ID
          ) {
            schools(
              first: $first
              after: $after
              document_id: $document_id
              name: $name
              npsn: $npsn
              teachers: $teachers
              homerooms: $homerooms
              administrators: $administrators
              counselors: $counselors
              user_id: $user_id
            ) {
              edges {
                node {
                  id
                  name
                  npsn
                }
              }
              pageInfo {
                ...CorePageInfoField
              }
            }
          }
        `}
        SkeletonComponent={BaseCardSkeleton}
        perPage={10}
        editAttributes={[
          {
            label: "Nama",
            name: "name",
            type: "text",
          },
          {
            label: "NPSN",
            name: "npsn",
            type: "text",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteSchool($id: ID!) {
            deleteSchool(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateSchool($id: ID!, $name: String, $npsn: String) {
            updateSchool(
              id: $id
              input: { id: $id, name: $name, npsn: $npsn }
            ) {
              id
            }
          }
        `}
        editFields="updateSchool"
      />
    </DashboardContainer>
  );
}
