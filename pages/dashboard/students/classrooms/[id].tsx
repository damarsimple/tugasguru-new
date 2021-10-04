import { NextRouter } from "next/dist/client/router";
import withRouter from "next/dist/client/with-router";
import React from "react";
import DashboardContainer from "../../../../components/Container/DashboardContainer";

function Id({ router }: { router: NextRouter }) {
  return (
    <DashboardContainer>
      <div></div>
    </DashboardContainer>
  );
}
export default withRouter(Id);
