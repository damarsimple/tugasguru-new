import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import school from "../../pages/dashboard/students/school";
import { School } from "../../types/type";
import UserCard from "../Card/UserCard";
import ImageContainer from "../Container/ImageContainer";

export default function SchoolView({ school }: { school?: School }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="shadow rounded-2xl bg-white dark:bg-gray-800 p-4">
        <div className="flex gap-3">
          <div>
            <a href="#" className="block relative">
              <ImageContainer
                alt="profil"
                fallback="profile"
                className="mx-auto object-cover rounded-full h-16 w-16 "
              />
            </a>
          </div>
          <div className=" flex flex-col">
            <span className="text-gray-600 dark:text-white text-2xl font-bold uppercase">
              {school?.name}
            </span>
          </div>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>Guru</Tab>
          <Tab>Siswa</Tab>
          <Tab>Guru BK</Tab>
          <Tab>Wali Kelas</Tab>
        </TabList>
        <TabPanel className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {school?.teachers?.map((e) => (
            <UserCard {...e} key={e.id} />
          ))}
        </TabPanel>
        <TabPanel className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {school?.students?.map((e) => (
            <UserCard {...e} key={e.id} />
          ))}
        </TabPanel>
        <TabPanel className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {school?.counselors?.map((e) => (
            <UserCard {...e} key={e.id} />
          ))}
        </TabPanel>
        <TabPanel className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {school?.homerooms?.map((e) => (
            <UserCard {...e} key={e.id} />
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
}
