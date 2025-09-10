// src/app/pages/dashboards/ParentStudent/Home.jsx

import { useState } from "react";
import { Page } from "components/shared/Page";
import { PsLink } from "./Perfomance/PsLink";
import { UserCard } from "./Student-card/UserCard";
import { psLinkData } from "./Perfomance/PsLinkData";

export default function Home() {
  const defaultKidId = psLinkData[0].kids[0]?.id;
  const [selectedKidId, setSelectedKidId] = useState(defaultKidId);

  const selectedKid = psLinkData
    .flatMap((entry) => entry.kids)
    .find((kid) => kid.id === selectedKidId);

  return (
    <Page title="Parent Student Performance">
      <div className="transition-content w-full px-6 pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="dark:text-dark-50 mb-4 truncate text-xl font-medium tracking-wide text-gray-800">
            Linked Kids
          </h2>

          <PsLink
            selectedKidId={selectedKidId}
            onKidSelect={(id) => setSelectedKidId(id)}
          />

          {selectedKid && (
            <div className="mt-6 max-w-md">
              <UserCard
                key={selectedKid.id}
                name={selectedKid.name}
                avatar={selectedKid.image}
                role={selectedKid.class} // Grade
                department={selectedKid.section} // Section
                branch={selectedKid.branch} // ✅ Use branch directly
                  dob={selectedKid.dob}              // ✅ now works

                progress={selectedKid.progress || 0}
                badges={selectedKid.badges || []}
                workingHours={selectedKid.workingHours}
                timezone={selectedKid.timezone}
                bloodGroup={selectedKid.bloodGroup}
              />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
