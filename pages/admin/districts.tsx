import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { District } from "../../types/type";

export default function Districts() {
  return (
    <DashboardContainer admin title="districts">
      <Loader<District>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="districts"
        query={gql`
          ${CorePageInfoField}
          query GetDistricts($first: Int!, $after: String, $name: String) {
            districts(first: $first, after: $after, name: $name) {
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
          mutation DeleteDistrict($id: ID!) {
            deleteDistrict(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateDistrict($id: ID!, $name: String) {
            updateDistrict(id: $id, input: { name: $name }) {
              id
            }
          }
        `}
        editFields="updateDistrict"
      />
    </DashboardContainer>
  );
}
