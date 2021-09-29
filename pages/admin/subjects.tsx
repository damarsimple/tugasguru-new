import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { selectObjectExtractor } from "../../helpers/formatter";
import { Subject, SubjectType } from "../../types/type";

export default function Subjects() {
  return (
    <DashboardContainer admin title="Mata Pelajaran">
      <Loader<Subject>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="subjects"
        query={gql`
          ${CorePageInfoField}
          query GetSubjects(
            $first: Int!
            $after: String
            $name: String
            $type: SubjectType
          ) {
            subjects(first: $first, after: $after, name: $name, type: $type) {
              edges {
                node {
                  id
                  name
                  abbreviation
                  description
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
            label: "Singkatan",
            name: "abbreviation",
            type: "text",
          },
          {
            label: "Deksripsi",
            name: "description",
            type: "text",
          },
          {
            label: "Tipe",
            name: "type",
            type: "select",
            values: selectObjectExtractor(SubjectType),
          },
        ]}
        deleteQuery={gql`
          mutation DeleteSubject($id: ID!) {
            deleteSubject(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateSubject(
            $id: ID!
            $name: String
            $abbreviation: String
            $description: String
            $type: SubjectType
          ) {
            updateSubject(
              id: $id
              input: {
                name: $name
                abbreviation: $abbreviation
                description: $description
                type: $type
              }
            ) {
              id
            }
          }
        `}
        editFields="updateSubject"
      />
    </DashboardContainer>
  );
}
