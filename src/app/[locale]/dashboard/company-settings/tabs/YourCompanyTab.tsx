"use client";

import { useState } from "react";
import ProfileCard from "../../profile/tabs/components/ProfileCard";
import EditCompanyNameDialog from "../components/EditCompanyNameDialog";
import EditCompanyDescriptionDialog from "../components/EditCompanyDescriptionDialog";
import EditCompanySectorDialog from "../components/EditCompanySectorDialog";
import { useCompany } from "@/hooks/useCompany";
import CompanyTabSkeleton from "../skeletons/company-tab-skeleton";

const YourCompanyTab = () => {
  const [editCompanyName, setEditCompanyName] = useState(false);
  const [editCompanyDescription, setEditCompanyDescription] = useState(false);
  const [editCompanySector, setEditCompanySector] = useState(false);
  const { company, isLoading } = useCompany({ enableFetch: true });

  if (isLoading) {
    return <CompanyTabSkeleton />;
  }

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Your Company</h2>

      <ProfileCard title="Company Name" onEdit={() => setEditCompanyName(true)}>
        <p className="font-semibold text-gray-500">{company?.name}</p>
      </ProfileCard>

      <ProfileCard
        title="Company Description"
        onEdit={() => setEditCompanyDescription(true)}
      >
        <p className="font-semibold text-gray-500">{company?.description}</p>
      </ProfileCard>

      <ProfileCard
        title="Company Sector"
        onEdit={() => setEditCompanySector(true)}
      >
        <p className="font-semibold text-gray-500">{company?.sector}</p>
      </ProfileCard>

      {company && (
        <>
          <EditCompanyNameDialog
            open={editCompanyName}
            setOpen={setEditCompanyName}
            company={company}
          />
          <EditCompanyDescriptionDialog
            open={editCompanyDescription}
            setOpen={setEditCompanyDescription}
            company={company}
          />
          <EditCompanySectorDialog
            open={editCompanySector}
            setOpen={setEditCompanySector}
            company={company}
          />
        </>
      )}
    </div>
  );
};

export default YourCompanyTab;
