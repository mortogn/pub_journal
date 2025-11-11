import PageHeading from "@/components/common/page-heading";
import React from "react";
import UsersClientPage from "./page.client";

export default function UsersPage() {
  return (
    <div>
      <PageHeading
        title="Manage Users"
        subtitle="Manage all the users using the website"
      />

      <UsersClientPage />
    </div>
  );
}
