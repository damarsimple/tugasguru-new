import gql from "graphql-tag";
import Link from "next/link";
import React, { useState } from "react";
import Loader from "../../components/BoxLoader";
import AnnouncementCard, {
  SkeletonAnnouncementCard,
} from "../../components/Card/AnnouncementCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import ImageContainer from "../../components/Container/ImageContainer";
import SelectLoader from "../../components/SelectLoader";
import { CorePageInfoField } from "../../fragments/fragments";
import { useUserStore } from "../../store/user";
import { Announcement } from "../../types/type";

export default function Announcements() {
  const [roles, setRoles] = useState("GENERAL");
  const [schoolId, setSchoolId] = useState<string | undefined>(undefined);
  const { user } = useUserStore();
  return (
    <DashboardContainer title="Pengumuman">
      <div>
        {user?.roles == "TEACHER" && (
          <SelectLoader
            label="Sekolah"
            fields={"me.schools"}
            query={gql`
              query {
                me {
                  schools {
                    id
                    name
                  }
                }
              }
            `}
            onChange={setSchoolId}
          />
        )}
        <Loader<Announcement>
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          query={gql`
            ${CorePageInfoField}
            query GetAnnouncements(
              $first: Int!
              $after: String
              $roles: String
              $school_id: String
            ) {
              announcements(
                first: $first
                after: $after
                roles: $roles
                school_id: $school_id
              ) {
                edges {
                  node {
                    id
                    name
                    cover {
                      path
                    }
                    user {
                      id
                      name
                      cover {
                        path
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
          perPage={5}
          fields={"announcements"}
          fetchPolicy="network-only"
          Component={AnnouncementCard}
          SkeletonComponent={SkeletonAnnouncementCard}
          variables={{
            roles,
            school_id: schoolId,
          }}
        />
      </div>
    </DashboardContainer>
  );
}
