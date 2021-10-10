import gql from "graphql-tag";
import { WithRouterProps } from "next/dist/client/with-router";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Loader from "../../../components/BoxLoader";
import PackageQuestionCard from "../../../components/Card/PackageQuestionCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import QuestionEditor from "../../../components/QuestionEditor";
import { CorePageInfoField } from "../../../fragments/fragments";
import { Packagequestion } from "../../../types/type";

export default function Questions({ router }: WithRouterProps) {
  return (
    <DashboardContainer>
      <Tabs
        defaultIndex={
          router?.query?.index ? parseInt(router.query.index as string) : 0
        }
      >
        <TabList>
          <Tab>Editor Soal</Tab>
          <Tab>Preview Soal</Tab>
          <Tab>Bank Soal</Tab>
        </TabList>
        <TabPanel>
          <QuestionEditor />
        </TabPanel>
        <TabPanel>
          <Loader<Packagequestion>
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-3"
            query={gql`
              ${CorePageInfoField}
              query GetPackagequestions($first: Int!, $after: String) {
                packagequestions(first: $first, after: $after) {
                  edges {
                    node {
                      id
                      name
                      questionsCount
                      classtype {
                        level
                      }
                      subject {
                        name
                      }
                      user {
                        name
                      }
                      questions {
                        id
                        metadata {
                          content
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
            perPage={10}
            fetchPolicy="network-only"
            fields={"packagequestions"}
            Component={PackageQuestionCard}
            // SkeletonComponent={QuestionCard}
          />
        </TabPanel>
        <TabPanel></TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}
