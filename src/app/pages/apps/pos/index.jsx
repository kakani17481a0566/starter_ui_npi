// ----------------------------------------------------------------------
// 📦 Import Dependencies
// ----------------------------------------------------------------------
import { useState, useEffect, useMemo, Fragment } from "react";
import ReactDOM from "react-dom";
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

// ----------------------------------------------------------------------
// 🧮 POS Component
// ----------------------------------------------------------------------
export default function Pos() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [basketItems, setBasketItems] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ controls CoursesDatatable refresh

  // ----------------------------------------------------------------------
  // 🔁 Load basket & invoice from localStorage
  // ----------------------------------------------------------------------
  useEffect(() => {
    try {
      const savedBasket = localStorage.getItem("basket-items");
      const savedInvoice = localStorage.getItem("invoice-data");

      if (savedBasket) setBasketItems(JSON.parse(savedBasket));
      if (savedInvoice) setInvoiceData(JSON.parse(savedInvoice));
    } catch (err) {
      console.warn("⚠️ Failed to load saved POS data:", err);
    }
  }, []);

  // 🧺 Persist basket changes
  useEffect(() => {
    localStorage.setItem("basket-items", JSON.stringify(basketItems));
  }, [basketItems]);

  // 💾 Persist invoice
  useEffect(() => {
    if (invoiceData) {
      localStorage.setItem("invoice-data", JSON.stringify(invoiceData));
    }
  }, [invoiceData]);

  // ----------------------------------------------------------------------
  // 🧾 Handle Invoice Generation
  // ----------------------------------------------------------------------
  const handleInvoiceReady = (data) => {
    if (!data) return;
    setInvoiceData(data);
    setShowInvoice(true);

    // ✅ Refresh CoursesDatatable after invoice is generated
    setRefreshKey((prev) => prev + 1);
  };

  // ----------------------------------------------------------------------
  // 🛒 Basket Management
  // ----------------------------------------------------------------------
  const addToBasket = (item) => {
    if (!item) return;
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
          name: item.name || "Unnamed Item",
          count: 1,
          image: item.image || "/images/800x600.png",
          price: Number(item.price) || 0,
          description: item.categoryName || "No description",
        },
      ];
    });
  };

  const handleIncrease = (id) => {
    setBasketItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, count: i.count + 1 } : i))
    );
  };

  const handleDecrease = (id) => {
    setBasketItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, count: Math.max(i.count - 1, 0) } : i
        )
        .filter((i) => i.count > 0)
    );
  };

  const handleRemove = (id) => {
    setBasketItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearBasket = () => {
    setBasketItems([]);
    localStorage.removeItem("basket-items");
  };

  // ----------------------------------------------------------------------
  // 🧠 Memoized Invoice Rendering (prevents ghost refresh)
  // ----------------------------------------------------------------------
  const memoizedInvoice = useMemo(() => {
    if (!invoiceData) return null;
    return <Invoice1 data={invoiceData} />;
  }, [invoiceData]);

  // ----------------------------------------------------------------------
  // 🖥️ Render UI
  // ----------------------------------------------------------------------
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
            refreshKey={refreshKey} // ✅ dynamic trigger
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
              onInvoiceReady={handleInvoiceReady}
              onClearBasket={clearBasket}
            />
          </div>
        </div>
      </main>

      <Sidebar />

      {/* ✅ Invoice Modal (detached, prevents full rerender) */}
      <Transition appear show={showInvoice} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[200]"
          onClose={() => {
            setShowInvoice(false);
            // ✅ Refresh items again after closing invoice
            setRefreshKey((prev) => prev + 1);
          }}
        >
          {ReactDOM.createPortal(
            <>
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
                      onClick={() => {
                        setShowInvoice(false);
                        setRefreshKey((prev) => prev + 1);
                      }}
                      className="absolute top-4 right-4 rounded-full bg-gray-200 hover:bg-gray-300 p-2 dark:bg-dark-600 dark:hover:bg-dark-500"
                      aria-label="Close Invoice"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>

                    {/* Invoice Content (Memoized) */}
                    {memoizedInvoice}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </>,
            document.body
          )}
        </Dialog>
      </Transition>
    </Page>
  );
}
