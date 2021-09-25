import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Examtype } from "../../types/type";

export default function Examtypes() {
  return (
    <DashboardContainer admin title="examtypes">
      <Loader<Examtype>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="examtypes"
        query={gql`
          ${CorePageInfoField}
          query GetExamtypes($first: Int!, $after: String, $name: String) {
            examtypes(first: $first, after: $after, name: $name) {
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
        SkeletonComponent={BaseCardSkeleton}
        perPage={10}
        editAttributes={[
          {
            label: "Nama",
            name: "name",
            type: "text",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteExamtype($id: ID!) {
            deleteExamtype(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateExamtype($id: ID!, $name: String) {
            updateExamtype(id: $id, input: { id: $id, name: $name }) {
              id
            }
          }
        `}
        editFields="updateExamtype"
      />
    </DashboardContainer>
  );
}
