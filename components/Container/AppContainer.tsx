/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from "@headlessui/react";
import { without } from "lodash";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import React, { Fragment, useEffect } from "react";
import { AiOutlineUser, AiFillWallet } from "react-icons/ai";
import {
  MdChevronLeft,
  MdNotifications,
  MdSearch,
  MdShoppingCart,
} from "react-icons/md";
import { formatCurrency } from "../../helpers/formatter";
import echo from "../../services/echo";
import { useAuthStore } from "../../store/auth";
import { useNotificationStore } from "../../store/notifications";
import { useUserStore } from "../../store/user";
import { Notification } from "../../types/type";
import ImageContainer from "./ImageContainer";

type Except = "navbar" | "margin";

export function UserButton() {
  const { user, setUser } = useUserStore();
  const { setToken } = useAuthStore();

  const { push } = useRouter();

  return (
    <Menu as={Fragment}>
      <div>
        <Menu.Button className="flex p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
          {user?.username}
          <MdChevronLeft
            className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      setToken("");
                      setUser(null);
                      push("/login");
                    }}
                    className={`${
                      active ? "bg-gray-200" : "text-gray-900"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default function AppContainer({
  title,
  children,
  fullScreen,
  without,
  navTitle,
}: {
  title?: string;
  children?: JSX.Element | JSX.Element[] | string;
  fullScreen?: boolean;
  without?: Except[];
  navTitle?: string;
}) {
  const { user } = useUserStore();

  const { notifications, setNotifications } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    echo
      .private("App.Models.User." + user.id)
      .notification((e: Notification) => {
        setNotifications([...notifications, e]);
      });
  }, [user]);

  return (
    <div>
      <Head>
        <title>{title ? title + " - Tugasguru" : "Tugasguru"}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      <div className={fullScreen ? "h-screen" : ""}>
        {!without?.includes("navbar") && (
          <nav className="bg-primary-base fixed top-0 w-full shadow  p-1 md:p-3 flex justify-between z-50 h-14">
            <div>
              <Link href="/">
                <a className="flex gap-1">
                  <ImageContainer
                    className="h-10 w-10"
                    src="/android-chrome-192x192.png"
                  />
                  <h1 className="hidden md:block text-white text-xl font-bold">
                    {navTitle ?? "TUGAS GURU"}
                  </h1>
                </a>
              </Link>
            </div>

            <div className="flex gap-2 text-white">
              <button
                type="submit"
                className="hidden md:block  mt-2 mr-2 m-auto hover:text-gray-500"
              >
                <MdSearch size="1.5em" />
              </button>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a>
                      <button className="p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
                        {user?.cover ? (
                          <ImageContainer
                            width={20}
                            height={20}
                            src={user.cover.path}
                          />
                        ) : (
                          <AiOutlineUser size="1.5em" />
                        )}
                      </button>
                    </a>
                  </Link>

                  <Link href="/dashboard/notifications">
                    <a>
                      <button className="flex p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
                        <MdNotifications size="1.5em" /> {notifications?.length}
                      </button>
                    </a>
                  </Link>
                  <Link href="/dashboard/transactions">
                    <a>
                      <button className="hidden md:flex gap-2  p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
                        <AiFillWallet size="1.5em" />{" "}
                        {formatCurrency(user?.balance)}
                      </button>
                    </a>
                  </Link>
                  <UserButton />
                </>
              ) : (
                <Link href="/login">
                  <a>
                    <button className="p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
                      Login
                    </button>
                  </a>
                </Link>
              )}
            </div>
          </nav>
        )}
        <div className="h-full box-border">
          {without?.includes("navbar") ? (
            <div>{children}</div>
          ) : (
            <div className={without?.includes("margin") ? "" : "mt-10"}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
