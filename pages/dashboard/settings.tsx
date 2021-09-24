import gql from "graphql-tag";
import React from "react";
import DashboardContainer from "../../components/Container/DashboardContainer";
import Form from "../../components/Forms/Form";
import Paper from "../../components/Paper";
import PaperLoading from "../../components/PaperLoading";
import PictureUploader from "../../components/PictureUploader";
import { useUserStore } from "../../store/user";
import { Picture, User } from "../../types/type";

export default function Settings() {
  const { user, setUser } = useUserStore();

  return (
    <DashboardContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PictureUploader
          roles="COVER"
          pictureable_id={user?.id}
          pictureable_type={"App\\Models\\User"}
          name="Upload Foto Profil"
          crop={{ aspect: 5 / 5 }}
          onUploadFinish={(x) => {
            //@ts-ignore
            setUser({ ...user, cover: x as any });
          }}
        />
        {user ? (
          <Paper name="Update Informasi Akun">
            <Form<User, { updateUser: User }>
              successMessage="Berhasil mengubah data anda"
              fields="updateUser"
              attributes={[
                {
                  label: "Nama",
                  name: "name",
                },
                {
                  label: "Username",
                  name: "username",
                },
                {
                  label: "Alamat",
                  name: "address",
                },
                {
                  label: "Nomor Telepon",
                  name: "phone",
                },
                {
                  label: "Spesialitas",
                  name: "metadata.specialty",
                },
                {
                  label: "Pendidikan Terakhir",
                  name: "metadata.degree",
                },
                {
                  label: "Deskripsi Bimbel",
                  name: "metadata.description_bimbel",
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
              defaultValueMap={user}
              afterSubmit={(e) => setUser({ ...user, ...e })}
            />
          </Paper>
        ) : (
          <PaperLoading />
        )}
      </div>
    </DashboardContainer>
  );
}
