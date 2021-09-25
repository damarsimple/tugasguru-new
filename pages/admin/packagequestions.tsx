import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Packagequestion } from "../../types/type";

export default function Packagequestions() {
  return (
    <DashboardContainer admin title="packagequestions">
      <Loader<Packagequestion>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="packagequestions"
        query={gql`
          ${CorePageInfoField}
          query GetPackagequestions(
            $first: Int!
            $after: String
            $visibility: Visibility
          ) {
            packagequestions(
              first: $first
              after: $after
              visibility: $visibility
            ) {
              edges {
                node {
                  id
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
        editAttributes={[]}
        deleteQuery={gql`
          mutation DeletePackagequestion($id: ID!) {
            deletePackagequestion(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdatePackagequestion($id: ID!) {
            updatePackagequestion(id: $id, input: { id: $id }) {
              id
            }
          }
        `}
        editFields="updatePackagequestion"
      />
    </DashboardContainer>
  );
}
