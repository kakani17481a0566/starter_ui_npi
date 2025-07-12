import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import axios from "axios";
import { Button, GhostSpinner } from "components/ui";
import { Transition } from "@headlessui/react";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export function SelectedRowsActions({ table }) {
  const [checkLoading, setCheckLoading] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectedRows = table.getSelectedRowModel().rows;
  const totalSelected = selectedRows.length;

  // Normalize helper
  const normalize = (val) => (val || "").toLowerCase().trim();

  const eligibleForCheckIn = selectedRows.some(({ original }) => {
    const fromTime = normalize(original.fromTime);
    return !fromTime || fromTime === "not marked";
  });

  const eligibleForCheckOut = selectedRows.some(({ original }) => {
    const fromTime = normalize(original.fromTime);
    const toTime = normalize(original.toTime);
    return fromTime && fromTime !== "not marked" && (!toTime || toTime === "not marked");
  });

  const handleBulkCheck = async (type) => {
    setShowConfirmModal(false);
    setCheckLoading(true);

    const now = dayjs().format("HH:mm:ss");
    const today = dayjs().format("YYYY-MM-DD");

    const entries = selectedRows
      .filter(({ original }) => {
        const fromTime = normalize(original.fromTime);
        const toTime = normalize(original.toTime);

        if (type === "in") return !fromTime || fromTime === "not marked";
        if (type === "out") return fromTime && fromTime !== "not marked" && (!toTime || toTime === "not marked");
        return false;
      })
      .map(({ original }) => ({
        studentId: original.studentId,
        ...(type === "in" && { fromTime: now }),
        ...(type === "out" && { toTime: now }),
      }));

    if (!entries.length) {
      setCheckLoading(false);
      toast("No eligible students to mark.", { icon: "⚠️" });
      return;
    }

    const userId = 32;
    const branchId = 1;
    const tenantId = 1;

    const payload = {
      date: today,
      userId,
      branchId,
      tenantId,
      entries,
    };

    try {
      await axios.post(
        "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/StudentAttendance/mark-attendance",
        payload
      );
      toast.success(`✅ Bulk Check-${type === "in" ? "In" : "Out"} successful`);
      table.options.meta?.fetchData?.();
    } catch (err) {
      toast.error(`❌ Failed to check-${type}: ${err.message}`);
      console.error(`Bulk check-${type} failed:`, err);
    } finally {
      setCheckLoading(false);
    }
  };

  const alreadyCheckedIn = selectedRows.filter(({ original }) => {
    const fromTime = normalize(original.fromTime);
    return fromTime && fromTime !== "not marked";
  }).length;

  const alreadyCheckedOut = selectedRows.filter(({ original }) => {
    const toTime = normalize(original.toTime);
    return toTime && toTime !== "not marked";
  }).length;

  const eligibleCount =
    confirmType === "in"
      ? totalSelected - alreadyCheckedIn
      : selectedRows.filter(({ original }) => {
          const fromTime = normalize(original.fromTime);
          const toTime = normalize(original.toTime);
          return fromTime && fromTime !== "not marked" && (!toTime || toTime === "not marked");
        }).length;

  const confirmMessages = {
    pending: {
      title: "Confirm Bulk Marking",
      description: `You selected ${totalSelected} students.\n\n` +
        `✔️ Already Checked-In: ${alreadyCheckedIn}\n` +
        `✔️ Already Checked-Out: ${alreadyCheckedOut}\n\n` +
        `👉 Eligible for ${confirmType === "in" ? "Check-In" : "Check-Out"}: ${eligibleCount}`,
      actionText: confirmType === "in" ? "Confirm Check-In" : "Confirm Check-Out",
    },
  };

  return (
    <>
      <Transition show={showConfirmModal} as={Fragment}>
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      </Transition>

      <Transition
        as={Fragment}
        show={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
        enter="transition-all duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="pointer-events-none sticky inset-x-0 bottom-0 z-50 flex items-center justify-end">
          <div className="w-full max-w-xl px-2 py-4 sm:absolute sm:-translate-y-1/2 sm:px-4">
            <div className="pointer-events-auto flex items-center justify-between rounded-lg px-3 py-2 font-medium dark:bg-dark-50 dark:text-dark-900 sm:px-4 sm:py-3">
              <p>
                <span>{totalSelected} Selected</span>
                <span className="max-sm:hidden"> from {table.getCoreRowModel().rows.length}</span>
              </p>

              <div className="flex space-x-1.5">
                <Button
                  onClick={() => {
                    setConfirmType("in");
                    setShowConfirmModal(true);
                  }}
                  className="space-x-1.5 rounded-full px-3 py-1.5 text-xs-plus sm:rounded-sm"
                  color="success"
                  disabled={checkLoading || !eligibleForCheckIn}
                >
                  {checkLoading && confirmType === "in" ? (
                    <GhostSpinner className="size-3.5 shrink-0 border-2" variant="soft" />
                  ) : (
                    <ArrowDownCircleIcon className="size-4 text-primary-600" />
                  )}
                  <span>Check-In All</span>
                </Button>

                <Button
                  onClick={() => {
                    setConfirmType("out");
                    setShowConfirmModal(true);
                  }}
                  className="space-x-1.5 rounded-full px-3 py-1.5 text-xs-plus sm:rounded-sm"
                  color="warning"
                  disabled={checkLoading || !eligibleForCheckOut}
                >
                  {checkLoading && confirmType === "out" ? (
                    <GhostSpinner className="size-3.5 shrink-0 border-2" variant="soft" />
                  ) : (
                    <ArrowUpCircleIcon className="size-4 text-primary-600" />
                  )}
                  <span>Check-Out All</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        messages={confirmMessages}
        onOk={() => handleBulkCheck(confirmType)}
        confirmLoading={checkLoading}
        state="pending"
      />
    </>
  );
}

SelectedRowsActions.propTypes = {
  table: PropTypes.object.isRequired,
};
