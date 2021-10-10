import gql from "graphql-tag";
import React from "react";
import DashboardContainer from "../../components/Container/DashboardContainer";
import Table from "../../components/Table";
import { CorePageInfoField } from "../../fragments/fragments";
import { selectObjectExtractor } from "../../helpers/formatter";
import { useUserStore } from "../../store/user";
import { Report, ReportStatus } from "../../types/type";

export default function Reports() {
  const { user } = useUserStore();
  return (
    <DashboardContainer admin title="Laporan">
      <Table<Report>
        fetchPolicy="network-only"
        withAction
        withSearchbar
        fields="reports"
        variables={{ receiver_id: user?.id }}
        query={gql`
          ${CorePageInfoField}
          query GetReports(
            $first: Int!
            $after: String
            $receiver_id: ID
            $name: String
            $type: ReportType
          ) {
            reports(
              first: $first
              after: $after
              receiver_id: $receiver_id
              name: $name
              type: $type
            ) {
              edges {
                node {
                  id
                  name
                  user {
                    id
                    name
                  }
                  status
                  type
                  metadata {
                    name
                    content
                  }
                  rejected_reason
                }
              }
              pageInfo {
                ...CorePageInfoField
              }
            }
          }
        `}
        perPage={10}
        editAttributes={[
          // {
          //   label: "Nama",
          //   name: "name",
          //   type: "text",
          // },
          {
            label: "Status Laporan",
            name: "status",
            type: "select",
            values: selectObjectExtractor(ReportStatus),
          },
          {
            label: "Alasan Penolakan",
            name: "status",
            type: "text",
            values: selectObjectExtractor(ReportStatus),
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
          mutation UpdateReport(
            $id: ID!
            $name: String
            $rejected_reason: String
            $status: ReportStatus
          ) {
            updateReport(
              id: $id
              input: {
                name: $name
                rejected_reason: $rejected_reason
                status: $status
              }
            ) {
              id
            }
          }
        `}
        editFields="updateReport"
        headers={[
          {
            label: "Nama Laporan",
            name: "name",
          },
          {
            label: "Pengaju",
            name: "user.name",
          },
          {
            label: "Tipe",
            name: "type",
          },
          {
            label: "Status",
            name: "status",
          },
          {
            label: "Metadata Nama",
            name: "metadata.name",
          },
          {
            label: "Metadata Konten",
            name: "metadata.content",
          },
          {
            label: "Alasan Penolakan",
            name: "rejected_reason",
          },
        ]}
      />
    </DashboardContainer>
  );
}
