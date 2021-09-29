import gql from "graphql-tag";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Loader from "../../../components/BoxLoader";
import PackageQuestionCard from "../../../components/Card/PackageQuestionCard";
import QuestionCard from "../../../components/Card/QuestionCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import QuestionEditor from "../../../components/QuestionEditor";
import {
  CorePageInfoField,
  CoreQuestionPlayField,
} from "../../../fragments/fragments";
import { Packagequestion } from "../../../types/type";

export default function Questions() {
  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Editor Soal</Tab>
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
      </Tabs>
    </DashboardContainer>
  );
}
