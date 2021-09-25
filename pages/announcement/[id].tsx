import { gql, useQuery } from "@apollo/client";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import Button from "../../components/Button";
import AppContainer from "../../components/Container/AppContainer";
import DashboardContainer from "../../components/Container/DashboardContainer";
import ImageContainer from "../../components/Container/ImageContainer";
import EditModal from "../../components/EditModal";
import { useUserStore } from "../../store/user";
import { Announcement } from "../../types/type";

function Id({ router }: { router: NextRouter }) {
  const { id } = router.query;

  const { data, loading, error } = useQuery<{ announcement: Announcement }>(
    gql`
      query GetAnnouncement($id: ID!) {
        announcement(id: $id) {
          id
          name
          user {
            id
            name
            cover {
              path
            }
          }
        }
      }
    `,
    {
      variables: { id },
    }
  );

  const { user: authUser } = useUserStore();

  if (loading) return <></>;

  const { name, cover, user, metadata } = data?.announcement || {};

  return (
    <DashboardContainer>
      <EditModal />
      <div className="container mx-auto shadow rounded p-4">
        <div className="flex justify-end gap-2">
          <Button color="YELLOW">
            <BiPencil />
          </Button>
          <Button color="RED">
            <BiTrash />
          </Button>
        </div>
        <h1 className="text-md justify-between font-bold m-3 text-center text-lg text-primary-base">
          {name}
        </h1>
        <ImageContainer src={cover?.path} fallback="quiz" className="w-full" />
        <a>
          <div className="m-3 flex items-center py-2 gap-2">
            <ImageContainer
              className="w-6 h-6 rounded-full"
              src={user?.cover?.path}
              fallback="profile"
            />
            <p className="text-gray-900 leading-none text-sm">{user?.name}</p>
          </div>
        </a>
        <div>{metadata?.content}</div>
      </div>
    </DashboardContainer>
  );
}

export default withRouter(Id);
