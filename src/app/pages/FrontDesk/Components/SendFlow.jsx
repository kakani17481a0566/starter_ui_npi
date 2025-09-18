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
  ArrowRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Card, Input, Select } from "components/ui";

// ----------------------------------------------------------------------

const contacts = [
  { uid: "1", name: "John Doe", avatar: "/images/200x200.png" },
  { uid: "2", name: "Samantha Shelton", avatar: null },
  { uid: "3", name: "Corey Evans", avatar: "/images/200x200.png" },
  { uid: "4", name: "Lance Tucker", avatar: null },
];

// ----------------------------------------------------------------------
// SendFlow Component
// ----------------------------------------------------------------------

export function SendFlow() {
  const [method, setMethod] = useState("Credit / Debit Card"); // default method
  const [amount, setAmount] = useState(0);
  const commission = 3;
  const total = Number(amount) + commission;

  return (
    <Card className="col-span-12 px-4 pb-5 sm:px-5 lg:col-span-4">
      <div className="flex items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-dark-700 dark:text-gray-100">
          Send Money
        </h2>
        <ActionMenu />
      </div>

      {/* Quick contacts */}
      <div className="flex gap-2">
        {contacts.map((contact) => (
          <Avatar
            size={8}
            key={contact.uid}
            src={contact.avatar}
            name={contact.name}
            classNames={{ display: "text-xs-plus" }}
            initialColor="auto"
          />
        ))}
      </div>

      <a
        href="##"
        className="mt-3 inline-flex items-center gap-2 hover:opacity-80"
      >
        <p>View All Contacts</p>
        <ArrowRightIcon className="size-4 rtl:rotate-180" />
      </a>

      {/* ✅ Payment Method Dropdown */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium">
          Payment Method
        </label>
        <Basic value={method} onChange={setMethod} />
      </div>

      {/* Conditional input */}
      <div className="mt-4 space-y-4">
        {method === "Credit / Debit Card" ? (
          <Input
            label="Pay to"
            component={Cleave}
            options={{ creditCard: true }}
            placeholder="**** **** **** ****"
          />
        ) : (
          <Input label="UPI ID" placeholder="example@upi" />
        )}
      </div>

      {/* Amount input */}
      <div className="mt-4">
        <label htmlFor="amount">Amount</label>
        <div className="mt-1.5 flex -space-x-px">
          <Select
            classNames={{
              root: "relative hover:z-1 focus:z-1",
              select: "ltr:rounded-r-none rtl:rounded-l-none",
            }}
          >
            <option>$</option>
            <option>€</option>
            <option>£</option>
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
        />
      </div>

      {/* Commission & Total */}
      <div className="mt-5 flex justify-between text-gray-400 dark:text-dark-300">
        <p className="text-xs-plus">Commission:</p>
        <p>${commission}</p>
      </div>

      <div className="mt-2 flex justify-between">
        <p>Total:</p>
        <p className="font-medium text-gray-800 dark:text-dark-100">
          ${total}
        </p>
      </div>

      {/* CTA */}
      <Button color="primary" className="mt-4 h-10 w-full">
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                )}
              >
                <span>Another action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

// ----------------------------------------------------------------------
// ✅ Reusable Payment Method Dropdown
// ----------------------------------------------------------------------

export function Basic({ value, onChange }) {
  const methods = ["Credit / Debit Card", "UPI"];

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
        <MenuItems className="absolute z-[100] mt-1.5 w-full rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 dark:border-dark-500 dark:bg-dark-700">
          {methods.map((method) => (
            <MenuItem key={method}>
              {({ focus }) => (
                <button
                  onClick={() => onChange(method)}
                  className={clsx(
                    "flex h-9 w-full items-center px-3 transition-colors",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                  )}
                >
                  {method}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
