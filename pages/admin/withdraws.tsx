import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { BOOLEAN_SELECT_VALUE } from "../../helpers/formatter";
import { Withdraw } from "../../types/type";

export default function Withdraws() {
  return (
    <DashboardContainer admin title="Penarikan">
      <Loader<Withdraw>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={({ uuid }) => <BaseCard name={uuid} />}
        fields="withdraws"
        query={gql`
          ${CorePageInfoField}
          query GetWithdraws(
            $first: Int!
            $after: String
            $uuid: String
            $paid: Boolean
          ) {
            withdraws(first: $first, after: $after, uuid: $uuid, paid: $paid) {
              edges {
                node {
                  id
                  uuid
                  amount
                  tax
                  paid
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
            label: "UUID",
            name: "uuid",
            type: "text",
          },
          {
            label: "Banyak",
            name: "amount",
            type: "number",
          },
          {
            label: "Pajak",
            name: "tax",
            type: "number",
          },
          {
            label: "Dibayar",
            name: "paid",
            type: "select",
            values: BOOLEAN_SELECT_VALUE,
          },
        ]}
        deleteQuery={gql`
          mutation DeleteWithdraw($id: ID!) {
            deleteWithdraw(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateWithdraw(
            $id: ID!
            $uuid: String
            $amount: Float
            $tax: Float
            $paid: Boolean
          ) {
            updateWithdraw(
              id: $id
              input: {
                id: $id
                uuid: $uuid
                amount: $amount
                tax: $tax
                paid: $paid
              }
            ) {
              id
            }
          }
        `}
        editFields="updateWithdraw"
      />
    </DashboardContainer>
  );
}
