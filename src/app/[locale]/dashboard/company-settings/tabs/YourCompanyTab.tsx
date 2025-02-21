"use client";

import { useState } from "react";
import ProfileCard from "../../profile/tabs/components/ProfileCard";
import EditCompanyNameDialog from "../components/EditCompanyNameDialog";
import EditCompanyDescriptionDialog from "../components/EditCompanyDescriptionDialog";
import EditCompanySectorDialog from "../components/EditCompanySectorDialog";

const YourCompanyTab = () => {
  const [editCompanyName, setEditCompanyName] = useState(false);
  const [editCompanyDescription, setEditCompanyDescription] = useState(false);
  const [editCompanySector, setEditCompanySector] = useState(false);

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Your Company</h2>

      <ProfileCard title="Company Name" onEdit={() => setEditCompanyName(true)}>
        <p className="font-semibold">Acme Corporation</p>
      </ProfileCard>

      <ProfileCard
        title="Company Description"
        onEdit={() => setEditCompanyDescription(true)}
      >
        <p className="font-semibold text-gray-500">
          Acme Corporation is a leading provider of innovative solutions for
          businesses...
        </p>
      </ProfileCard>

      <ProfileCard
        title="Company Sector"
        onEdit={() => setEditCompanySector(true)}
      >
        <p className="font-semibold">Technology</p>
      </ProfileCard>

      <EditCompanyNameDialog
        open={editCompanyName}
        setOpen={setEditCompanyName}
      />
      <EditCompanyDescriptionDialog
        open={editCompanyDescription}
        setOpen={setEditCompanyDescription}
      />
      <EditCompanySectorDialog
        open={editCompanySector}
        setOpen={setEditCompanySector}
      />
    </div>
  );
};

export default YourCompanyTab;
