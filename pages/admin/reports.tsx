import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Report } from "../../types/type";

export default function Reports() {
  return (
    <DashboardContainer admin title="Laporan">
      <Loader<Report>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="reports"
        query={gql`
          ${CorePageInfoField}
          query GetReports(
            $first: Int!
            $after: String
            $receiver: User
            $name: String
            $type: ReportType
          ) {
            reports(
              first: $first
              after: $after
              receiver: $receiver
              name: $name
              type: $type
            ) {
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
          mutation DeleteReport($id: ID!) {
            deleteReport(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateReport($id: ID!, $name: String) {
            updateReport(id: $id, input: { name: $name }) {
              id
            }
          }
        `}
        editFields="updateReport"
      />
    </DashboardContainer>
  );
}
