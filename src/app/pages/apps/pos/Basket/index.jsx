import { Fragment, useState } from "react";
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
import { Checkout } from "./Checkout";
import { useDisclosure } from "hooks";
import { Button, Card } from "components/ui";

export function Basket({ items, onIncrease, onDecrease, onRemove, onInvoiceReady }) {
  const { smAndUp } = useBreakpointsContext();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ✅ Totals
  const subtotal = items.reduce((s, i) => s + i.count * Number(i.price || 0), 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return smAndUp ? (
    <DesktopView
      items={items}
      subtotal={subtotal}
      gst={gst}
      total={total}
      selectedStudent={selectedStudent}
      onSelectStudent={setSelectedStudent}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onRemove={onRemove}
      onInvoiceReady={onInvoiceReady} // ✅ forward to desktop
    />
  ) : (
    <MobileView
      items={items}
      subtotal={subtotal}
      gst={gst}
      total={total}
      selectedStudent={selectedStudent}
      onSelectStudent={setSelectedStudent}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onRemove={onRemove}
      onInvoiceReady={onInvoiceReady} // ✅ forward to mobile
    />
  );
}

// ----------------------------------------------------------------------
// 📱 Mobile View
// ----------------------------------------------------------------------
function MobileView({
  items,
  subtotal,
  gst,
  total,
  selectedStudent,
  onSelectStudent,
  onIncrease,
  onDecrease,
  onRemove,
  onInvoiceReady, // ✅ added here
}) {
  const [isBasketOpen, { close, open }] = useDisclosure(false);

  return (
    <>
      {/* Floating Basket Button */}
      <div className="fixed bottom-5 right-5 z-[60]">
        <Button
          onClick={open}
          variant="solid"
          size="lg"
          className="rounded-full shadow-md bg-primary-600 text-white hover:bg-primary-700"
        >
          🧺 View Basket ({items.length})
        </Button>
      </div>

      {/* Drawer */}
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
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm dark:bg-black/50" />
          </TransitionChild>

          {/* Bottom Drawer */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300 transform-gpu"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200 transform-gpu"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="fixed bottom-0 left-0 flex h-[calc(100%-3.5rem)] w-full flex-col rounded-t-2xl bg-white px-4 py-4 shadow-xl dark:bg-dark-700">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-dark-600">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={close}
                    variant="flat"
                    isIcon
                    aria-label="Close basket"
                    className="size-8 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-dark-100">
                    Your Basket
                  </h3>
                </div>
                <BasketSelector onSelectStudent={onSelectStudent} />
              </div>

              {/* Items */}
              <div className="flex grow flex-col overflow-y-auto pt-3 pb-3">
                <Items
                  items={items}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              </div>

              {/* Checkout Section */}
              <Checkout
                subtotal={subtotal}
                gst={gst}
                total={total}
                basketItems={items}
                studentId={selectedStudent?.studentId}
                onInvoiceReady={onInvoiceReady} // ✅ forward to parent
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
  items,
  subtotal,
  gst,
  total,
  selectedStudent,
  onSelectStudent,
  onIncrease,
  onDecrease,
  onRemove,
  onInvoiceReady, // ✅ added here
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <BasketSelector onSelectStudent={onSelectStudent} />
        <BasketActions />
      </div>

      <Card className="mt-3 p-4 sm:p-5 shadow-md border border-gray-100 dark:border-dark-600">
        <Items
          items={items}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
        <Checkout
          subtotal={subtotal}
          gst={gst}
          total={total}
          basketItems={items}
          studentId={selectedStudent?.studentId}
          onInvoiceReady={onInvoiceReady} // ✅ forward to parent
        />
      </Card>
    </div>
  );
}
