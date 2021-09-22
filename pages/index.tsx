/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Button from "../components/Button";
import AppContainer from "../components/Container/AppContainer";
import ImageContainer from "../components/Container/ImageContainer";
import { useUserStore } from "../store/user";

const Home: NextPage = () => {
  const { user } = useUserStore();
  return (
    <AppContainer>
      <div
        style={{ backgroundImage: 'url("/background.jpg")' }}
        className=" bg-cover min-h-screen w-full"
      >
        <div className="px-6  mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="grid grid-cols-1 gap-2 w-full justify-center lg:items-start overflow-y-hidden">
            <div className="my-auto w-full md:w-1/2 pt-20">
              <div className="min-h-full flex justify-center md:justify-start">
                <ImageContainer
                  className="right-0 slide-in-bottom max-h-96"
                  src="android-chrome-192x192.png"
                  alt="Logo"
                />
              </div>
              <h1 className="my-4 text-3xl md:text-5xl text-white font-bold leading-tight text-center md:text-left slide-in-bottom-h1">
                Tugas Guru
              </h1>
              <div
                className="
  font-thin capitalize text-white 
            leading-normal text-base md:text-2xl mb-8 
            text-center md:text-left 
            slide-in-bottom-subtitle"
              >
                Ujian Online, Quiz, Bimbingan Belajar, Ruang Kelas, Admin
                Sekolah, Absensi QR Code, PPDB Online, Raport Online, Cek
                Kelulusan, Akun Orang Tua, Guru Bimbel
              </div>
              <div className="my-4 flex flex-col gap-2 justify-center">
                <Link href={user ? "/dashboard" : "/login"}>
                  <a>
                    <Button color="BLUE">{user ? "DASHBOARD" : "MASUK"}</Button>
                  </a>
                </Link>
                <a
                  href="https://wa.me/6282240001974?text=Hai Admin Tugas Guru Mohon bantuannya..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button color="GREEN">
                    <span className="flex w-full justify-center">
                      <AiOutlineWhatsApp size="1.5em" /> CHAT ADMIN
                    </span>
                  </Button>
                </a>
              </div>

              <p className="text-blue-400 font-bold pb-8 lg:pb-6 text-center md:text-left fade-in">
                Download aplikasi kami Gratis:
              </p>
              <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0 fade-in">
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  <ImageContainer
                    src="/App Store.svg"
                    className="h-12 pr-4 bounce-top-icons"
                    alt="App Store"
                  />
                </a>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  <ImageContainer
                    src="/Play Store.svg"
                    className="h-12 bounce-top-icons"
                    alt="App Store"
                  />
                </a>
              </div>
            </div>
            <div className="col-span-2 order-last w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
              <a
                className="text-gray-900 no-underline hover:no-underline"
                href="#"
              >
                © Tugas Guru 2021
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default Home;
