// src/app/pages/forms/StudentRegistrationForm/sections/FeeStructure.jsx

import FeeTable from "../components/FeeTable";

export default function FeeStructure({ selectedPackage, selectedCorporate }) {
  return (
    <div className="space-y-6">
      {/* 🔹 Table updates dynamically with both package and corporate data */}
      {selectedPackage ? (
        <FeeTable
          selectedPackage={selectedPackage}
          selectedCorporate={selectedCorporate}
        />
      ) : (
        <p className="text-gray-500 dark:text-dark-200">
          Please select a fee package to view details.
        </p>
      )}
    </div>
  );
}