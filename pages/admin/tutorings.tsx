import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Tutoring } from "../../types/type";

export default function Tutorings() {
  return (
    <DashboardContainer admin title="Tutor">
      <Loader<Tutoring>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={({ status }) => <BaseCard name={status} />}
        fields="tutorings"
        query={gql`
          ${CorePageInfoField}
          query GetTutorings(
            $first: Int!
            $after: String
            $tutor: User
            $finish_at: DateTime
            $rate: Float
            $is_approved: Boolean
          ) {
            tutorings(
              first: $first
              after: $after
              tutor: $tutor
              finish_at: $finish_at
              rate: $rate
              is_approved: $is_approved
            ) {
              edges {
                node {
                  id
                  rate
                  is_approved
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
            label: "Tarif",
            name: "rate",
            type: "number",
          },
          {
            label: "Di setujui ",
            name: "is_approved",
            type: "checkbox",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteTutoring($id: ID!) {
            deleteTutoring(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateTutoring(
            $id: ID!
            $rate: Float
            $is_approved: Boolean
          ) {
            updateTutoring(
              id: $id
              input: { rate: $rate, is_approved: $is_approved }
            ) {
              id
            }
          }
        `}
        editFields="updateTutoring"
      />
    </DashboardContainer>
  );
}
