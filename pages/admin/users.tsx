import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import UserCard, { UserCardSkeleton } from "../../components/Card/UserCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";

export default function Users() {
  return (
    <DashboardContainer admin title="Admin">
      <Loader
        className="grid grid-cols-3 gap-3"
        fetchPolicy="network-only"
        withEditDelete
        Component={UserCard}
        fields="users"
        query={gql`
          ${CorePageInfoField}
          query GetUsers(
            $first: Int!
            $after: String
            $name: String
            $province_id: ID
            $city_id: ID
            $district_id: ID
            $is_bimbel: Boolean
            $is_bimbel_active: Boolean
          ) {
            users(
              first: $first
              after: $after
              name: $name
              province_id: $province_id
              city_id: $city_id
              district_id: $district_id
              is_bimbel: $is_bimbel
              is_bimbel_active: $is_bimbel_active
            ) {
              edges {
                node {
                  id
                  name
                  username
                  roles
                  school {
                    name
                  }
                  cover {
                    path
                  }
                  email
                  is_admin
                  phone
                  address
                  nisn
                  is_bimbel
                  is_bimbel_active
                }
              }
              pageInfo {
                ...CorePageInfoField
              }
            }
          }
        `}
        SkeletonComponent={UserCardSkeleton}
        perPage={10}
        variables={{}}
        editAttributes={[
          {
            label: "Nama",
            name: "name",
          },
          {
            label: "Email",
            name: "email",
            type: "email",
          },
          {
            label: "Admin",
            name: "is_admin",
            type: "checkbox",
          },
          {
            label: "Nomor Telepon",
            name: "phone",
          },
          {
            label: "Alamat",
            name: "address",
          },
          {
            label: "NISN",
            name: "nisn",
          },
          {
            label: "Bimbel",
            name: "is_bimbel",
            type: "checkbox",
          },
          {
            label: "Bimbel Aktif",
            name: "is_bimbel_active",
            type: "checkbox",
          },
        ]}
        deleteQuery={gql`
          mutation DeleteUser($id: ID!) {
            deleteUser(id: $id) {
              id
            }
          }
        `}
        editQuery={gql`
          mutation UpdateUser(
            $id: ID!
            $name: String
            $roles: Roles
            $email: String
            $is_admin: Boolean
            $is_bimbel: Boolean
            $is_bimbel_active: Boolean
            $nisn: String
            $phone: String
            $address: String
          ) {
            updateUser(
              id: $id
              input: {
                name: $name
                email: $email
                roles: $roles
                is_admin: $is_admin
                is_bimbel: $is_bimbel
                is_bimbel_active: $is_bimbel_active
                nisn: $nisn
                phone: $phone
                address: $address
              }
            ) {
              id
            }
          }
        `}
        editFields="editUser"
      />
    </DashboardContainer>
  );
}
