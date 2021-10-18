import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";
import Button from "../../../components/Button";
import BaseCard from "../../../components/Card/BaseCard";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import Select from "../../../components/Select";
import { User } from "../../../types/type";

export default function Admin() {
  const [school, setSchool] = useState<undefined | string>(undefined);

  const { data, loading } = useQuery<{ me: User }>(gql`
    query Schools {
      me {
        schools {
          id
          name
          classrooms {
            id
            name
          }
        }
      }
    }
  `);

  return (
    <DashboardContainer>
      <Select
        attributes={
          data?.me?.schools?.map((e) => {
            return { label: e.name, value: e.id };
          }) ?? []
        }
        label={"Sekolah"}
        loading={loading}
        onChange={setSchool}
      />
      {school && (
        <Tabs>
          <TabList>
            <Tab>Sekolah</Tab>
            <Tab>PPDB</Tab>
          </TabList>
          <TabPanel>
            {data?.me.schools?.map((e) => (
              <BaseCard key={e.id} name={e.name} />
            ))}
          </TabPanel>
          <TabPanel>
            <Button href="/dashboard/ppdbs">BUKA PPDB</Button>
          </TabPanel>
        </Tabs>
      )}
    </DashboardContainer>
  );
}
