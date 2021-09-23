import { gql, useQuery } from "@apollo/client";
import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React, { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiCart, BiPlus } from "react-icons/bi";
import { BsPlay } from "react-icons/bs";
import { FaEllipsisH, FaGraduationCap, FaHome } from "react-icons/fa";
import { MdClose, MdPlace, MdShare } from "react-icons/md";
import { RiChatFollowUpFill } from "react-icons/ri";
import Loader from "../components/BoxLoader";
import Button from "../components/Button";
import QuizCard, { QuizCardSkeleton } from "../components/Card/QuizCard";
import AppContainer from "../components/Container/AppContainer";
import ImageContainer from "../components/Container/ImageContainer";
import Form from "../components/Forms/Form";
import Modal from "../components/Modal";
import SkeletonGrid from "../components/SkeletonGrid";
import {
  CorePageInfoField,
  CoreQuizCardMinimalField,
} from "../fragments/fragments";
import { User, Quiz, Tutoring } from "../types/type";

function Username({ router }: { router: NextRouter }) {
  const { username } = router.query;

  const {
    data: { userFind } = {},
    loading,
    error,
  } = useQuery<{ userFind: User }>(
    gql`
      query FindUser($username: String) {
        userFind(username: $username) {
          id
          name
          username
          roles
          is_bimbel
          is_bimbel_active
          cover {
            path
          }
          followers {
            id
            name
            cover {
              path
            }
          }
          metadata {
            degree
          }
          city {
            name
          }
          province {
            name
          }
        }
      }
    `,
    {
      variables: {
        username,
      },
    }
  );

  const [showModal, setShowModal] = useState(false);
  const [geolocation, setGeolocation] = useState<
    GeolocationCoordinates | undefined
  >(undefined);
  const flip = () => setShowModal(!showModal);

  useEffect(() => {
    if (showModal && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((e) => {
        setGeolocation(e.coords);
      });
    }
  }, [showModal]);

  useEffect(() => {
    console.log(geolocation);
  }, [geolocation]);

  return (
    <AppContainer title={username as string}>
      <Modal open={showModal} flip={flip}>
        <div className="justify-end top-0 right-0 flex m-6 gap-2 ">
          <Button color="BLUE">
            <MdShare color="white" size="1.5em" />
          </Button>
          <Button color="RED" onClick={flip}>
            <MdClose color="white" size="1.5em" />
          </Button>
        </div>
        <div className="p-4">
          <Form<Tutoring, { createTutoring: Tutoring }>
            submitName="AJUKAN"
            successMessage="Berhasil mengajukan permintaan bimbel"
            fields="createTutoring"
            attributes={[
              {
                label: "Mulai Dari",
                name: "start_at",
                type: "date",
                required: true,
              },
              {
                label: "Sampai",
                name: "finish_at",
                type: "date",
                required: true,
              },
              {
                label: "Alamat anda",
                name: "metadata.address",
                required: true,
              },
              {
                label: "Alamat anda",
                name: "metadata.geolocation",
                type: "hidden",
              },
            ]}
            mutationQuery={gql`
              mutation UpdateUser(
                $id: ID!
                $username: String
                $name: String
                $phone: String
                $address: String
                $metadata: String
              ) {
                updateUser(
                  id: $id
                  input: {
                    name: $name
                    username: $username
                    phone: $phone
                    address: $address
                    metadata: $metadata
                  }
                ) {
                  name
                  username
                  phone
                  address
                  metadata {
                    degree
                    specialty
                    description_bimbel
                  }
                }
              }
            `}
            defaultValueMap={{
              metadata: {
                address: "",
                geolocation: JSON.stringify(geolocation),
              },
            }}
          />
        </div>
      </Modal>

      <div className="grid grid-cols-6 mt-24 gap-3 m-6">
        <div className="col-span-6 md:col-span-2 lg:col-span-1 shadow rounded">
          <div className="flex justify-center">
            <div className="w-full bg-white p-10">
              <div className="mt-12">
                <div className="flex justify-center rounded-full">
                  <ImageContainer
                    fallback="profile"
                    className="w-32 rounded-full"
                    src={userFind?.cover?.path}
                  />
                </div>
              </div>
              <div className="mt-2 text-lg text-center">
                <p>
                  {userFind ? (
                    <span className="font-bold">{userFind?.name}</span>
                  ) : (
                    <span className="bg-gray-100 rounded animate-pulse"></span>
                  )}
                </p>
                {userFind ? (
                  <p>@{userFind?.username}</p>
                ) : (
                  <p className="h-6 bg-gray-100 rounded animate-pulse"></p>
                )}
              </div>
              <div className="mt-2 flex justify-center text-lg">
                {userFind ? (
                  <p className="text-center w-5/6">{userFind?.roles}</p>
                ) : (
                  <p className="h-6 bg-gray-100 rounded animate-pulse"></p>
                )}
              </div>
              <div className="flex flex-col gap-2 pb-4 mt-4 items-center border-b">
                <Button>
                  <BiPlus size="1.5em" /> Ikuti
                </Button>
                {userFind?.is_bimbel && userFind.is_bimbel_active && (
                  <Button onClick={flip}>
                    <BiCart size="1.5em" /> Pesan Bimbel
                  </Button>
                )}
              </div>
              <div>
                <div className="flex mt-2 items-center">
                  <div className="text-gray-400">
                    <FaGraduationCap size="1.5em" />
                  </div>
                  <div className="text-lg ml-3">
                    <p>
                      Pendidikan Terakhir di{" "}
                      <span className="font-bold">
                        {userFind?.metadata?.degree}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mt-2 items-center">
                <div className="text-gray-400">
                  <FaHome size="1.5em" />
                </div>
                <div className="text-lg ml-3">
                  <p>
                    Tinggal di{" "}
                    <span className="font-bold">
                      {userFind?.name}, {userFind?.province?.name}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex mt-2 items-center">
                <div className="text-gray-400">
                  <MdPlace size="1.5em" />
                </div>
                <div className="text-lg ml-3">
                  <p>
                    Diikuti{" "}
                    <span className="font-bold">
                      {userFind?.followers?.length}
                    </span>{" "}
                    orang
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2 p-2">
                {userFind?.followers.map((e) => (
                  <ImageContainer
                    key={e.id}
                    fallback="profile"
                    className="w-32 rounded-full"
                    src={e?.cover?.path}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-5 gap-3 shadow rounded p-4">
          <h2 className="text-lg font-semibold">Quiz {userFind?.name}</h2>

          {userFind ? (
            <Loader<Quiz>
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-3"
              query={gql`
                ${CorePageInfoField}
                ${CoreQuizCardMinimalField}
                query GetQuizzez($first: Int!, $after: String, $user_id: ID) {
                  quizzez(first: $first, after: $after, user_id: $user_id) {
                    edges {
                      node {
                        ...CoreQuizCardMinimalField
                      }
                    }
                    pageInfo {
                      ...CorePageInfoField
                    }
                  }
                }
              `}
              variables={{ user_id: userFind?.id }}
              perPage={20}
              fetchPolicy="network-only"
              fields={"quizzez"}
              Component={QuizCard}
              SkeletonComponent={QuizCardSkeleton}
            />
          ) : (
            <SkeletonGrid
              SkeletonComponent={QuizCardSkeleton}
              total={20}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-3"
            />
          )}
        </div>
      </div>
    </AppContainer>
  );
}

export default withRouter(Username);
