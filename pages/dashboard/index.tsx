import gql from "graphql-tag";
import Link from "next/link";
import React from "react";
import Loader from "../../components/BoxLoader";
import Button from "../../components/Button";
import QuizCard, { QuizCardSkeleton } from "../../components/Card/QuizCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import {
  CorePageInfoField,
  CoreQuizCardMinimalField,
} from "../../fragments/fragments";
import { Subject } from "../../types/type";

export default function Index() {
  return (
    <DashboardContainer>
      <Loader<Subject>
        query={gql`
          ${CorePageInfoField}
          ${CoreQuizCardMinimalField}
          query GetSubjects($first: Int!, $after: String) {
            subjects(first: $first, after: $after) {
              edges {
                node {
                  id
                  name
                  quizzez(first: 4) {
                    edges {
                      node {
                        ...CoreQuizCardMinimalField
                      }
                    }
                  }
                }
              }
              pageInfo {
                ...CorePageInfoField
              }
            }
          }
        `}
        perPage={5}
        fields={"subjects"}
        Component={(e) => (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Quiz {e.name}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
              {e.quizzez?.edges?.map(({ node }) => (
                <QuizCard {...node} key={node.id} />
              ))}
            </div>
          </div>
        )}
        SkeletonComponent={() => (
          <div className="mt-4">
            <h1 className="bg-gray-100 rounded animate-pulse"></h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((e, i) => (
                <QuizCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}
      />
    </DashboardContainer>
  );
}
