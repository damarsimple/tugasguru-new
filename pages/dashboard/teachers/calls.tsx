import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { uniq } from "lodash";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import FormModal from "../../../components/FormModal";
import Table from "../../../components/Table";
import {
  CorePageInfoField,
  CoreUserInfoMinimalField,
} from "../../../fragments/fragments";
import {
  selectExtractor,
  selectObjectExtractor,
} from "../../../helpers/formatter";
import useDebounces from "../../../hooks/useDebounces";
import useTeacherData from "../../../hooks/useTeacherData";
import { useUserStore } from "../../../store/user";
import { Report, ReportStatus, ReportType, School } from "../../../types/type";

export default function Reports() {
  const { user } = useUserStore();
  const { ready, handleDebounce } = useDebounces();
  const [school, setSchool] = useState<undefined | string>(undefined);

  const { data: { school: schoolData } = {} } = useQuery<{
    school: School;
  }>(
    gql`
      ${CoreUserInfoMinimalField}
      query GetSchool($id: ID!) {
        school(id: $id) {
          students {
            ...CoreUserInfoMinimalField
          }
        }
      }
    `,
    {
      variables: {
        id: school,
      },
    }
  );
  const { schools } = useTeacherData();
  return (
    <DashboardContainer title="Pemanggilan Orang Tua">
      <FormModal
        mutationQuery={gql`
          mutation createReport($metadata: String, $receiver_id: ID!) {
            createReport(
              input: {
                receiver_id: $receiver_id
                name: "Pemanggilan Orang Tua"
                type: PARENT_CALL
                metadata: $metadata
              }
            ) {
              id
            }
          }
        `}
        openMessage="buat pemanggilan"
        fields={"createReport"}
        submitName="Ajukan"
        editAttributes={[
          {
            label: "Judul Pemanggilan",
            required: true,
            name: "metadata.name",
          },
          {
            label: "Isi Pemanggilan",
            required: true,
            name: "metadata.content",
          },
          {
            label: "Sekolah",
            required: true,
            type: "select",
            values: schools?.map(selectExtractor),
            name: "school_id",
          },
          {
            label: "Siswa Penerima",
            required: true,
            type: "select",
            values:
              schoolData && uniq(schoolData?.students)?.map(selectExtractor),
            name: "receiver_id",
          },
        ]}
        afterSubmit={() => {
          toast.success("Berhasil mengirim pemanggilan");
          handleDebounce();
        }}
        onValueChange={(e, v) => {
          if (e == "school_id") {
            setSchool(v as string);
          }
        }}
      />
      {ready && (
        <Table<Report>
          fetchPolicy="network-only"
          withAction
          withSearchbar
          fields="reports"
          variables={{ user_id: user?.id, type: ReportType.Parent_call }}
          query={gql`
            ${CorePageInfoField}
            query GetReports(
              $first: Int!
              $after: String
              $user_id: ID
              $name: String
              $type: ReportType
            ) {
              reports(
                first: $first
                after: $after
                user_id: $user_id
                name: $name
                type: $type
              ) {
                edges {
                  node {
                    id
                    name
                    receiver {
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
              label: "Target",
              name: "receiver.name",
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
              label: "Nama",
              name: "metadata.name",
            },
            {
              label: "Surat Pemanggilan",
              name: "metadata.content",
            },
            {
              label: "Alasan Penolakan Pemanggilan",
              name: "rejected_reason",
            },
          ]}
        />
      )}
    </DashboardContainer>
  );
}
