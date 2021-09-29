import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Classtype } from "../../types/type";

export default function Classtypes() {
  return (
    <DashboardContainer admin title="classtypes">
      <Loader<Classtype>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={(e) => <BaseCard name={"Kelas " + e.level.toString()} />}
        fields="classtypes"
        query={gql`
          ${CorePageInfoField}
          query GetClasstypes($first: Int!, $after: String, $level: Int) {
            classtypes(first: $first, after: $after, level: $level) {
              edges {
                node {
                  id
                  level
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
            label: "Level",
            name: "level",
            type: "number",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteClasstype($id: ID!) {
            deleteClasstype(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateClasstype($id: ID!, $level: Int) {
            updateClasstype(id: $id, input: { level: $level }) {
              id
            }
          }
        `}
        editFields="updateClasstype"
      />
    </DashboardContainer>
  );
}
