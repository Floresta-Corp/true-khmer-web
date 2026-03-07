import React from "react";
import OpportunityDetail from "../components/OpportunityDetail";
import RoleDetail from "../components/RoleDetail";

enum State {
  DETAIL = "Detail",
  ROLE = "Role",
}

export default function VolunteerPostPage() {
  const [state, setState] = React.useState<State>(State.DETAIL);

  if (state === State.DETAIL) {
    return (
      <OpportunityDetail
        onContinueToRole={() => {
          setState(State.ROLE);
        }}
      />
    );
  }

  return <RoleDetail onBackToDetails={() => setState(State.DETAIL)} />;
}
