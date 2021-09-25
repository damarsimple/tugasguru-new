import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Voucher } from "../../types/type";

export default function Vouchers() {
  return (
    <DashboardContainer admin title="vouchers">
      <Loader<Voucher>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="vouchers"
        query={gql`
          ${CorePageInfoField}
          query GetVouchers(
            $first: Int!
            $after: String
            $code: String
            $name: String
            $percentage: Float
            $expired_at: DateTime
          ) {
            vouchers(
              first: $first
              after: $after
              code: $code
              name: $name
              percentage: $percentage
              expired_at: $expired_at
            ) {
              edges {
                node {
                  id
                  code
                  name
                  percentage
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
            label: "Kode",
            name: "code",
            type: "text",
          },
          {
            label: "Nama",
            name: "name",
            type: "text",
          },
          {
            label: "Persentase",
            name: "percentage",
            type: "number",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteVoucher($id: ID!) {
            deleteVoucher(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateVoucher(
            $id: ID!
            $code: String
            $name: String
            $percentage: Float
          ) {
            updateVoucher(
              id: $id
              input: {
                id: $id
                code: $code
                name: $name
                percentage: $percentage
              }
            ) {
              id
            }
          }
        `}
        editFields="updateVoucher"
      />
    </DashboardContainer>
  );
}
