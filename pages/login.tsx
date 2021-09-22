import React, { useState } from "react";
import { useRouter } from "next/dist/client/router";
import { AiFillGoogleCircle } from "react-icons/ai";
import { gql, useMutation } from "@apollo/client";
import { User } from "../types/type";
import { useAuthStore } from "../store/auth";
import { CORE_USER_INFO_MINIMAL_FIELD } from "../fragments/fragments";
import { useUserStore } from "../store/user";
import Button from "../components/Button";
import AppContainer from "../components/Container/AppContainer";
import ImageContainer from "../components/Container/ImageContainer";

const LOGIN = gql`
  ${CORE_USER_INFO_MINIMAL_FIELD}
  mutation Login($password: String!, $email: String!) {
    login(input: { password: $password, email: $email }) {
      message
      token
      user {
        ...CoreUserInfoMinimalField
        balance
        is_admin
      }
    }
  }
`;

export interface LoginOutput {
  token: string;
  user: User;
  message: string;
}
export default function Login() {
  const router = useRouter();

  const { setToken } = useAuthStore();

  const { setUser } = useUserStore();

  const [handleLogin, { data, loading, error }] = useMutation<{
    login: LoginOutput;
  }>(LOGIN, {});

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    handleLogin({
      variables: {
        email: username,
        password: password,
      },
    }).then(({ data: e }) => {
      if (e?.login.token) {
        setToken(e.login.token);
        setUser(e.login.user);

        window.location.replace("/dashboard");
      }
    });
  };

  return (
    <AppContainer title="Login" without={["navbar"]}>
      <div
        className="flex h-screen"
        style={{ backgroundImage: "url('/login.jpeg')" }}
      >
        <div className="m-auto">
          <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
            <div className="p-4 py-6 text-white md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
              <ImageContainer
                fallback="profile"
                className="rounded-full h-56 w-56 "
                src={"/android-chrome-512x512.png"}
                alt="Picture of the author"
                height={300}
                width={300}
              />
            </div>
            <div className="p-5 bg-white md:flex-1">
              <h3 className="my-4 text-2xl font-semibold text-gray-700">
                Login
              </h3>
              <h4 className="h-4 my-4 text-lg font-thin  italic text-red-600">
                {data?.login?.message} {error?.message}
              </h4>
              <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Alamat Email / Nomor Telepon
                  </label>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    id="email"
                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-500"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline focus:text-blue-800"
                    >
                      Lupa Password
                    </a>
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="password"
                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 transition duration-300 rounded focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-blue-200"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <Button loading={loading} type="submit" color="BLUE">
                    Log In
                  </Button>
                </div>
                <div className="flex flex-col space-y-5">
                  <span className="flex items-center justify-center space-x-2">
                    <span className="h-px bg-gray-400 w-14" />
                    <span className="font-normal text-gray-500">
                      atau login dengan
                    </span>
                    <span className="h-px bg-gray-400 w-14" />
                  </span>
                  <div className="flex flex-col space-y-4 gap-4">
                    <Button>
                      <span>
                        <AiFillGoogleCircle size="1.5em" />
                      </span>
                      <span className="text-lg font-bold  text-white group-hover:text-white">
                        Google
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col space-y-5">
                  <span className="flex items-center justify-center space-x-2">
                    <span className="h-px bg-gray-400 w-14" />
                    <span className="font-normal text-gray-500">
                      belum memiliki akun ?
                    </span>
                    <span className="h-px bg-gray-400 w-14" />
                  </span>
                  <div className="flex flex-col space-y-4 gap-4">
                    <Button href="/registration">DAFTAR</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
