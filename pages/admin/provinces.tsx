import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Province } from "../../types/type";

export default function Provinces() {
  return (
    <DashboardContainer admin title="provinces">
      <Loader<Province>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="provinces"
        query={gql`
          ${CorePageInfoField}
          query GetProvinces($first: Int!, $after: String, $name: String) {
            provinces(first: $first, after: $after, name: $name) {
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
          mutation DeleteProvince($id: ID!) {
            deleteProvince(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateProvince($id: ID!, $name: String) {
            updateProvince(id: $id, input: { name: $name }) {
              id
            }
          }
        `}
        editFields="updateProvince"
      />
    </DashboardContainer>
  );
}
