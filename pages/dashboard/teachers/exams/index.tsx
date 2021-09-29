import React from "react";
import { BiPlus } from "react-icons/bi";
import Button from "../../../../components/Button";
import DashboardContainer from "../../../../components/Container/DashboardContainer";

export default function Index() {
  return (
    <DashboardContainer>
      <Button href="/dashboard/teachers/exams/create">
        <BiPlus />
        Buat ujian baru
      </Button>
    </DashboardContainer>
  );
}
