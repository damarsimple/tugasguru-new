import { gql } from "@apollo/client";
import React from "react";
import Loader from "../components/BoxLoader";
import AccessCard, { AccessCardSkeleton } from "../components/Card/AccessCard";
import AppContainer from "../components/Container/AppContainer";
import { CorePageInfoField } from "../fragments/fragments";
import { Access, Roles } from "../types/type";

export default function Shop() {
  return (
    <AppContainer>
      <div className="mt-16 p-10 flex flex-col gap-3">
        <h1 className="font-bold text-lg text-primary-base">
          Beli Langganan untuk mengakses konten
        </h1>
        <Loader<Access>
          className="grid grid-cols-3 gap-3"
          query={gql`
            ${CorePageInfoField}
            query GetAcceses($first: Int!, $after: String, $roles: Roles) {
              acceses(first: $first, after: $after, roles: $roles) {
                edges {
                  node {
                    name
                    description
                    price
                    ability
                  }
                }
                pageInfo {
                  ...CorePageInfoField
                }
              }
            }
          `}
          variables={{ roles: Roles.General }}
          perPage={3}
          fetchPolicy="network-only"
          fields={"acceses"}
          Component={AccessCard}
          SkeletonComponent={AccessCardSkeleton}
        />
        <h1 className="font-bold text-lg text-primary-base">
          Beli Langganan untuk mengakses konten
        </h1>
        <Loader<Access>
          className="grid grid-cols-3 gap-3"
          query={gql`
            ${CorePageInfoField}
            query GetCourses($first: Int!, $after: String) {
              courses(first: $first, after: $after) {
                edges {
                  node {
                    name
                  }
                }
                pageInfo {
                  ...CorePageInfoField
                }
              }
            }
          `}
          perPage={20}
          fetchPolicy="network-only"
          fields={"courses"}
          Component={AccessCard}
          SkeletonComponent={AccessCardSkeleton}
        />
      </div>
    </AppContainer>
  );
}
