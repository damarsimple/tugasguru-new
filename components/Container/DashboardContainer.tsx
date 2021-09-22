import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useState } from "react";
import {
  AiFillCrown,
  AiFillHome,
  AiFillVideoCamera,
  AiOutlineBook,
} from "react-icons/ai";
import { FaHandsHelping, FaMedal, FaTasks } from "react-icons/fa";
import {
  MdAccountCircle,
  MdSubscriptions,
  MdShoppingCart,
  MdReceipt,
  MdAccountBalanceWallet,
  MdGamepad,
  MdSettings,
  MdStore,
  MdSearch,
  MdDashboard,
  MdSchool,
} from "react-icons/md";
import AppContainer from "../../components/Container/AppContainer";
import {
  RiUserSearchFill,
  RiUserSettingsLine,
  RiBankCardFill,
  RiUserHeartLine,
  RiUserStarLine,
} from "react-icons/ri";
import create from "zustand";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Button from "../../components/Button";
import { useUserStore } from "../../store/user";
import { GiMegaphone } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsNewspaper } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiUpgrade, GiShadowFollower } from "react-icons/gi";
import { GrUserAdmin } from "react-icons/gr";

interface Route {
  name: string;
  url: string;
  icon: JSX.Element;
}

export default function DashboardContainer({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) {
  const baseUserMenu: Route[] = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <AiFillHome size="1.5em" />,
    },
    {
      name: "Pengaturan Profil",
      url: "/dashboard/settings",
      icon: <RiUserSettingsLine size="1.5em" />,
    },
    {
      name: "Pengumuman",
      url: "/dashboard/announcements",
      icon: <GiMegaphone size="1.5em" />,
    },
    {
      name: "Toko Konten",
      url: "/shop",
      icon: <MdStore size="1.5em" />,
    },
    {
      name: "Cari Bimbel",
      url: "/bimbel",
      icon: <RiUserSearchFill size="1.5em" />,
    },
    {
      name: "Bimbel Saya",
      url: "/mybimbels",
      icon: <FaChalkboardTeacher size="1.5em" />,
    },
    {
      name: "Cari Teman",
      url: "/dashboard/friends",
      icon: <MdSearch size="1.5em" />,
    },
    {
      name: "Pengikut",
      url: "/dashboard/friends",
      icon: <GiShadowFollower size="1.5em" />,
    },
  ];

  const Routes: { [e: string]: Route[] } = {
    TEACHER: [
      {
        name: "Dashboard Bimbel",
        url: "/dashboard/bimbels",
        icon: <MdDashboard size="1.5em" color="white" />,
      },
      {
        name: "Upgrade Akun",
        url: "/dashboard/teachers/upgrades/",
        icon: <GiUpgrade size="1.5em" color="white" />,
      },
      {
        name: "Pengajuan",
        url: "/dashboard/teachers/forms/",
        icon: <FaMedal size="1.5em" color="white" />,
      },
      {
        name: "Bank Soal",
        url: "/dashboard/teachers/questions/",
        icon: <RiBankCardFill size="1.5em" color="white" />,
      },
      {
        name: "Buat Ujian",
        url: "/dashboard/teachers/exams/create",
        icon: <BsNewspaper size="1.5em" color="white" />,
      },
      {
        name: "Atur Ruang Kelas dan Mata Pelajaran",
        url: "/dashboard/teachers/classrooms/settings",
        icon: <MdSchool size="1.5em" color="white" />,
      },
      {
        name: "Tugas dan Ujian",
        url: "/dashboard/teachers/exams",
        icon: <AiOutlineBook size="1.5em" color="white" />,
      },
      {
        name: "Izin dan Konsultasi",
        url: "/dashboard/teachers/classrooms/",
        icon: <FaHandsHelping size="1.5em" color="white" />,
      },
      {
        name: "Kehadiran dan Nilai",
        url: "/dashboard/teachers/classrooms/",
        icon: <FaTasks size="1.5em" color="white" />,
      },
      {
        name: "Buat Laporan dan Panggilan",
        url: "/dashboard/teachers/classrooms/",
        icon: <HiOutlineDocumentReport size="1.5em" color="white" />,
      },
      {
        name: "Sekolah",
        url: "/dashboard/teachers/schools",
        icon: <MdSchool size="1.5em" color="white" />,
      },
      {
        name: "Kepala Sekolah",
        url: "/dashboard/teachers/headmasters/",
        icon: <AiFillCrown size="1.5em" color="white" />,
      },
      {
        name: "Admin Sekolah",
        url: "/dashboard/teachers/admins/",
        icon: <GrUserAdmin size="1.5em" color="white" />,
      },
      {
        name: "Wali Kelas",
        url: "/dashboard/teachers/homerooms/",
        icon: <RiUserHeartLine size="1.5em" color="white" />,
      },
      {
        name: "Guru BK",
        url: "/dashboard/teachers/counselors/",
        icon: <RiUserStarLine size="1.5em" color="white" />,
      },
    ],
    STUDENT: [
      {
        name: "Atur Ruang Kelas dan Mata Pelajaran",
        url: "/dashboard/classrooms/settings",
        icon: <MdSchool size="1.5em" color="white" />,
      },
      {
        name: "Sekolah",
        url: "/dashboard/students/school",
        icon: <MdSchool size="1.5em" color="white" />,
      },
    ],
  };

  const { pathname } = useRouter();

  const RenderMenu = (e: Route) => (
    <Link href={e.url}>
      <a
        className={
          "flex justify-center text-lg text-white capitalize font-semibold rounded hover:bg-red-900 p-4 " +
          (pathname == e.url ? "bg-red-400" : "")
        }
      >
        <a className="grid grid-cols-12 w-full p-4">
          <div className="col-span-12 lg:col-span-2"> {e.icon}</div>
          <div className="col-span-10 hidden lg:block uppercase font-semibold text-center">
            {e.name}
          </div>
        </a>
      </a>
    </Link>
  );

  const [index, setIndex] = useState(0);
  const { user } = useUserStore();
  return (
    <AppContainer without={["margin"]} title="Dashboard Utama">
      <div className="min-h-screen grid grid-cols-12 overflow-x-hidden">
        <div className="col-span-3 md:col-span-2 flex flex-col gap-1 bg-gradient-to-b from-blue-400 to-green-500 md:p-2 max-h-screen overflow-x-auto pt-16">
          <Tabs selectedIndex={index} onSelect={setIndex}>
            <TabList className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Tab>
                <button
                  className={
                    (index != 0 ? "bg-blue-300" : "bg-red-300 ") +
                    "uppercase flex justify-center w-full px-4 py-2 text-sm lg:text-lg font-semibold text-white transition-colors duration-300 "
                  }
                >
                  Dashboard
                </button>
              </Tab>
              <Tab>
                <button
                  className={
                    (index != 1 ? "bg-blue-300" : "bg-red-300 ") +
                    " uppercase flex justify-center w-full px-4 py-2 text-sm lg:text-lg font-semibold text-white transition-colors duration-300 "
                  }
                >
                  {user?.roles}
                </button>
              </Tab>
            </TabList>

            <TabPanel>
              <div className="pt-4">
                {[...baseUserMenu].map((e, i) => (
                  <RenderMenu {...e} key={i} />
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="pt-4">
                {user &&
                  Routes[user.roles].map((e, i) => (
                    <RenderMenu {...e} key={i} />
                  ))}
              </div>
            </TabPanel>
          </Tabs>
        </div>
        <div className="col-span-9 md:col-span-10 p-2 md:p-10 overflow-x-scroll  max-h-screen">
          <div className="pt-16">{children}</div>
        </div>
      </div>
    </AppContainer>
  );
}
