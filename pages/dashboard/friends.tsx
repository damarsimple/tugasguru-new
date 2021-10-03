import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import FollowCard from "../../components/Card/FollowCard";
import DashboardContainer from "../../components/Container/DashboardContainer";
import ImageContainer from "../../components/Container/ImageContainer";
import { CoreUserInfoMinimalField } from "../../fragments/fragments";
import { User } from "../../types/type";

export default function Friends() {
  const { data: { me } = {}, refetch } = useQuery<{ me: User }>(
    gql`
      ${CoreUserInfoMinimalField}
      query GetMeFollowers {
        me {
          id
          followers {
            ...CoreUserInfoMinimalField
          }
          reqfollowers {
            ...CoreUserInfoMinimalField
          }
          followings {
            ...CoreUserInfoMinimalField
          }
          reqfollowings {
            ...CoreUserInfoMinimalField
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only",
    }
  );

  const [handleMutation, { loading }] = useMutation(
    gql`
      mutation HandleFollow(
        $accept_followers: [ID!]
        $decline_followers: [ID!]
        $remove_followers: [ID!]
        $remove_following: [ID!]
        $cancel_following: [ID!]
      ) {
        handleFollow(
          accept_followers: $accept_followers
          decline_followers: $decline_followers
          remove_followers: $remove_followers
          remove_following: $remove_following
          cancel_following: $cancel_following
        ) {
          status
          message
        }
      }
    `
  );

  const handleError = (e: string) => toast.error(e);
  const handleAfter = () => {
    toast.success("Berhasil mengirim permintaan");
    refetch();
  };
  const handleAccept = (e: string[]) => {
    handleMutation({
      variables: {
        accept_followers: e,
      },
    })
      .then(handleAfter)
      .catch(handleError);
  };

  const handleDecline = (e: string[]) => {
    handleMutation({
      variables: {
        decline_followers: e,
      },
    })
      .then(handleAfter)
      .catch(handleError);
  };

  const handleRemove = (e: string[]) => {
    handleMutation({
      variables: {
        remove_followers: e,
      },
    })
      .then(handleAfter)
      .catch(handleError);
  };

  const handleCancelFollopwingRequest = (e: string[]) => {
    handleMutation({
      variables: {
        cancel_following: e,
      },
    })
      .then(handleAfter)
      .catch(handleError);
  };

  const handleCancelFollowing = (e: string[]) => {
    handleMutation({
      variables: {
        remove_following: e,
      },
    })
      .then(handleAfter)
      .catch(handleError);
  };

  return (
    <DashboardContainer>
      <div>
        <Tabs>
          <TabList>
            <Tab>Permintaan Pengikut</Tab>
            <Tab>Pengikut Saya</Tab>
            <Tab>Permintaan Ikuti</Tab>
            <Tab>Diikuti</Tab>
          </TabList>
          <TabPanel>
            <div className="flex flex-col gap-2 my-2">
              <Button
                loading={loading}
                onClick={() =>
                  me?.reqfollowers &&
                  handleAccept(me.reqfollowers.map((e) => e.id))
                }
              >
                Terima Semua Permintaan
              </Button>
              <Button loading={loading} color="RED">
                Tolak Semua Permintaan
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {me?.reqfollowers?.map((e) => {
                return (
                  <FollowCard user={e} key={e.id}>
                    <div className="flex gap-1">
                      <Button
                        loading={loading}
                        onClick={() => handleAccept([e.id])}
                      >
                        Terima{" "}
                      </Button>{" "}
                      <Button
                        loading={loading}
                        onClick={() => handleDecline([e.id])}
                        color="RED"
                      >
                        Tolak
                      </Button>
                    </div>
                  </FollowCard>
                );
              })}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="flex flex-col gap-2 my-2"></div>
            <div className="flex flex-col gap-2">
              {me?.followers?.map((e) => {
                return (
                  <FollowCard user={e} key={e.id}>
                    <div className="flex gap-1">
                      <Button
                        loading={loading}
                        onClick={() => handleRemove([e.id])}
                      >
                        Hapus Pengikut
                      </Button>
                    </div>
                  </FollowCard>
                );
              })}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="flex flex-col gap-2 my-2"></div>
            <div className="flex flex-col gap-2">
              {me?.reqfollowings?.map((e) => {
                return (
                  <FollowCard user={e} key={e.id}>
                    <div className="flex gap-1">
                      <Button
                        loading={loading}
                        onClick={() => handleCancelFollopwingRequest([e.id])}
                      >
                        Batalkan Permintaan
                      </Button>
                    </div>
                  </FollowCard>
                );
              })}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="flex flex-col gap-2 my-2"></div>
            <div className="flex flex-col gap-2">
              {me?.followings?.map((e) => {
                return (
                  <FollowCard user={e} key={e.id}>
                    <div className="flex gap-1">
                      <Button
                        loading={loading}
                        onClick={() => handleCancelFollowing([e.id])}
                      >
                        Batal Ikuti
                      </Button>
                    </div>
                  </FollowCard>
                );
              })}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </DashboardContainer>
  );
}
