import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Announcement } from "../../types/type";

export default function Announcements() {
  return (
    <DashboardContainer admin title="Pengumuman">
      <Loader<Announcement>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="announcements"
        query={gql`
          ${CorePageInfoField}
          query GetAnnouncements(
            $first: Int!
            $after: String
            $name: String
            # $type: String
            $roles: String
          ) {
            announcements(
              first: $first
              after: $after
              name: $name
              # type: $type
              roles: $roles
            ) {
              edges {
                node {
                  id
                  name
                  type
                  roles
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
            label: "Tipe",
            name: "type",
            type: "text",
          },
          {
            label: "Roles",
            name: "roles",
            type: "text",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteAnnouncement($id: ID!) {
            deleteAnnouncement(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateAnnouncement(
            $id: ID!
            $name: String
            $type: String
            $roles: String
          ) {
            updateAnnouncement(
              id: $id
              input: { name: $name, type: $type, roles: $roles }
            ) {
              id
            }
          }
        `}
        editFields="updateAnnouncement"
      />
    </DashboardContainer>
  );
}
