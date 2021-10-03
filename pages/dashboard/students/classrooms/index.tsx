import { useQuery, gql } from "@apollo/client";
import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import Loader from "../../../../components/BoxLoader";
import Button from "../../../../components/Button";
import BaseCard from "../../../../components/Card/BaseCard";
import ClassroomCard, {
  ClassroomCardSkeleton,
} from "../../../../components/Card/ClassroomCard";
import DashboardContainer from "../../../../components/Container/DashboardContainer";
import FormModal from "../../../../components/FormModal";
import { CorePageInfoField } from "../../../../fragments/fragments";
import { selectExtractor } from "../../../../helpers/formatter";
import useDebounces from "../../../../hooks/useDebounces";
import useTeacherData from "../../../../hooks/useTeacherData";
import { useUserStore } from "../../../../store/user";
import { Subject, Classroom } from "../../../../types/type";

export default function Classrooms() {
  const { user } = useUserStore();

  const { data: { candidateclassrooms } = {} } = useQuery<{
    candidateclassrooms: Classroom[];
  }>(gql`
    query GetCandidate {
      candidateclassrooms {
        id
        name
      }
    }
  `);
  const { ready, handleDebounce } = useDebounces();
  return (
    <DashboardContainer>
      <div className="flex flex-col gap-2">
        <FormModal
          submitName="Gabung Kelas"
          mutationQuery={gql`
            mutation JoinClassroom($classroom_id: ID!) {
              joinClassroom(classroom_id: $classroom_id) {
                status
                message
              }
            }
          `}
          successMessage="Berhasil bergabung dikelas"
          fields={"joinClassroom"}
          afterSubmit={handleDebounce}
          editAttributes={[
            {
              label: "Ruang Kelas",
              name: "classroom_id",
              type: "select",
              values: candidateclassrooms?.map(selectExtractor),
            },
          ]}
          openMessage="GABUNG KELAS"
        />
        {ready && (
          <Loader<Classroom>
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
            fetchPolicy="network-only"
            Component={ClassroomCard}
            fields="classrooms"
            query={gql`
              ${CorePageInfoField}
              query GetUsers($first: Int!, $after: String, $user_id: ID) {
                classrooms(first: $first, after: $after, student_id: $user_id) {
                  edges {
                    node {
                      id
                      name
                      school {
                        id
                        name
                      }
                      user {
                        name
                        cover {
                          path
                        }
                      }
                      notifications {
                        id
                        type
                        read_at
                        data {
                          id
                          message
                          start_at
                          finish_at
                          type
                          name
                          definition
                        }
                      }
                    }
                  }
                  pageInfo {
                    ...CorePageInfoField
                  }
                }
              }
            `}
            SkeletonComponent={ClassroomCardSkeleton}
            perPage={10}
            variables={{ user_id: user?.id }}
          />
        )}
      </div>
    </DashboardContainer>
  );
}
