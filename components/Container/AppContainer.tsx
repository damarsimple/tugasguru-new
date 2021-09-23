import { Menu, Transition } from "@headlessui/react";
import { without } from "lodash";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import React, { Fragment } from "react";
import { AiOutlineUser, AiFillWallet } from "react-icons/ai";
import {
  MdChevronLeft,
  MdNotifications,
  MdSearch,
  MdShoppingCart,
} from "react-icons/md";
import { formatCurrency } from "../../helpers/formatter";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";
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

  return (
    <div>
      <Head>
        <title>{title ? title + " - Tugasguru" : "Tugasguru"}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
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
              <Link href="/dashboard">
                <a>
                  <button className="hidden md:flex gap-2  p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
                    <AiFillWallet size="1.5em" />{" "}
                    {formatCurrency(user?.balance)}
                  </button>
                </a>
              </Link>
              <Link href="/dashboard/notifications">
                <a>
                  <button className="flex p-2 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-semibold rounded">
                    <MdNotifications size="1.5em" /> 10
                  </button>
                </a>
              </Link>
              {user ? (
                <UserButton />
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
            <div className={without?.includes("margin") ? "" : "mt-16"}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
