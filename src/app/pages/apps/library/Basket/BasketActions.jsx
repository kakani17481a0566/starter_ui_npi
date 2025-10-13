// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function BasketActions({ onAddBasket, onClearBasket }) {
  return (
    <div className="flex gap-1">
      {/* ➕ Add new basket */}
      <Button
        aria-label="Add new basket"
        variant="flat"
        isIcon
        className="size-7 rounded-full"
        onClick={onAddBasket}
      >
        {/* <PlusIcon className="size-1" /> */}
      </Button>

      {/* 🗑 Clear current basket */}
      <Button
        aria-label="Clear basket"
        variant="flat"
        isIcon
        className="group size-7 rounded-full"
        onClick={onClearBasket}
      >
        <TrashIcon className="size-5 transition-colors group-hover:text-error" />
      </Button>

      {/* ⋮ Extra menu actions */}
      {/* <MenuAction onMenuAction={onMenuAction} /> */}
    </div>
  );
}

BasketActions.propTypes = {
  onAddBasket: PropTypes.func,
  onClearBasket: PropTypes.func,
  onMenuAction: PropTypes.func,
};

// ----------------------------------------------------------------------

export function MenuAction({ onMenuAction }) {
  const actions = [
    { id: "save", label: "Save Basket" },
    { id: "load", label: "Load Basket" },
    { id: "share", label: "Share Basket" },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as={Button}
        aria-label="More basket actions"
        variant="flat"
        isIcon
        className="size-7 rounded-full"
      >
        <EllipsisVerticalIcon className="size-5" />
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-soft shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          {actions.map((action) => (
            <MenuItem key={action.id}>
              {({ focus }) => (
                <button
                  onClick={() => onMenuAction?.(action.id)}
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                  )}
                >
                  <span>{action.label}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

MenuAction.propTypes = {
  onMenuAction: PropTypes.func,
};
