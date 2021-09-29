import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import BaseCard, { BaseCardSkeleton } from "../../components/Card/BaseCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { Course } from "../../types/type";

export default function Courses() {
  return (
    <DashboardContainer admin title="Konten">
      <Loader<Course>
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        withSearchbar
        Component={BaseCard}
        fields="courses"
        query={gql`
          ${CorePageInfoField}
          query GetCourses(
            $first: Int!
            $after: String
            $name: String
            $views: Int
          ) {
            courses(first: $first, after: $after, name: $name, views: $views) {
              edges {
                node {
                  id
                  name
                  views
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
            label: "Dilihat",
            name: "views",
            type: "number",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteCourse($id: ID!) {
            deleteCourse(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateCourse($id: ID!, $name: String, $views: Int) {
            updateCourse(id: $id, input: { name: $name, views: $views }) {
              id
            }
          }
        `}
        editFields="updateCourse"
      />
    </DashboardContainer>
  );
}
