// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function BasketSelector({ currentDraft, drafts = [], onSelectDraft }) {
  const active = drafts.find((d) => d.id === currentDraft);

  return (
    <div className="flex items-center gap-2">
      {/* Active draft label */}
      <div className="min-w-0">
        <span className="truncate text-base font-medium leading-none text-gray-800 dark:text-dark-100">
          {active?.label || "No Draft"}
        </span>{" "}
        <span>#{active?.id || "000"}</span>
      </div>

      {/* 🔹 Quantity badge */}
      {active?.quantity > 0 && (
        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-dark-500 dark:text-primary-400">
          {active.quantity}
        </span>
      )}

      <BasketSelectorMenu drafts={drafts} onSelectDraft={onSelectDraft} />
    </div>
  );
}

BasketSelector.propTypes = {
  currentDraft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  drafts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      quantity: PropTypes.number,
    })
  ),
  onSelectDraft: PropTypes.func,
};

// ----------------------------------------------------------------------

function BasketSelectorMenu({ drafts, onSelectDraft }) {
  if (!drafts.length) return null; // no drafts → no menu

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as={Button}
        aria-label="Select draft"
        variant="flat"
        isIcon
        className="size-7 rounded-full"
      >
        <ChevronDownIcon className="size-5" />
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[12rem] rounded-lg border border-gray-300 bg-white py-1 shadow-soft shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          {drafts.map((draft) => (
            <MenuItem key={draft.id}>
              {({ focus }) => (
                <button
                  onClick={() => onSelectDraft?.(draft.id)}
                  className={clsx(
                    "flex h-9 w-full items-center justify-between px-3 tracking-wide outline-hidden transition-colors",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100"
                  )}
                >
                  <span>
                    {draft.label} #{draft.id}
                  </span>
                  {draft.quantity > 0 && (
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-dark-500 dark:text-dark-100">
                      {draft.quantity}
                    </span>
                  )}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

BasketSelectorMenu.propTypes = {
  drafts: PropTypes.array,
  onSelectDraft: PropTypes.func,
};
