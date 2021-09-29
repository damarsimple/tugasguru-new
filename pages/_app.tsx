import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";
import type { AppProps } from "next/app";
import { useAuthStore } from "../store/auth";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import React from "react";
import "katex/dist/katex.min.css";
import "mathquill/build/mathquill.css";
import "mathquill4quill/mathquill4quill.css";
import "react-quill/dist/quill.snow.css";

import { ToastContainer } from "react-toastify";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
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
