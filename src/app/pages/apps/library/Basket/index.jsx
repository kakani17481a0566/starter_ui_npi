// ----------------------------------------------------------------------
// 📦 Import Dependencies
// ----------------------------------------------------------------------
import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { BasketSelector } from "./BasketSelector";
import { BasketActions } from "./BasketActions";
import { Items } from "./Items";
import { AssignSection } from "./AssignSection";
import { useDisclosure } from "hooks";
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------
// 🧮 Basket Component
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

  // 📱 Mobile vs Desktop
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

// ----------------------------------------------------------------------
// 📱 Mobile View
// ----------------------------------------------------------------------
function MobileView({
  items = [],
  onRemove,
  onClearBasket,
  onAssignBooks,
  onIncrease,
  onDecrease,
  selectedStudent,
  onSelectStudent,
}) {
  const [isBasketOpen, { open, close }] = useDisclosure(false);
  const totalBooks = items?.length ?? 0;

  return (
    <>
      {/* Floating Basket Button */}
      <div className="fixed bottom-3 right-3 z-[60] rounded-full bg-white dark:bg-dark-700 shadow-lg">
        <Button
          onClick={open}
          isIcon
          color="secondary"
          className="size-14 rounded-full"
          aria-label="Open Basket"
        >
          {totalBooks}
        </Button>
      </div>

      <Transition appear show={isBasketOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={close}>
          {/* Overlay */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-black/40" />
          </TransitionChild>

          {/* Slide-up Panel */}
          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in transform-gpu duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="fixed bottom-0 left-0 flex h-[calc(100%-2.5rem)] w-full flex-col rounded-t-2xl bg-white px-4 py-3 shadow-xl dark:bg-dark-700">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-dark-600 pb-2">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={close}
                    variant="flat"
                    isIcon
                    className="size-7 rounded-full"
                    aria-label="Close Basket"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                  <BasketSelector onSelectStudent={onSelectStudent} />
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

              {/* Assign Section */}
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

// ----------------------------------------------------------------------
// 💻 Desktop View
// ----------------------------------------------------------------------
function DesktopView({
  items = [],
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
          <BasketSelector onSelectStudent={onSelectStudent} />
          {selectedStudent?.label && (
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              → {selectedStudent.label}
            </span>
          )}
        </div>
        <BasketActions onClearBasket={onClearBasket} />
      </div>

      {/* Items + Assign Section */}
      <Card className="mt-3 p-4 sm:p-5 border border-gray-200 dark:border-dark-600 shadow-md">
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
