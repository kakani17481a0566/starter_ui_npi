// src/app/pages/FrontDesk/Components/PostalDelivery.jsx

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  ArrowsUpDownIcon,
  PaperAirplaneIcon,
  InboxArrowDownIcon,
  UserIcon,
  TagIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  HashtagIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner"; // ✅ Toasts

// Local Imports
import { Button, Card, Input, Select } from "components/ui";

// ----------------------------------------------------------------------

export function PostalDelivery({ onParcelReceived }) {
  const [mode, setMode] = useState("send");
  const [postalItems, setPostalItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Send form states
  const [sender, setSender] = useState("");
  const [receiverSend, setReceiverSend] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState(0);

  // 🔹 Receive form states
  const [receiver, setReceiver] = useState("");
  const [parcelId, setParcelId] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [remarks, setRemarks] = useState("");

  // 🔹 Fetch postal items from API
  useEffect(() => {
    async function fetchPostalItems() {
      try {
        const res = await axios.get("https://localhost:7202/api/PostalItems");
        setPostalItems(res.data?.data || []); // expecting {id, name}
      } catch (err) {
        console.error("Failed to fetch postal items:", err);
        // fallback if API fails
        setPostalItems([
          { id: 1, name: "Letter" },
          { id: 2, name: "Parcel" },
          { id: 3, name: "Document" },
          { id: 4, name: "Package" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchPostalItems();
  }, []);

  // 🔹 Handle Confirm Send
  const handleConfirmSend = () => {
    if (!sender || !receiverSend) {
      toast.error("Sender and Receiver names are required!");
      return;
    }

    const newDelivery = {
      sender_name: sender,
      receiver_name: receiverSend,
      postal_item: selectedItem || "N/A",
      quantity: qty,
      amount,
      status: "Sent",
      created_on: new Date().toISOString(),
    };

    toast.success(`Parcel sent to ${receiverSend} successfully!`);
    console.log("Send Parcel:", newDelivery);

    // reset
    setSender("");
    setReceiverSend("");
    setSelectedItem("");
    setQty(1);
    setAmount(0);
  };

  // 🔹 Handle Confirm Receive
  const handleConfirmReceive = () => {
    if (!parcelId || !receiver) {
      toast.error("Receiver name and Parcel ID are required!");
      return;
    }

    const newParcel = {
      parcel_id: parcelId,
      receiver_name: receiver,
      sender_name: "Unknown",
      postal_item: "N/A",
      amount: 0,
      status: "Received",
      created_on: dateReceived || new Date().toISOString(),
      remarks,
    };

    onParcelReceived?.(newParcel);

    toast.success(`Parcel ${parcelId} received successfully!`);

    // reset
    setReceiver("");
    setParcelId("");
    setDateReceived("");
    setRemarks("");
  };

  return (
    <Card className="px-3 pb-4 sm:px-4">
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between py-2">
        <h2 className="truncate text-sm font-medium text-gray-800 dark:text-dark-100">
          Postal Delivery Handling
        </h2>
        <ActionMenu />
      </div>

      {/* Toggle Tabs */}
      <div className="rounded-md bg-gray-150 text-gray-600 dark:bg-dark-800 dark:text-dark-200">
        <RadioGroup
          value={mode}
          onChange={setMode}
          as="div"
          className="flex px-1 py-1"
        >
          <Radio
            value="send"
            className={({ checked }) =>
              clsx(
                "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium",
                checked
                  ? "bg-white text-primary-600 shadow-sm dark:bg-surface-2 dark:text-primary-400"
                  : "hover:text-dark-800 dark:hover:text-dark-100"
              )
            }
          >
            <PaperAirplaneIcon className="size-4" />
            Send Parcel
          </Radio>
          <Radio
            value="receive"
            className={({ checked }) =>
              clsx(
                "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium",
                checked
                  ? "bg-white text-primary-600 shadow-sm dark:bg-surface-2 dark:text-primary-400"
                  : "hover:text-dark-800 dark:hover:text-dark-100"
              )
            }
          >
            <InboxArrowDownIcon className="size-4" />
            Receive Parcel
          </Radio>
        </RadioGroup>
      </div>

      {/* Conditional Forms */}
      {mode === "send" ? (
        // --- SEND PARCEL FORM ---
        <div className="relative mt-3 space-y-3">
          <Field
            label="Sender Name"
            icon={<UserIcon className="size-4 text-primary-600" />}
          >
            <Input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              classNames={{ root: "w-full mt-1", input: "h-8 text-sm px-2" }}
              placeholder="Enter sender name"
            />
          </Field>

          <Field
            label="Receiver Name"
            icon={<UserIcon className="size-4 text-primary-600" />}
          >
            <Input
              value={receiverSend}
              onChange={(e) => setReceiverSend(e.target.value)}
              classNames={{ root: "w-full mt-1", input: "h-8 text-sm px-2" }}
              placeholder="Enter receiver name"
            />
          </Field>

          {/* Compact Row: Postal Item + Qty + Amount */}
          <div className="flex gap-2">
            <div className="flex-[2]">
              <Field
                label="Postal Item"
                icon={<CubeIcon className="size-4 text-primary-600" />}
              >
                <Select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  classNames={{
                    root: "w-full mt-1",
                    select:
                      "h-8 rounded-md border-gray-200 text-sm dark:border-dark-500",
                  }}
                  disabled={loading}
                >
                  {postalItems.length > 0 ? (
                    postalItems.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No items available</option>
                  )}
                </Select>
              </Field>
            </div>

            <div className="flex-1">
              <Field
                label="Qty"
                icon={<HashtagIcon className="size-4 text-primary-600" />}
              >
                <Input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  classNames={{
                    root: "w-full mt-1",
                    input: "h-8 text-sm px-2 text-end",
                  }}
                  placeholder="0"
                  type="number"
                />
              </Field>
            </div>

            <div className="flex-1">
              <Field
                label="Amount"
                icon={<CurrencyRupeeIcon className="size-4 text-primary-600" />}
              >
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  classNames={{
                    root: "w-full mt-1",
                    input: "h-8 text-sm px-2 text-end",
                  }}
                  placeholder="₹0.00"
                  type="number"
                />
              </Field>
            </div>
          </div>

          {/* Swap Button */}
          <div className="absolute top-1/2 -mt-2 ltr:right-0 rtl:left-0">
            <Button
              isIcon
              color="primary"
              className="mask is-hexagon size-6"
              onClick={() => {
                setSender(receiverSend);
                setReceiverSend(sender);
              }}
            >
              <ArrowsUpDownIcon className="size-3.5" />
            </Button>
          </div>

          <Button
            onClick={handleConfirmSend}
            color="primary"
            className="mt-4 h-8 w-full text-sm"
          >
            Confirm Delivery
          </Button>
        </div>
      ) : (
        // --- RECEIVE PARCEL FORM ---
        <div className="mt-3 space-y-3">
          <Field
            label="Receiver Name"
            icon={<UserIcon className="size-4 text-primary-600" />}
          >
            <Input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              classNames={{ root: "w-full mt-1", input: "h-8 text-sm px-2" }}
              placeholder="Enter receiver name"
            />
          </Field>

          <Field
            label="Parcel ID"
            icon={<TagIcon className="size-4 text-primary-600" />}
          >
            <Input
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              classNames={{ root: "w-full mt-1", input: "h-8 text-sm px-2" }}
              placeholder="Enter parcel tracking ID"
            />
          </Field>

          <Field
            label="Date Received"
            icon={<CalendarIcon className="size-4 text-primary-600" />}
          >
            <Input
              value={dateReceived}
              onChange={(e) => setDateReceived(e.target.value)}
              classNames={{ root: "w-full mt-1", input: "h-8 text-sm px-2" }}
              type="date"
            />
          </Field>

          <Field
            label="Remarks"
            icon={
              <ChatBubbleLeftRightIcon className="size-4 text-primary-600" />
            }
          >
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              classNames={{ root: "w-full mt-1", input: "h-8 text-sm px-2" }}
              placeholder="Any remarks..."
            />
          </Field>

          <Button
            onClick={handleConfirmReceive}
            color="primary"
            className="mt-4 h-8 w-full text-sm"
          >
            Confirm Received
          </Button>
        </div>
      )}
    </Card>
  );
}

/* Reusable Field wrapper with icon + label */
function Field({ label, icon, children }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs font-medium">
        {icon}
        {label}
      </p>
      {children}
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-7 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition as={Fragment}>
        <MenuItems className="absolute z-100 mt-1.5 min-w-[9rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-dark-500 dark:bg-dark-700">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-8 w-full items-center px-3 text-sm",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                Track Parcel
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-8 w-full items-center px-3 text-sm",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                Delivery History
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
