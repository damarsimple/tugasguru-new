import { gql, useMutation } from "@apollo/client";
import React from "react";
import { BsPlusSquare } from "react-icons/bs";
import { toast } from "react-toastify";
import { CoreGenericOutput } from "../../fragments/fragments";
import { GenericOutput, Quizsession, User } from "../../types/type";
import Button from "../Button";
import ImageContainer from "../Container/ImageContainer";

const INVITE_QUIZSESSION = gql`
  ${CoreGenericOutput}
  mutation InviteQuizsession($quizsession_id: ID!, $user_id: ID!) {
    inviteQuizsession(
      input: { quizsession_id: $quizsession_id, user_id: $user_id }
    ) {
      ...CoreGenericOutput
    }
  }
`;

export default function QuizInvitationCard({
  user,
  quizsession,
}: {
  user: User;
  quizsession: Quizsession;
}) {
  const [inviteQuizsession] =
    useMutation<{ inviteQuizsession: GenericOutput }>(INVITE_QUIZSESSION);

  const handleInvite = () =>
    inviteQuizsession({
      variables: {
        quizsession_id: quizsession.id,
        user_id: user.id,
      },
    })
      .then((e) =>
        e.data?.inviteQuizsession?.status
          ? toast.success("Berhasil mengundang " + user.name)
          : toast.error(
              "Error mengundang " + e.data?.inviteQuizsession?.message
            )
      )
      .catch((e) => toast.error("error"));

  return (
    <div className="grid grid-cols-5 bg-gray-900 p-4 shadow rounded">
      <div className="col-span-1">
        <ImageContainer
          className="rounded-full"
          fallback="profile"
          src={user.cover?.path}
          height={50}
          width={50}
        />
      </div>
      <div className="col-span-3 ">
        <h1 className="text-white uppercase text-lg font-bold">{user.name}</h1>
        <p className=" text-white uppercase text-md font-semibold">
          {user.roles}
        </p>
      </div>
      <div className="col-span-1">
        <Button onClick={handleInvite}>
          <BsPlusSquare color="white" size="2em" />
        </Button>
      </div>
    </div>
  );
}
