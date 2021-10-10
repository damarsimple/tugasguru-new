import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { ReactNode, useEffect } from "react";
import {
  AiFillCrown,
  AiFillHome,
  AiFillStop,
  AiOutlineTransaction,
} from "react-icons/ai";
import { FaGamepad, FaHandsHelping, FaMedal } from "react-icons/fa";
import {
  MdStore,
  MdSearch,
  MdDashboard,
  MdSchool,
  MdSupervisorAccount,
  MdBook,
  MdPlace,
  MdReport,
  MdBookmark,
} from "react-icons/md";
import AppContainer from "../../components/Container/AppContainer";
import {
  RiUserSearchFill,
  RiUserSettingsLine,
  RiBankCardFill,
  RiUserHeartLine,
  RiUserStarLine,
  RiAdminFill,
} from "react-icons/ri";
import { useUserStore } from "../../store/user";
import { GiMegaphone, GiRank1 } from "react-icons/gi";
import { HiOutlineDocumentReport, HiTicket } from "react-icons/hi";
import { BsList, BsNewspaper } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiUpgrade, GiShadowFollower } from "react-icons/gi";
import { GrTransaction, GrUserAdmin } from "react-icons/gr";
import { IoMdPaper } from "react-icons/io";
import { toast } from "react-toastify";
import { BiTask } from "react-icons/bi";
import { SiGoogleclassroom } from "react-icons/si";
import create from "zustand";

interface Route {
  name: string;
  url: string;
  icon: JSX.Element;
}

interface NavbarStore {
  index: number;
  setIndex: (e: number) => void;
}

export const useNavbarStore = create<NavbarStore>((set, get) => ({
  index: 0,
  setIndex: (index) => set({ index }),
}));

