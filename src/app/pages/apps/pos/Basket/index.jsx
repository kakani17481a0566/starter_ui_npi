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
import { Checkout } from "./Checkout";
import { useDisclosure } from "hooks";
import { Button, Card } from "components/ui";

export function Basket({ items, onIncrease, onDecrease, onRemove }) {
  const { smAndUp } = useBreakpointsContext();

  // --- Totals ---
  const subtotal = items.reduce((s, i) => s + i.count * Number(i.price || 0), 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return smAndUp ? (
    <DesktopView
      items={items}
      subtotal={subtotal}
      gst={gst}
      total={total}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onRemove={onRemove}
    />
  ) : (
    <MobileView
      items={items}
      subtotal={subtotal}
      gst={gst}
      total={total}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onRemove={onRemove}
    />
  );
}

function MobileView({ items, subtotal, gst, total, onIncrease, onDecrease, onRemove }) {
  const [isBasketOpen, { close, open }] = useDisclosure(false);

  return (
    <>
      {/* Cart trigger button */}
      <Button onClick={open} variant="outline" size="sm">
        Open Basket
      </Button>

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

          {/* Bottom Sheet */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200 transform-gpu"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200 transform-gpu"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="fixed bottom-0 left-0 flex h-[calc(100%-2.5rem)] w-full flex-col rounded-t-2xl bg-white px-4 py-3 dark:bg-dark-700">
              {/* Header */}
              <div className="-mx-1 flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    onClick={close}
                    variant="flat"
                    isIcon
                    aria-label="Close basket"
                    className="size-7 rounded-full"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                  <BasketSelector />
                </div>
                <BasketActions />
              </div>

              {/* Items */}
              <div className="flex grow flex-col overflow-y-auto pt-4">
                <Items
                  items={items}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              </div>

              {/* Checkout */}
              <Checkout subtotal={subtotal} gst={gst} total={total} />
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}

function DesktopView({ items, subtotal, gst, total, onIncrease, onDecrease, onRemove }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <BasketSelector />
        <BasketActions />
      </div>

      <Card className="mt-3 p-4 sm:p-5">
        <Items
          items={items}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
        <Checkout subtotal={subtotal} gst={gst} total={total} />
      </Card>
    </div>
  );
}
