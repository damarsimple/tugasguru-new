import gql from "graphql-tag";
import React from "react";
import Loader from "../../components/BoxLoader";
import UserCard, { UserCardSkeleton } from "../../components/Card/UserCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import FormModal from "../../components/FormModal";
import { CorePageInfoField } from "../../fragments/fragments";
import {
  selectExtractor,
  selectObjectExtractor,
} from "../../helpers/formatter";
import usePlaces from "../../hooks/usePlaces";
import { Roles } from "../../types/type";

export default function Users() {
  const { cities, provinces, districts, setCityId, setProvinceId } = usePlaces(
    {}
  );
  return (
    <DashboardContainer admin title="Admin">
      <FormModal
        onValueChange={(name, value) => {
          switch (name) {
            case "city_id":
              setCityId(value as string);
              break;
            case "province_id":
              setProvinceId(value as string);
              break;
            default:
              break;
          }
        }}
        fields="createUser"
        editAttributes={[
          {
            label: "Nama",
            name: "name",
            required: true,
          },
          {
            label: "Username",
            name: "username",
            required: true,
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            required: true,
          },

          {
            label: "Password",
            name: "password",
            type: "password",
            required: true,
          },

          {
            label: "Nomor Telepon",
            name: "phone",
            required: true,
          },
          {
            label: "Alamat",
            name: "address",
            required: true,
          },
          {
            label: "NISN",
            name: "nisn",
          },
          {
            label: "Provinsi",
            name: "province_id",
            type: "select",
            values: provinces.map(selectExtractor),
          },
          {
            label: "Kota / Kabupaten",
            name: "city_id",
            type: "select",
            values: cities.map(selectExtractor),
          },
          {
            label: "Kecamatan / Kelurahan",
            name: "district_id",
            type: "select",
            values: districts.map(selectExtractor),
          },
          {
            label: "Roles",
            name: "roles",
            type: "select",
            values: selectObjectExtractor(Roles),
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
          {
            label: "Admin",
            name: "is_admin",
            type: "checkbox",
          },
        ]}
        mutationQuery={gql`
          mutation CreateUser(
            $name: String!
            $username: String!
            $email: String!
            $password: String!
            $gender: String
            $province_id: ID!
            $city_id: ID!
            $district_id: ID!
            $phone: String!
            $roles: String!
          ) {
            createUser(
              input: {
                name: $name
                username: $username
                email: $email
                password: $password
                gender: $gender
                province_id: $province_id
                city_id: $city_id
                district_id: $district_id
                phone: $phone
                roles: $roles
              }
            ) {
              id
              name
            }
          }
        `}
      />
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
            $roles: Roles
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
              roles: $roles
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
          {
            label: "Roles",
            name: "roles",
            type: "select",
            values: selectObjectExtractor(Roles),
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
