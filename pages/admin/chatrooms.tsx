import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";

import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Chatroom } from "../../types/type";

export default function Chatrooms() {
  return (
    <DashboardContainer admin title="Ruang Chat">
      <Loader<Chatroom>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={({ id }) => <BaseCard name={id} />}
        fields="chatrooms"
        query={gql`
          ${CorePageInfoField}
          query GetChatrooms($first: Int!, $after: String) {
            chatrooms(first: $first, after: $after) {
              edges {
                node {
                  id
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
        editAttributes={[]}
        deleteQuery={gql`
          mutation DeleteChatroom($id: ID!) {
            deleteChatroom(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateChatroom($id: ID!) {
            updateChatroom(id: $id, input: { id: $id }) {
              id
            }
          }
        `}
        editFields="updateChatroom"
      />
    </DashboardContainer>
  );
}
