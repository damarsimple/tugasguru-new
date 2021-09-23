import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";
import type { AppProps } from "next/app";
import { useAuthStore } from "../store/auth";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import React, { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { useUserStore } from "../store/user";
import echo from "../services/echo";
import { Quizsession, User } from "../types/type";
import { QuizInvitePopup } from "../components/QuizInvitePopup";

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const { token } = useAuthStore.getState();
  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(uploadLink as unknown as ApolloLink),
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          ...["users", "quizzez", "courses"].reduce(
            (o, key) => ({ ...o, [key]: relayStylePagination() }),
            {}
          ),
          // userByUsername: {
          //   merge(existing, incoming) {
          //     if (!existing) return incoming;

          //     const newData = {};

          //     for (const x in incoming) {
          //       if (typeof incoming[x] == "object") {
          //         if (
          //           (incoming[x]?.__typename as string)?.includes("Connection")
          //         ) {
          //           const typeName = incoming[x].__typename;
          //           for (const y in existing ?? {}) {
          //             if (typeof existing[y] == "object") {
          //               if (typeName == existing[y]?.__typename) {
          //                 const remove = x.indexOf("(");
          //                 Object.defineProperty(newData, x.substr(0, remove), {
          //                   value: {
          //                     ...existing[y],
          //                     ...incoming[x],
          //                     edges: [
          //                       ...(existing[y]?.edges ?? []),
          //                       ...(incoming[x].edges ?? []),
          //                     ],
          //                   },
          //                 });
          //               }
          //             }
          //           }
          //         }
          //       }
          //     }

          //     console.log(newData);

          //     return incoming;

          //     return { ...existing, ...incoming, ...newData };
          //   },
          // },
        },
      },
    },
  }),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
      <QuizInvitePopup />
    </ApolloProvider>
  );
}
export default MyApp;
