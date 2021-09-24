import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";
import { toast } from "react-toastify";
import Loader from "../../components/BoxLoader";
import NotificationCard, {
  NotificationCardSkeleton,
} from "../../components/Card/NotificationCard";
import AppContainer from "../../components/Container/AppContainer";
import DashboardContainer from "../../components/Container/DashboardContainer";
import { CorePageInfoField } from "../../fragments/fragments";
import { GenericOutput, Notification } from "../../types/type";

export default function Notifications() {
  const { data, loading, error, refetch } = useQuery<{
    notifications: Notification[];
  }>(gql`
    query GetMeNotifications {
      notifications {
        id
        type
        read_at
        data {
          id
          message
          start_at
          finish_at
          type
          name
          definition
        }
      }
    }
  `);

  const [markRead] = useMutation<{ markReadAll: GenericOutput }>(gql`
    mutation MarkReadAll {
      markReadAll {
        status
        message
      }
    }
  `);

  useEffect(() => {
    if (data?.notifications) {
      markRead().then((e) => {
        if (!e.data?.markReadAll?.status) {
          toast.error("Gagal menulis sudah dibaca");
        } else {
          refetch();
        }
      });
    }
  }, [data, markRead, refetch]);

  return (
    <AppContainer>
      <DashboardContainer>
        <Tabs>
          <TabList>
            <Tab>Notifikasi</Tab>
            <Tab>Acara Kelas</Tab>
            <Tab>Tanggal</Tab>
          </TabList>
          <TabPanel>
            <div className="shadow rounded p-4">
              <div className="flex flex-col gap-2">
                {!loading && !error && data?.notifications
                  ? data?.notifications.map((e) => (
                      <NotificationCard key={e.id} {...e} />
                    ))
                  : [...Array(10)].map((e, i) => (
                      <NotificationCardSkeleton key={i} />
                    ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="shadow rounded p-4"></div>
          </TabPanel>
          <TabPanel>
            <div className="shadow rounded p-4"></div>
          </TabPanel>
        </Tabs>
      </DashboardContainer>
    </AppContainer>
  );
}
