// Basket.jsx

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

// Local Imports
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { BasketSelector } from "./BasketSelector";
import { BasketActions } from "./BasketActions";
import { Items } from "./Items";
import { AssignSection } from "./AssignSection";
import { useDisclosure } from "hooks";
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Basket({
  items = [],
  onRemove,
  onClearBasket,
  onAssignBooks,
  onIncrease,
  onDecrease,
  selectedStudent,
  onSelectStudent,
}) {
  const { smAndUp } = useBreakpointsContext();

  return smAndUp ? (
    <DesktopView
      items={items}
      onRemove={onRemove}
      onClearBasket={onClearBasket}
      onAssignBooks={onAssignBooks}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      selectedStudent={selectedStudent}
      onSelectStudent={onSelectStudent}
    />
  ) : (
    <MobileView
      items={items}
      onRemove={onRemove}
      onClearBasket={onClearBasket}
      onAssignBooks={onAssignBooks}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      selectedStudent={selectedStudent}
      onSelectStudent={onSelectStudent}
    />
  );
}

function MobileView({
  items,
  onRemove,
  onClearBasket,
  onAssignBooks,
  onIncrease,
  onDecrease,
  selectedStudent,
  onSelectStudent,
}) {
  const [isBasketOpen, { open, close }] = useDisclosure(false);
  const totalBooks = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <>
      {/* Floating button with live total */}
      <div className="fixed bottom-3 right-3 rounded-full bg-white dark:bg-dark-700">
        <Button
          onClick={open}
          isIcon
          color="secondary"
          className="size-14 rounded-full"
        >
          {totalBooks}
        </Button>
      </div>

      <Transition appear show={isBasketOpen} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={close}>
          {/* Overlay */}
          <TransitionChild as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
          </TransitionChild>

          {/* Slide-up panel */}
          <TransitionChild as={Fragment}
            enter="ease-out transform-gpu duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in transform-gpu duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="fixed bottom-0 left-0 flex h-[calc(100%-2.5rem)] w-full flex-col rounded-t-2xl bg-white px-4 py-3 dark:bg-dark-700">

              {/* Header */}
              <div className="-mx-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={close}
                    variant="flat"
                    isIcon
                    className="size-7 rounded-full"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                  <BasketSelector />
                  {selectedStudent?.label && (
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      → {selectedStudent.label}
                    </span>
                  )}
                </div>
                <BasketActions onClearBasket={onClearBasket} />
              </div>

              {/* Items list */}
              <div className="flex grow flex-col overflow-y-auto pt-4">
                <Items
                  items={items}
                  onRemove={onRemove}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                />
              </div>

              {/* Assign books */}
              <AssignSection
                items={items}
                onAssignBooks={onAssignBooks}
                selectedStudent={selectedStudent}
                onSelectStudent={onSelectStudent}
              />
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}

function DesktopView({
  items,
  onRemove,
  onClearBasket,
  onAssignBooks,
  onIncrease,
  onDecrease,
  selectedStudent,
  onSelectStudent,
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BasketSelector />
          {selectedStudent?.label && (
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              → {selectedStudent.label}
            </span>
          )}
        </div>
        <BasketActions onClearBasket={onClearBasket} />
      </div>

      {/* Items + Assign Section */}
      <Card className="mt-3 p-4 sm:p-5">
        <Items
          items={items}
          onRemove={onRemove}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
        <AssignSection
          items={items}
          onAssignBooks={onAssignBooks}
          selectedStudent={selectedStudent}
          onSelectStudent={onSelectStudent}
        />
      </Card>
    </div>
  );
}
