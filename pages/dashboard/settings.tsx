import gql from "graphql-tag";
import React from "react";
import { toast } from "react-toastify";
import DashboardContainer from "../../components/Container/DashboardContainer";
import Form from "../../components/Forms/Form";
import Paper from "../../components/Paper";
import PaperLoading from "../../components/PaperLoading";
import DocumentUploader from "../../components/DocumentUploader";
import { useUserStore } from "../../store/user";
import { GenericOutput, User } from "../../types/type";

export default function Settings() {
  const { user, setUser } = useUserStore();

  return (
    <DashboardContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentUploader
          roles="COVER"
          type="picture"
          documentable_id={user?.id}
          documentable_type={"App\\Models\\User"}
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
                mutation updateUser(
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
        <Paper name="Update Password">
          <Form<GenericOutput, { updateUserPassword: GenericOutput }>
            fields="updateUserPassword"
            attributes={[
              {
                label: "Password Lama",
                name: "password",
                required: true,
                type: "password",
              },
              {
                label: "Password Baru",
                name: "new_password",
                required: true,
                type: "password",
              },
              {
                label: "Konfirmasi Password Baru",
                name: "confirm_new_password",
                required: true,
                type: "password",
              },
            ]}
            mutationQuery={gql`
              mutation UpdateUserPassword(
                $password: String!
                $new_password: String!
              ) {
                updateUserPassword(
                  input: { password: $password, new_password: $new_password }
                ) {
                  status
                  message
                }
              }
            `}
            afterSubmit={(e) => {
              if (e.status) {
                toast.success(e.message);
              } else {
                toast.error(e.message);
              }
            }}
            beforeSubmit={(e) => {
              if (e["new_password"] != e["confirm_new_password"]) {
                throw new Error("Password tidak sama");
              }
            }}
          />
        </Paper>
      </div>
    </DashboardContainer>
  );
}
