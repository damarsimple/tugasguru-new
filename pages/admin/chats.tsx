import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Chat } from "../../types/type";

export default function Chats() {
  return (
    <DashboardContainer admin title="Chats">
      <Loader<Chat>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={({ metadata }) => (
          <BaseCard name={metadata?.content.toString() ?? ""} />
        )}
        fields="chats"
        query={gql`
          ${CorePageInfoField}
          query GetChats($first: Int!, $after: String) {
            chats(first: $first, after: $after) {
              edges {
                node {
                  id
                  metadata {
                    content
                  }
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
          mutation DeleteChat($id: ID!) {
            deleteChat(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateChat($id: ID!) {
            updateChat(id: $id, input: { id: $id }) {
              id
            }
          }
        `}
        editFields="updateChat"
      />
    </DashboardContainer>
  );
}
