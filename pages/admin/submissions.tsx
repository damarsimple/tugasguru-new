import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Submission } from "../../types/type";

export default function Submissions() {
  return (
    <DashboardContainer admin title="Sumbisi">
      <Loader<Submission>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="submissions"
        query={gql`
          ${CorePageInfoField}
          query GetSubmissions(
            $first: Int!
            $after: String
            $name: String
            $max_submission: Int
            $is_paid: Boolean
            $price: Float
            $open_at: DateTime
            $close_at: DateTime
          ) {
            submissions(
              first: $first
              after: $after
              name: $name
              max_submission: $max_submission
              is_paid: $is_paid
              price: $price
              open_at: $open_at
              close_at: $close_at
            ) {
              edges {
                node {
                  id
                  name
                  max_submission
                  is_paid
                  price
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
            label: "Max Submisi",
            name: "max_submission",
            type: "number",
          },
          {
            label: "Dibayar",
            name: "is_paid",
            type: "checkbox",
          },
          {
            label: "Harga",
            name: "price",
            type: "number",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteSubmission($id: ID!) {
            deleteSubmission(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateSubmission(
            $id: ID!
            $name: String
            $max_submission: Int
            $is_paid: Boolean
            $price: Float
          ) {
            updateSubmission(
              id: $id
              input: {
                id: $id
                name: $name
                max_submission: $max_submission
                is_paid: $is_paid
                price: $price
              }
            ) {
              id
            }
          }
        `}
        editFields="updateSubmission"
      />
    </DashboardContainer>
  );
}
