import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Button from "../../components/Button";
import DashboardContainer from "../../components/Container/DashboardContainer";
import ImageContainer from "../../components/Container/ImageContainer";

export default function Mybimbels() {
  const [toggleActiveBimbel, setToggleActiveBimbel] = useState(false);
  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Bimbel</Tab>
        </TabList>
        <TabPanel className="flex flex-col gap-2">
          <button
            type="button"
            className={`${
              false ? "bg-gray-100" : "bg-white "
            } shadow rounded-full text-black p-2 leading-none w-24 text-center`}
          >
            Aktif
          </button>
          <div className="max-w-full  bg-white flex flex-col rounded overflow-hidden shadow-lg">
            <div className="flex flex-row items-baseline flex-nowrap bg-gray-100 p-2">
              <h1 className="ml-2 uppercase font-bold text-gray-500">
                Riwayat Bimbel Saya
              </h1>
            </div>
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Guru
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Hari
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Status
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Alasan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                    Agus Serizawa
                  </td>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                    10 Agustus 2020 - 20 Agustus 2020 (20 hari)
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                    Ditolak (refunded)
                  </td>
                  <td>Saya Sibuk 😠😠😠😡😡</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel className="flex flex-col gap-2">
          <button
            type="button"
            className={`${
              false ? "bg-gray-100" : "bg-white "
            } shadow rounded-full text-black p-2 leading-none w-24 text-center`}
          >
            Aktif
          </button>
          <div className="max-w-full  bg-white flex flex-col rounded overflow-hidden shadow-lg">
            <div className="flex flex-row items-baseline flex-nowrap bg-gray-100 p-2">
              <h1 className="ml-2 uppercase font-bold text-gray-500">
                Bimbel dengan Tamvan No Jutsu
              </h1>
              <p className="ml-2 font-normal text-gray-500">
                10 Agustus 2020 - 20 Agustus 2020 (20 hari)
              </p>
            </div>
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Hari
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Hadir
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    QR Code
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Dibayarkan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                    10 Agustus 2020
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                    Ya
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                    <a
                      className="underline text-blue-400 hover:text-blue-600"
                      href="/qr/uuid"
                      target="_blank"
                    >
                      LINK QR
                    </a>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                    Ya
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
      </Tabs>
    </DashboardContainer>
  );
}
