import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Extracurricular } from "../../types/type";

export default function Extracurriculars() {
  return (
    <DashboardContainer admin title="Extrakulikuler">
      <Loader<Extracurricular>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="extracurriculars"
        query={gql`
          ${CorePageInfoField}
          query GetExtracurriculars(
            $first: Int!
            $after: String
            $name: String
            $abbreviation: String
            $description: String
            $type: String
          ) {
            extracurriculars(
              first: $first
              after: $after
              name: $name
              abbreviation: $abbreviation
              description: $description
              type: $type
            ) {
              edges {
                node {
                  id
                  name
                  abbreviation
                  description
                  type
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
            label: "Singkatan",
            name: "abbreviation",
            type: "text",
          },
          {
            label: "Deksripsi",
            name: "description",
            type: "text",
          },
          {
            label: "Tipe",
            name: "type",
            type: "text",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteExtracurricular($id: ID!) {
            deleteExtracurricular(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateExtracurricular(
            $id: ID!
            $name: String
            $abbreviation: String
            $description: String
            $type: String
          ) {
            updateExtracurricular(
              id: $id
              input: {
                id: $id
                name: $name
                abbreviation: $abbreviation
                description: $description
                type: $type
              }
            ) {
              id
            }
          }
        `}
        editFields="updateExtracurricular"
      />
    </DashboardContainer>
  );
}
