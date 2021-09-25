import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Transaction } from "../../types/type";

export default function Transactions() {
  return (
    <DashboardContainer admin title="Transaksi">
      <Loader<Transaction>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={({ uuid }) => <BaseCard name={uuid} />}
        fields="transactions"
        query={gql`
          ${CorePageInfoField}
          query GetTransactions(
            $first: Int!
            $after: String
            $uuid: String
            $user_id: ID
            $paid: Boolean
            $payment_method: String
          ) {
            transactions(
              first: $first
              after: $after
              uuid: $uuid
              user_id: $user_id
              paid: $paid
              payment_method: $payment_method
            ) {
              edges {
                node {
                  id
                  uuid
                  amount
                  tax
                  discount
                  paid
                  payment_method
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
            label: "Diskon",
            name: "discount",
            type: "number",
          },
          {
            label: "Dibayar",
            name: "paid",
            type: "checkbox",
          },
          {
            label: "Metode Pembayaran",
            name: "payment_method",
            type: "text",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteTransaction($id: ID!) {
            deleteTransaction(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateTransaction(
            $id: ID!
            $uuid: String
            $amount: Float
            $tax: Float
            $discount: Float
            $paid: Boolean
            $payment_method: String
          ) {
            updateTransaction(
              id: $id
              input: {
                id: $id
                uuid: $uuid
                amount: $amount
                tax: $tax
                discount: $discount
                paid: $paid
                payment_method: $payment_method
              }
            ) {
              id
            }
          }
        `}
        editFields="updateTransaction"
      />
    </DashboardContainer>
  );
}
