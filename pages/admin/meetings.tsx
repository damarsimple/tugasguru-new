import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Meeting } from "../../types/type";

export default function Meetings() {
  return (
    <DashboardContainer admin title="Pertemuan">
      <Loader<Meeting>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="meetings"
        query={gql`
          ${CorePageInfoField}
          query GetMeetings(
            $first: Int!
            $after: String
            $name: String
            $finish_at: DateTime
            $open_at: DateTime
          ) {
            meetings(
              first: $first
              after: $after
              name: $name
              finish_at: $finish_at
              open_at: $open_at
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
          mutation DeleteMeeting($id: ID!) {
            deleteMeeting(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateMeeting($id: ID!, $name: String) {
            updateMeeting(id: $id, input: { name: $name }) {
              id
            }
          }
        `}
        editFields="updateMeeting"
      />
    </DashboardContainer>
  );
}
