// src/app/pages/apps/pos/index.jsx
import { useState, Fragment } from "react";
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Categories } from "./Categories";
import { Basket } from "./Basket";
import CoursesDatatable from "./courses-datatable";
import Invoice1 from "./invoice-1";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
// import { Button } from "components/ui";

export default function Pos() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [basketItems, setBasketItems] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null); // ✅ store invoice data
  const [showInvoice, setShowInvoice] = useState(false); // ✅ toggle modal

  // 🧾 Called when checkout success
  const handleInvoiceReady = (data) => {
    setInvoiceData(data);
    setShowInvoice(true);
  };

  // 🛒 Add to Basket
  const addToBasket = (item) => {
    setBasketItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, count: i.count + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          count: 1,
          image: item.image || "/images/800x600.png",
          price: Number(item.price) || 0,
          description: item.categoryName || "No description",
        },
      ];
    });
  };

  // ➕ Increase
  const handleIncrease = (id) => {
    setBasketItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, count: i.count + 1 } : i))
    );
  };

  // ➖ Decrease
  const handleDecrease = (id) => {
    setBasketItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, count: Math.max(i.count - 1, 0) } : i
        )
        .filter((i) => i.count > 0)
    );
  };

  // ❌ Remove
  const handleRemove = (id) => {
    setBasketItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Page title="Point of Sales App">
      <Header />

      <main className="main-content transition-content grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-5 pb-6 pt-5">
        {/* 📦 Product Section */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          <Categories onCategorySelect={setSelectedCategory} />
          <CoursesDatatable
            categoryId={selectedCategory}
            onRowClick={addToBasket}
          />
        </div>

        {/* 🧺 Basket Section */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-5 xl:col-span-4">
          <div className="sm:sticky sm:top-20 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-50 max-sm:bg-white dark:max-sm:bg-dark-800">
            <Basket
              items={basketItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onInvoiceReady={handleInvoiceReady} // ✅ pass callback
            />
          </div>
        </div>
      </main>

      <Sidebar />

      {/* ✅ INVOICE POPUP */}
      <Transition appear show={showInvoice} as={Fragment}>
        <Dialog as="div" className="relative z-[200]" onClose={() => setShowInvoice(false)}>
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </TransitionChild>

          {/* Panel */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300 transform-gpu"
            enterFrom="scale-90 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200 transform-gpu"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-90 opacity-0"
          >
            <DialogPanel className="fixed inset-0 flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-dark-800 shadow-2xl p-6">
                {/* Close Button */}
                <button
                  onClick={() => setShowInvoice(false)}
                  className="absolute top-4 right-4 rounded-full bg-gray-200 hover:bg-gray-300 p-2 dark:bg-dark-600 dark:hover:bg-dark-500"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>

                {/* Invoice Content */}
                <Invoice1 data={invoiceData} />
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </Page>
  );
}
