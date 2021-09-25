import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AiFillCrown,
  AiFillHome,
  AiOutlineBook,
  AiOutlineTransaction,
} from "react-icons/ai";
import { FaGamepad, FaHandsHelping, FaMedal, FaTasks } from "react-icons/fa";
import {
  MdStore,
  MdSearch,
  MdDashboard,
  MdSchool,
  MdSupervisorAccount,
  MdBook,
  MdPlace,
  MdReport,
} from "react-icons/md";
import AppContainer from "../../components/Container/AppContainer";
import {
  RiUserSearchFill,
  RiUserSettingsLine,
  RiBankCardFill,
  RiUserHeartLine,
  RiUserStarLine,
} from "react-icons/ri";
import { useUserStore } from "../../store/user";
import { GiMegaphone } from "react-icons/gi";
import { HiOutlineDocumentReport, HiTicket } from "react-icons/hi";
import { BsNewspaper } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiUpgrade, GiShadowFollower } from "react-icons/gi";
import { GrFormSchedule, GrTransaction, GrUserAdmin } from "react-icons/gr";
import { IoMdPaper } from "react-icons/io";
import { toast } from "react-toastify";
interface Route {
  name: string;
  url: string;
  icon: JSX.Element;
}

export default function DashboardContainer({
  admin,
  title,
  children,
}: {
  admin?: boolean;
  children: JSX.Element | JSX.Element[] | string;
  title?: string;
}) {
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
      name: "Form Pengajuan",
      url: "/admin/forms",
      icon: <MdBook size="1.5em" />,
    },
    {
      name: "Laporan",
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

  const { pathname, push } = useRouter();

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

  const [index, setIndex] = useState(0);
  const { user } = useUserStore();

  useEffect(() => {
    if (admin && !user?.is_admin) {
      // push("/");
      // toast.error("Anda tidak memiliki akses ke tempat ini \\:<");
    }
  }, [user, admin, push]);

  return (
    <AppContainer without={["margin"]} title={title ?? "Dashboard Utama"}>
      <div className="min-h-screen grid grid-cols-12 overflow-x-hidden">
        <div className="col-span-3 md:col-span-2 flex flex-col gap-1 bg-gradient-to-b from-blue-400 to-green-500 md:p-2 max-h-screen overflow-x-auto pt-16">
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
