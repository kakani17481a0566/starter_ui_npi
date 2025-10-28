// src/app/pages/FrontDesk/Branch/index.jsx
import { Page } from "components/shared/Page";
import BranchTable from "./BranchTable";
import { Button } from "components/ui";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { BranchHome } from "./Branch/Home";

export default function Branch() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <Page title="Branch Management">
      <div className="transition-content w-full pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="truncate text-xl font-semibold tracking-wide text-gray-800 dark:text-dark-50">
              Branch Management
            </h2>

            <Button
              color="primary"
              className="flex items-center gap-2 h-9 px-4"
              onClick={() => setShowCreate(true)}
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Branch</span>
            </Button>
          </div>

          {/* ✅ Conditional: show form or table */}
          {showCreate ? (
            <BranchHome
              onCreated={() => setShowCreate(false)}
              onCancel={() => setShowCreate(false)} // ✅ Added
            />
          ) : (
            <BranchTable />
          )}
        </div>
      </div>
    </Page>
  );
}
