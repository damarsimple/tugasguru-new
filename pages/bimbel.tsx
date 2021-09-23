import { gql } from "@apollo/client";
import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import Loader from "../components/BoxLoader";
import QuizCard, { QuizCardSkeleton } from "../components/Card/QuizCard";
import UserCard, { UserCardSkeleton } from "../components/Card/UserCard";
import AppContainer from "../components/Container/AppContainer";
import SearchBox from "../components/SearchBox";
import Select from "../components/Select";
import SelectLoader from "../components/SelectLoader";
import {
  CorePageInfoField,
  CoreUserInfoMinimalField,
} from "../fragments/fragments";
import { wildCardFormatter } from "../helpers/formatter";
import { User } from "../types/type";

export default function Bimbel() {
  const [name, setName] = useState("");

  const [selectedProvince, setSelectedProvince] = useState<undefined | string>(
    undefined
  );
  const [selectedCity, setSelectedCity] = useState<undefined | string>(
    undefined
  );
  const [selectedDistrict, setSelectedDistrict] = useState<undefined | string>(
    undefined
  );

  return (
    <AppContainer>
      <div className="p-4">
        <SearchBox onChange={setName} placeholder="Cari nama guru bimbel" />
      </div>
      <div className="grid grid-cols-3 p-4 gap-2">
        <SelectLoader
          onChange={setSelectedProvince}
          label={"Provinsi"}
          fields="provinces"
          fetchPolicy="network-only"
          query={gql`
            ${CorePageInfoField}
            query GetProvinces($first: Int!, $after: String, $name: String) {
              provinces(first: $first, after: $after, name: $name) {
                pageInfo {
                  ...CorePageInfoField
                }
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          `}
        />
        {selectedProvince && (
          <SelectLoader
            onChange={setSelectedCity}
            label={"Kota"}
            fields="cities"
            fetchPolicy="network-only"
            variables={{ province_id: selectedProvince }}
            query={gql`
              ${CorePageInfoField}
              query GetCities(
                $first: Int!
                $after: String
                $name: String
                $province_id: ID
              ) {
                cities(
                  first: $first
                  after: $after
                  name: $name
                  province_id: $province_id
                ) {
                  pageInfo {
                    ...CorePageInfoField
                  }
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            `}
          />
        )}
        {selectedCity && (
          <SelectLoader
            onChange={setSelectedDistrict}
            label={"Kecamatan"}
            fields="districts"
            fetchPolicy="network-only"
            variables={{ city_id: selectedProvince }}
            query={gql`
              ${CorePageInfoField}
              query GetDistricts(
                $first: Int!
                $after: String
                $name: String
                $city_id: ID
              ) {
                districts(
                  first: $first
                  after: $after
                  name: $name
                  city_id: $city_id
                ) {
                  pageInfo {
                    ...CorePageInfoField
                  }
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            `}
          />
        )}
      </div>
      <Loader<User>
        query={gql`
          ${CorePageInfoField}
          ${CoreUserInfoMinimalField}
          query GetUsers(
            $first: Int!
            $after: String
            $name: String
            $province_id: ID
            $city_id: ID
            $district_id: ID
          ) {
            users(
              first: $first
              after: $after
              name: $name
              province_id: $province_id
              city_id: $city_id
              district_id: $district_id
              is_bimbel: true
              is_bimbel_active: true
            ) {
              edges {
                node {
                  ...CoreUserInfoMinimalField
                }
              }
              pageInfo {
                ...CorePageInfoField
              }
            }
          }
        `}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-10"
        perPage={20}
        fields={"users"}
        fetchPolicy="network-only"
        variables={{
          name: wildCardFormatter(name),
          city_id: selectedCity,
          province_id: selectedProvince,
          district_id: selectedDistrict,
        }}
        Component={UserCard}
        SkeletonComponent={UserCardSkeleton}
      />
    </AppContainer>
  );
}
