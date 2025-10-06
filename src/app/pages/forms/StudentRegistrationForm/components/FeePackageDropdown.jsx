// src/app/pages/forms/StudentRegistrationForm/components/FeePackageDropdown.jsx

import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import axios from "axios";

export function FeePackageDropdown({
  onSelect,
  value,
  className,
  disabled = false,
  tenantId = 1,
  branchId = 1,
}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(value || null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `https://localhost:7202/api/FeePackage/grouped/${tenantId}/${branchId}`,
        );

        if (res.data?.data) {
          setPackages(res.data.data);
        } else {
          setError("No data received from server");
        }
      } catch (err) {
        console.error("Failed to fetch fee packages", err);
        setError(err.response?.data?.message || "Failed to load fee packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [tenantId, branchId]);

  // Keep in sync with parent prop
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (pkg) => {
    setSelected(pkg);
    onSelect?.(pkg);
    setSearchTerm("");
  };

  // 🔹 Improved search and filtering
  const filteredPackages = useMemo(() => {
    if (!packages.length) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();

    return packages.filter(pkg => {
      // Check if package matches search
      const packageMatches =
        pkg.packageName.toLowerCase().includes(lowerSearchTerm) ||
        pkg.courseName.toLowerCase().includes(lowerSearchTerm);

      // Check if any item matches search
      const itemMatches = pkg.items.some(item =>
        item.feeStructureName.toLowerCase().includes(lowerSearchTerm) ||
        item.paymentPeriodName.toLowerCase().includes(lowerSearchTerm)
      );

      return packageMatches || itemMatches;
    });
  }, [packages, searchTerm]);

  const displayText = selected
    ? `${selected.packageName} (${selected.courseName})`
    : loading
    ? "Loading fee packages..."
    : error
    ? "Error loading packages"
    : "Select Fee Package";

  const hasSearchResults = filteredPackages.length > 0;

  if (error && !loading) {
    return (
      <div className={clsx("max-w-lg", className)}>
        <div className="flex items-center gap-2 p-3 border border-red-300 rounded-md bg-red-50 text-red-700">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("max-w-lg", className)}>
      <Menu as="div" className="relative inline-block text-start w-full">
        <MenuButton
          as="button"
          type="button"
          disabled={disabled || loading}
          className={clsx(
            "flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-colors",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "dark:border-dark-500 dark:bg-dark-700 dark:text-dark-200",
            (disabled || loading) && "opacity-50 cursor-not-allowed bg-gray-100",
            !disabled && "text-gray-700",
            error && "border-red-300 bg-red-50"
          )}
        >
          <span className={clsx("truncate", !selected && "text-gray-500")}>
            {displayText}
          </span>
          <ChevronDownIcon
            className={clsx(
              "size-4 flex-shrink-0 ml-2 transition-transform",
              (disabled || loading) && "text-gray-400"
            )}
          />
        </MenuButton>

        {!loading && packages.length > 0 && (
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg
                         dark:border-dark-500 dark:bg-dark-700
                         max-h-80 overflow-y-auto focus:outline-none"
            >
              {/* Search box */}
              <div className="p-2 border-b border-gray-200 dark:border-dark-500">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-600 dark:border-dark-400 dark:text-dark-200"
                  />
                </div>
              </div>

              {!hasSearchResults && searchTerm && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No packages found for &ldquo;{searchTerm}&rdquo;
                </div>
              )}

              {hasSearchResults && filteredPackages.map((pkg) => (
                <div key={pkg.packageMasterId} className="p-2">
                  <div
                    className="sticky top-0 z-10 bg-white px-2 py-1 text-xs font-semibold
                               text-gray-500 dark:bg-dark-700 dark:text-dark-200 border-b border-gray-200 dark:border-dark-500"
                  >
                    {pkg.packageName} ({pkg.courseName})
                  </div>
                  {pkg.items.map((item) => (
                    <MenuItem key={item.id}>
                      {({ focus }) => (
                        <button
                          type="button"
                          onClick={() => handleSelect(pkg)} // Pass the full package
                          className={clsx(
                            "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                            focus
                              ? "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                              : "text-gray-700 dark:text-dark-200",
                            selected?.packageMasterId === pkg.packageMasterId &&
                              "bg-blue-100 text-blue-900 dark:bg-blue-900/30 font-semibold"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.feeStructureName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-dark-400">
                              ₹{item.amount.toLocaleString()} •{" "}
                              {item.paymentPeriodName}
                            </span>
                          </div>
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              ))}
            </MenuItems>
          </Transition>
        )}
      </Menu>

      {/* Loading state */}
      {loading && (
        <div className="mt-1 text-sm text-gray-500">
          Loading fee packages...
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && packages.length === 0 && (
        <div className="mt-1 text-sm text-gray-500">
          No fee packages available
        </div>
      )}
    </div>
  );
}

FeePackageDropdown.propTypes = {
  onSelect: PropTypes.func,
  value: PropTypes.shape({
    packageMasterId: PropTypes.number,
    packageName: PropTypes.string,
    courseId: PropTypes.number,
    courseName: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      feeStructureId: PropTypes.number,
      feeStructureName: PropTypes.string,
      amount: PropTypes.number,
      paymentPeriodName: PropTypes.string,
    })),
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  tenantId: PropTypes.number,
  branchId: PropTypes.number,
};

export default FeePackageDropdown;