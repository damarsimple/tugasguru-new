import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Button from "../../../components/Button";
import DashboardContainer from "../../../components/Container/DashboardContainer";
import ImageContainer from "../../../components/Container/ImageContainer";
import { useUserStore } from "../../../store/user";

export default function BimbelDashboard() {
  const [toggleActiveBimbel, setToggleActiveBimbel] = useState(false);
  return (
    <DashboardContainer>
      <Tabs>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Bimbel</Tab>
        </TabList>
        <TabPanel>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex items-center justify-around p-6 bg-white w-64 rounded-xl space-x-2 mt-10 shadow">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">Aktifkan Bimbel</h1>

                  <div className="flex gap-3">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        onChange={(e) =>
                          setToggleActiveBimbel(e.target.checked)
                        }
                        type="checkbox"
                        name="toggle"
                        id="toggle"
                        className={`${
                          toggleActiveBimbel ? "right-0" : ""
                        } toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer`}
                      />
                      <label
                        htmlFor="toggle"
                        className={`${
                          toggleActiveBimbel ? "bg-green-300" : "bg-gray-300"
                        } toggle-label block overflow-hidden h-6 rounded-full cursor-pointer`}
                      ></label>
                    </div>
                    <div>{toggleActiveBimbel ? "Aktif" : "Tidak Aktif"}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-around p-6 bg-white w-64 rounded-xl space-x-2 mt-10 shadow">
                <div>
                  <span className="text-sm font-semibold text-gray-400">
                    Penghasilan Bulan Ini
                  </span>

                  <h1 className="text-2xl font-bold">$682.5</h1>
                </div>
              </div>
              <div className="flex items-center justify-around p-6 bg-white w-64 rounded-xl space-x-2 mt-10 shadow">
                <div>
                  <span className="text-sm font-semibold text-gray-400">
                    Permintaan bimbel bulan ini
                  </span>

                  <h1 className="text-2xl font-bold">10</h1>
                </div>
              </div>
              <div className="flex items-center justify-around p-6 bg-white w-64 rounded-xl space-x-2 mt-10 shadow">
                <div>
                  <span className="text-sm font-semibold text-gray-400">
                    Bimbel Aktif
                  </span>

                  <h1 className="text-2xl font-bold">10</h1>
                </div>
              </div>
            </div>
            <div className="border border-white shadow  rounded-3xl p-4">
              <div className="flex-none sm:flex">
                <div className=" relative h-32 w-32   sm:mb-0 mb-3">
                  <ImageContainer
                    src={undefined}
                    fallback="profile"
                    className="rounded-full"
                    height={300}
                    width={300}
                    alt="Picture of the author"
                  />
                </div>
                <div className="flex-auto sm:ml-5 justify-evenly">
                  <div className="flex items-center justify-between sm:mt-2">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="w-full flex-none text-lg text-gray-800 font-bold leading-none">
                          Aji
                        </div>
                        <div className="flex-auto text-gray-500 my-1">
                          <span className="mr-3 ">
                            Cipanas , Kabupaten Cianjur, Jawa Barat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex pt-2  text-sm text-gray-500 justify-between">
                    <div>
                      <p>40 Hari</p>
                      <p>Jalan Aezakmi 100 RT/RW 04/04 </p>
                      <p>Saya ingin anda mengajari saya menggunakan ninjutsu</p>
                    </div>

                    <div className="flex gap-2">
                      <Button color="GREEN">Terima Permintaan</Button>
                      <Button color="RED">Totak Permintaan</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
