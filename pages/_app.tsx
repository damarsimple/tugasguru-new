import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";
import type { AppProps } from "next/app";
import { useAuthStore } from "../store/auth";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import React, { useEffect } from "react";
import "katex/dist/katex.min.css";
import "mathquill/build/mathquill.css";
import "mathquill4quill/mathquill4quill.css";
import "react-quill/dist/quill.snow.css";
import create from "zustand";
import { useNProgress } from "@tanem/react-nprogress";
import { Router } from "next/dist/client/router";
import { ToastContainer } from "react-toastify";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { QuizInvitePopup } from "../components/QuizInvitePopup";

import moment from "moment-timezone";

moment.tz.setDefault("Asia/Jakarta");

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
          ...[
            "transactions",
            "courses",
            "quizzes",
            "tutorings",
            "submissions",
            "classtypes",
            "vouchers",
            "questions",
            "extracurriculars",
            "provinces",
            "quizplays",
            "formsubmissions",
            "withdraws",
            "attendances",
            "quizsessions",
            "packagequestions",
            "accesses",
            "users",
            "exams",
            "cities",
            "majors",
            "password",
            "examtypes",
            "agendas",
            "subjects",
            "chatrooms",
            "districts",
            "reports",
            "assigmentsubmissions",
            "schools",
            "documents",
            "classrooms",
            "notifications",
            "announcements",
            "meetings",
            "chats",
          ].reduce((o, key) => ({ ...o, [key]: relayStylePagination() }), {}),
        },
      },
    },
  }),
});

export const useProgressStore = create<{
  isAnimating: boolean;
  setIsAnimating: (by: boolean) => void;
}>((set) => ({
  isAnimating: false,
  setIsAnimating: (isAnimating: boolean) => set(() => ({ isAnimating })),
}));

export const Bar = ({
  animationDuration,
  progress,
}: {
  animationDuration: number;
  progress: number;
}) => (
  <div
    className="bg-indigo-600 h-1 w-full left-0 top-0 fixed z-50"
    style={{
      marginLeft: `${(-1 + progress) * 100}%`,
      transition: `margin-left ${animationDuration}ms linear`,
    }}
  ></div>
);

export const Progress = ({ isAnimating }: { isAnimating: boolean }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
};

export const Container = ({
  animationDuration,
  children,
  isFinished,
}: {
  animationDuration: number;
  isFinished: boolean;
  children: JSX.Element;
}) => (
  <div
    className="pointer-events-none"
    style={{
      opacity: isFinished ? 0 : 1,
      transition: `opacity ${animationDuration}ms linear`,
    }}
  >
    {children}
  </div>
);

function MyApp({ Component, pageProps }: AppProps) {
  const { setIsAnimating, isAnimating } = useProgressStore();

  useEffect(() => {
    const handleStart = () => {
      setIsAnimating(true);
    };
    const handleStop = () => {
      setIsAnimating(false);
    };

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router]);
  return (
    <ApolloProvider client={client}>
      <Progress isAnimating={isAnimating} />
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
      <QuizInvitePopup />
    </ApolloProvider>
  );
}
export default MyApp;