export default function DashboardContainer({
  admin,
  title,
  children,
}: {
  admin?: boolean;
  children: ReactNode;
  title?: string;
}) {
  const { pathname, push } = useRouter();

  const { user } = useUserStore();
  const { index, setIndex } = useNavbarStore();

  const RenderMenu = (e: Route) => (
    <Link href={e.url}>
      <a
        className={
          "flex justify-between text-lg text-white capitalize font-semibold rounded hover:bg-red-900 p-4 " +
          (pathname == e.url ? "bg-red-400" : "")
        }
      >
        <div className="col-span-10 hidden lg:block uppercase font-semibold text-center">
          {e.name}
        </div>
        <div className="col-span-12 lg:col-span-2"> {e.icon}</div>
      </a>
    </Link>
  );

  useEffect(() => {
    if (admin && !user?.is_admin) {
      setIndex(1);
      push("/");
      toast.error("Anda tidak memiliki akses ke tempat ini \\:<");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, admin, push]);

  return (
    <AppContainer without={["margin"]} title={title ?? "Dashboard Utama"}>
      <div className="min-h-screen grid grid-cols-12 overflow-x-hidden">
        <div className="col-span-3 md:col-span-2 flex flex-col gap-1 bg-gradient-to-b from-blue-500 to-yellow-500 md:p-2 max-h-screen overflow-x-auto pt-16">
          <div className="mt-2 md:mt-16 flex flex-col lg:flex-row gap-2">
            <button
              onClick={() => setIndex(0)}
              className={
                (index != 0 ? "bg-blue-300" : "bg-red-300 ") +
                " uppercase flex justify-center w-full px-4 py-2 text-sm lg:text-lg font-semibold text-white transition-colors duration-300 "
              }
            >
              Dashboard
            </button>
            {!admin && (
              <button
                onClick={() => setIndex(1)}
                className={
                  (index != 1 ? "bg-blue-300" : "bg-red-300 ") +
                  " uppercase flex justify-center w-full px-4 py-2 text-sm lg:text-lg font-semibold text-white transition-colors duration-300 "
                }
              >
                {user?.roles}
              </button>
            )}
          </div>
          {user?.is_admin && (
            <RenderMenu
              icon={<RiAdminFill size="1.5em" color="white" />}
              name={"Menu Admin"}
              url={"/admin"}
            />
          )}
          {index == 0 && (
            <div className="pt-4">
              {(admin ? adminMenu : baseUserMenu).map((e, i) => (
                <RenderMenu {...e} key={i} />
              ))}
            </div>
          )}
          {index == 1 && (
            <div className="pt-4">
              {user &&
                Routes[user.roles].map((e, i) => <RenderMenu {...e} key={i} />)}
            </div>
          )}
        </div>
        <div className="col-span-9 md:col-span-10 p-2 md:p-10 overflow-x-scroll  max-h-screen">
          <div className="pt-16">{children}</div>
        </div>
      </div>
    </AppContainer>
  );
}

const adminMenu: Route[] = [
  {
    name: "Dashboard",
    url: "/admin",
    icon: <AiFillHome size="1.5em" />,
  },
  {
    name: "Pengguna",
    url: "/admin/users",
    icon: <MdSupervisorAccount size="1.5em" />,
  },
  {
    name: "Mata Pelajaran",
    url: "/admin/subjects",
    icon: <IoMdPaper size="1.5em" />,
  },
  {
    name: "Laporan dan Pengajuan",
    url: "/admin/reports",
    icon: <MdReport size="1.5em" />,
  },
  {
    name: "Pengumuman",
    url: "/admin/announcements",
    icon: <GiMegaphone size="1.5em" />,
  },
  {
    name: "Provinsi",
    url: "/admin/provinces",
    icon: <MdPlace size="1.5em" />,
  },
  {
    name: "Kota / Kabupaten",
    url: "/admin/cities",
    icon: <MdPlace size="1.5em" />,
  },
  {
    name: "Kecamatan / Kelurahan",
    url: "/admin/districts",
    icon: <MdPlace size="1.5em" />,
  },

  {
    name: "Sekolah",
    url: "/admin/schools",
    icon: <MdSchool size="1.5em" />,
  },
  {
    name: "Voucher",
    url: "/admin/vouchers",
    icon: <HiTicket size="1.5em" />,
  },
  {
    name: "Transaksi",
    url: "/admin/transactions",
    icon: <GrTransaction size="1.5em" />,
  },
  {
    name: "Withdraw",
    url: "/admin/withdraws",
    icon: <AiOutlineTransaction size="1.5em" />,
  },
  {
    name: "Quiz",
    url: "/admin/quizzez",
    icon: <FaGamepad size="1.5em" />,
  },
];
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
    url: "/dashboard/mybimbels",
    icon: <FaChalkboardTeacher size="1.5em" />,
  },
  {
    name: "Cari Teman",
    url: "/dashboard/searchfriends",
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
      url: "/dashboard/teachers/bimbels",
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
      name: "Ujian",
      url: "/dashboard/teachers/exams",
      icon: <BsNewspaper size="1.5em" color="white" />,
    },
    {
      name: "Tugas",
      url: "/dashboard/teachers/assigments",
      icon: <BiTask size="1.5em" color="white" />,
    },
    {
      name: "Ruang Kelas",
      url: "/dashboard/teachers/classrooms",
      icon: <MdSchool size="1.5em" color="white" />,
    },
    {
      name: "Mata Pelajaran",
      url: "/dashboard/teachers/subjects",
      icon: <MdBookmark size="1.5em" color="white" />,
    },
    {
      name: "Izin",
      url: "/dashboard/teachers/absents/",
      icon: <AiFillStop size="1.5em" color="white" />,
    },
    {
      name: "Konsultasi",
      url: "/dashboard/teachers/consultations/",
      icon: <FaHandsHelping size="1.5em" color="white" />,
    },
    {
      name: "Kehadiran",
      url: "/dashboard/teachers/agenda/",
      icon: <BsList size="1.5em" color="white" />,
    },
    {
      name: "Nilai",
      url: "/dashboard/teachers/grades/",
      icon: <GiRank1 size="1.5em" color="white" />,
    },
    {
      name: "Laporan",
      url: "/dashboard/teachers/reports/",
      icon: <HiOutlineDocumentReport size="1.5em" color="white" />,
    },
    {
      name: "Panggilan",
      url: "/dashboard/teachers/calls/",
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
      name: "Ruang Kelas",
      url: "/dashboard/students/classrooms/",
      icon: <SiGoogleclassroom size="1.5em" color="white" />,
    },
    {
      name: "Sekolah",
      url: "/dashboard/students/school",
      icon: <MdSchool size="1.5em" color="white" />,
    },
    {
      name: "Ujian",
      url: "/dashboard/students/exams",
      icon: <BsNewspaper size="1.5em" color="white" />,
    },
    {
      name: "Tugas",
      url: "/dashboard/students/assigments",
      icon: <BiTask size="1.5em" color="white" />,
    },
  ],
};
