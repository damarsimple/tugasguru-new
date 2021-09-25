import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";

import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Agenda } from "../../types/type";

export default function Agendas() {
  return (
    <DashboardContainer admin title="Agenda">
      <Loader<Agenda>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="agendas"
        query={gql`
          ${CorePageInfoField}
          query GetAgendas(
            $first: Int!
            $after: String
            $uuid: String
            $finish_at: DateTime
          ) {
            agendas(
              first: $first
              after: $after
              uuid: $uuid
              finish_at: $finish_at
            ) {
              edges {
                node {
                  id
                  uuid
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
            label: "UUID",
            name: "uuid",
            type: "text",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteAgenda($id: ID!) {
            deleteAgenda(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateAgenda($id: ID!, $uuid: String) {
            updateAgenda(id: $id, input: { id: $id, uuid: $uuid }) {
              id
            }
          }
        `}
        editFields="updateAgenda"
      />
    </DashboardContainer>
  );
}
