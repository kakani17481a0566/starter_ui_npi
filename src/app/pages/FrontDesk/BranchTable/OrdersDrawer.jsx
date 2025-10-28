// ----------------------------------------------------------------------
// Branch Drawer (editable inline + real API update with session data)
// ----------------------------------------------------------------------
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  PhoneIcon,
  MapPinIcon,
  MapIcon,
  IdentificationIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "sonner";

// Local Imports
import {
  Avatar,
  Badge,
  Button,
  Table,
  Tag,
  THead,
  TBody,
  Th,
  Tr,
  Td,
} from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

const cols = ["Field", "Value"];

export function BranchDrawer({ isOpen, close, row }) {
  const original = row?.original ?? {};
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState({ ...original });
  const { locale } = useLocaleContext();

  const ts = branch.createdOn ? dayjs(branch.createdOn) : null;
  const date = ts ? ts.locale(locale).format("DD MMM YYYY") : "-";
  const time = ts ? ts.locale(locale).format("hh:mm A") : "-";

  const iconMap = {
    Contact: PhoneIcon,
    Pincode: MapIcon,
    District: MapIcon,
    State: MapPinIcon,
    "Tenant ID": IdentificationIcon,
    "Created By": UserCircleIcon,
  };

  const fields = [
    { key: "contact", label: "Contact" },
    { key: "pincode", label: "Pincode" },
    { key: "district", label: "District" },
    { key: "state", label: "State" },
    { key: "tenantId", label: "Tenant ID" },
    { key: "createdBy", label: "Created By" },
  ];

  // ✅ Save changes to backend using session
  const handleSave = async () => {
    try {
      setLoading(true);

      const session = getSessionData();
      const token = session.token;
      const tenantId = session.tenantId;
      const userId = session.userId;

      const payload = {
        name: branch.name,
        contact: branch.contact,
        address: branch.address,
        pincode: branch.pincode,
        district: branch.district,
        state: branch.state,
        updatedBy: Number(userId) || 1,
        updatedOn: new Date().toISOString(),
      };

      const url = `https://localhost:7202/api/Branch/${branch.id}/${tenantId}`;

      const res = await axios.put(url, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 200 || res.status === 204) {
        toast.success("Branch details updated successfully!");
        setEditable(false);
      } else {
        toast.error("Failed to update branch.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating branch.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setBranch({ ...original });
    setEditable(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={close}>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40"
        />

        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed right-0 top-0 flex h-full w-full max-w-xl transform-gpu flex-col bg-white py-4 transition-transform duration-200 dark:bg-dark-700"
        >
          {/* Header */}
          <div className="flex justify-between px-4 sm:px-5">
            <div>
              <div className="font-semibold">Branch ID:</div>
              <div className="text-xl font-medium text-primary-600 dark:text-primary-400">
                {branch.id} &nbsp;
                {branch.state && (
                  <Badge className="align-text-bottom" color="primary">
                    {branch.state}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={close}
              variant="flat"
              isIcon
              className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
            >
              <XMarkIcon className="size-5" />
            </Button>
          </div>

          {/* Top Section */}
          <div className="mt-3 flex w-full justify-between px-4 sm:px-5">
            <div className="flex flex-col">
              <div className="mb-1.5 font-semibold">Branch:</div>
              <Avatar
                size={16}
                name={branch.name}
                initialColor="auto"
                classNames={{
                  display: "mask is-squircle rounded-none text-xl",
                }}
              />
              <div className="mt-1.5 text-lg font-medium text-gray-800 dark:text-dark-50">
                {editable ? (
                  <input
                    type="text"
                    value={branch.name || ""}
                    onChange={(e) =>
                      setBranch({ ...branch, name: e.target.value })
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 dark:border-dark-500 dark:bg-dark-600 dark:text-dark-50 w-full"
                  />
                ) : (
                  branch.name
                )}
              </div>
              {branch.district && !editable && (
                <div className="mt-1">
                  <Tag>{branch.district}</Tag>
                </div>
              )}
            </div>
            <div className="text-end">
              <div className="font-semibold">Created On:</div>
              <div className="mt-1.5">
                <p className="font-medium">{date}</p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                  {time}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mt-1 px-4 sm:px-5">
            <div className="font-semibold">Address:</div>
            {editable ? (
              <input
                type="text"
                value={branch.address || ""}
                onChange={(e) =>
                  setBranch({ ...branch, address: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 dark:border-dark-500 dark:bg-dark-600 dark:text-dark-50"
              />
            ) : (
              <p className="mt-1">{branch.address || "-"}</p>
            )}
          </div>

          <hr
            className="mx-4 my-4 h-px border-gray-150 dark:border-dark-500 sm:mx-5"
            role="none"
          />

          {/* Details Table */}
          <p className="px-4 font-medium text-gray-800 dark:text-dark-100 sm:px-5">
            Branch details:
          </p>

          <div className="mt-1 grow overflow-x-auto overscroll-x-contain px-4 sm:px-5">
            <Table
              hoverable
              className="w-full text-left text-sm rtl:text-right [&_.table-td]:py-2"
            >
              <THead>
                <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                  {cols.map((title, index) => (
                    <Th
                      key={index}
                      className="py-2 font-semibold uppercase text-gray-800 first:px-0 last:px-0 dark:text-dark-100"
                    >
                      {title}
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                {fields.map(({ key, label }) => {
                  const Icon = iconMap[label];
                  const value = branch[key] ?? "-";
                  return (
                    <Tr
                      key={label}
                      className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                    >
                      <Td className="px-0 font-medium ltr:rounded-l-lg rtl:rounded-r-lg">
                        <div className="flex items-center space-x-2">
                          <div className="size-8 flex items-center justify-center rounded-sm bg-gray-100 dark:bg-dark-600">
                            {Icon && (
                              <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            )}
                          </div>
                          <span>{label}</span>
                        </div>
                      </Td>
                      <Td>
                        {editable && key !== "tenantId" && key !== "createdBy" ? (
                          <input
                            type="text"
                            value={value === "-" ? "" : value}
                            onChange={(e) =>
                              setBranch({ ...branch, [key]: e.target.value })
                            }
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-800 dark:border-dark-500 dark:bg-dark-600 dark:text-dark-50"
                          />
                        ) : (
                          value
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end px-4 sm:px-5 pb-4">
            <div className="mt-4 w-full max-w-xs text-end">
              <div className="mt-2 flex justify-end space-x-3">
                {editable ? (
                  <>
                    <Tag
                      component="button"
                      onClick={handleCancel}
                      className="min-w-[6rem] px-5 py-2.5 text-base font-medium border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-dark-500"
                    >
                      Cancel
                    </Tag>
                    <Tag
                      component="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="min-w-[6rem] px-5 py-2.5 text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      {loading ? "Saving..." : "Save"}
                    </Tag>
                  </>
                ) : (
                  <>
                    <Tag
                      component="button"
                      onClick={() => setEditable(true)}
                      className="min-w-[6rem] px-5 py-2.5 text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Edit
                    </Tag>
                    <Tag
                      component="button"
                      onClick={close}
                      className="min-w-[6rem] px-5 py-2.5 text-base font-medium border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-dark-500"
                    >
                      Cancel
                    </Tag>
                  </>
                )}
              </div>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

BranchDrawer.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  row: PropTypes.object,
};
