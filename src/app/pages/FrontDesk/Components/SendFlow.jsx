// Import Dependencies
import { Fragment, useState } from "react";
import Cleave from "cleave.js/react";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline"; // ✅ Icons

// Local Imports
import { Button, Card, Input, Select } from "components/ui";

// ----------------------------------------------------------------------
// Mock contacts with UPI + Card Details
const contacts = [
  {
    uid: "1",
    name: "John Doe",
    upi: "john@upi",
    cardDetails: {
      cardNumber: "4111 1111 1111 1111",
      cardHolder: "John Doe",
    },
  },
  {
    uid: "2",
    name: "Samantha Shelton",
    upi: "samantha@upi",
    cardDetails: {
      cardNumber: "5500 0000 0000 0004",
      cardHolder: "Samantha Shelton",
    },
  },
  {
    uid: "3",
    name: "Corey Evans",
    upi: "corey@upi",
    cardDetails: {
      cardNumber: "3400 0000 0000 009",
      cardHolder: "Corey Evans",
    },
  },
  {
    uid: "4",
    name: "Lance Tucker",
    upi: "lance@upi",
    cardDetails: {
      cardNumber: "6011 0000 0000 0004",
      cardHolder: "Lance Tucker",
    },
  },
];

// ----------------------------------------------------------------------
// SendFlow Component
// ----------------------------------------------------------------------

export function SendFlow() {
  const [method, setMethod] = useState("Credit / Debit Card");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("₹"); // default INR
  const [description, setDescription] = useState("");

  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [upiId, setUpiId] = useState("");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const total = Number(amount) || 0;

  // Handle receiver change
  const handleReceiverChange = (id) => {
    setReceiverId(id);
    const contact = contacts.find((c) => c.uid === id);
    if (contact) {
      setReceiverName(contact.name);
      setReceivedBy(contact.name);
      setUpiId(contact.upi);

      if (contact.cardDetails) {
        setCardNumber(contact.cardDetails.cardNumber);
        setCardHolder(contact.cardDetails.cardHolder);
      }
    }
  };

  // Prepare JSON payload
  const handleSend = () => {
    const payload = {
      payTo: {
        receiverId,
        receiverName,
        receivedBy,
        upiId,
      },
      method,
      amount,
      currency,
      description,
      ...(method === "Credit / Debit Card" && {
        cardDetails: { cardNumber, cardHolder },
      }),
      ...(method === "Cash" && { cashReceivedBy: receivedBy }),
    };
    console.log("💾 Payload JSON:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <Card className="col-span-12 px-4 pb-5 sm:px-5 lg:col-span-4">
      <div className="flex items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-dark-700 dark:text-gray-100">
          Send Money
        </h2>
        <ActionMenu />
      </div>

      {/* ✅ Pay To Section */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label className="mb-1 block text-sm font-medium">Pay To</label>
          <select
            value={receiverId}
            onChange={(e) => handleReceiverChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-2 text-sm dark:border-dark-500 dark:bg-dark-700"
          >
            <option value="">Select Receiver</option>
            {contacts.map((c) => (
              <option key={c.uid} value={c.uid}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-6">
          <Input
            label="Receiver Name"
            placeholder="Auto-filled"
            value={receiverName}
            readOnly
          />
        </div>
      </div>

      {/* Conditional input for method */}
      <div className="mt-4 space-y-4">
        {method === "Credit / Debit Card" ? (
          <>
            <Input
              label="Card Number"
              component={Cleave}
              options={{ creditCard: true }}
              placeholder="**** **** **** ****"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Input
              label="Card Holder"
              placeholder="Enter card holder name"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
          </>
        ) : method === "UPI" ? (
          <Input
            label="UPI ID"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        ) : (
          <Input
            label="Received By"
            placeholder="Auto-filled"
            value={receivedBy}
            readOnly
          />
        )}
      </div>

      {/* ✅ Payment Method Dropdown */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium">Payment Method</label>
        <Basic value={method} onChange={setMethod} />
      </div>

      {/* Amount input */}
      <div className="mt-4">
        <label htmlFor="amount">Amount</label>
        <div className="mt-1.5 flex -space-x-px">
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            classNames={{
              root: "relative hover:z-1 focus:z-1",
              select: "ltr:rounded-r-none rtl:rounded-l-none",
            }}
          >
            <option value="₹">₹</option>
            <option value="$">$</option>
            <option value="€">€</option>
            <option value="£">£</option>
          </Select>
          <Input
            id="amount"
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            classNames={{
              root: "relative flex-1 hover:z-1 focus:z-1",
              input: "ltr:rounded-l-none rtl:rounded-r-none",
            }}
          />
        </div>
      </div>

      {/* ✅ Description */}
      <div className="mt-4">
        <Input
          label="Description"
          placeholder="Add a note (e.g. Rent, Lunch, Gift...)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Total only */}
      <div className="mt-5 flex justify-between">
        <p>Total:</p>
        <p className="font-medium text-gray-800 dark:text-dark-100">
          {currency} {total}
        </p>
      </div>

      <Button
        color="primary"
        className="mt-4 h-10 w-full"
        onClick={handleSend}
      >
        Send Money
      </Button>
    </Card>
  );
}

// ----------------------------------------------------------------------
// ActionMenu Component
// ----------------------------------------------------------------------

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
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 w-full rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg dark:border-dark-500 dark:bg-dark-700">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

// ----------------------------------------------------------------------
// ✅ Reusable Payment Method Dropdown with Icons
// ----------------------------------------------------------------------

export function Basic({ value, onChange }) {
  const methods = [
    {
      label: "Credit / Debit Card",
      icon: CreditCardIcon,
    },
    {
      label: "UPI",
      icon: QrCodeIcon,
    },
    {
      label: "Cash",
      icon: BanknotesIcon,
    },
  ];

  return (
    <Menu as="div" className="relative inline-block w-full">
      <MenuButton as={Button} className="flex w-full justify-between px-3 py-2">
        {({ open }) => (
          <>
            <span>{value}</span>
            <ChevronDownIcon
              className={clsx(
                "size-4 transition-transform",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </>
        )}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-[100] mt-1.5 w-full rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg dark:border-dark-500 dark:bg-dark-700">
          {methods.map((m) => (
            <MenuItem key={m.label}>
              {({ focus }) => (
                <button
                  onClick={() => onChange(m.label)}
                  className={clsx(
                    "flex h-9 w-full items-center gap-2 px-3 transition-colors",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                  )}
                >
                  <m.icon className="size-5 text-primary-500" /> {/* ✅ Icon */}
                  {m.label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
