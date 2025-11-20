// DailyMealPlanner.jsx
import { useState, useEffect, useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";

import DailyPlans from "./Daily/DailyPlans";
import DailyMealPlanCart from "./Daily/DailyMealPlanCart";
import { loadNutritionData } from "./Daily/data";
import { Spinner } from "components/ui";

export default function DailyMealPlanner({ selectedDate }) {
  const [foods, setFoods] = useState([]);
  const [mealWindows, setMealWindows] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [focusTags, setFocusTags] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /* -------------------------------------------------------------
     ⭐ Load Nutrition Data whenever selectedDate changes
  ------------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    setLoading(true);

    (async () => {
      try {
        const res = await loadNutritionData(1, selectedDate); // ⬅ date-aware

        if (!mounted) return;

        setFoods(res.foods || []);
        setMealWindows(res.mealWindows || []);
        setSelectedFoods(res.selectedFoods || {});
        setFocusTags(res.focusTags || []);
      } catch (err) {
        console.error("❌ Failed loading nutrition data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedDate]);

  /* -------------------------------------------------------------
     ⭐ Total qty for cart badge
  ------------------------------------------------------------- */
  const totalItems = Object.values(selectedFoods || {}).reduce(
    (sum, v) => sum + v,
    0
  );

  /* -------------------------------------------------------------
     ⭐ Prevent body scroll when mobile cart is open
  ------------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  /* -------------------------------------------------------------
     ⭐ ESC key closes drawer on mobile
  ------------------------------------------------------------- */
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setIsCartOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  /* -------------------------------------------------------------
     ⭐ Callback: when meal section selected in cart
        → highlight that meal in DailyPlans
  ------------------------------------------------------------- */
  const handleMealSelect = useCallback((mealId) => {
    setSelectedMealType(mealId);
  }, []);

  /* -------------------------------------------------------------
     ⭐ Callback: update selectedFoods
  ------------------------------------------------------------- */
  const handleSelectionChange = useCallback((updateFn) => {
    setSelectedFoods((prev) =>
      typeof updateFn === "function" ? updateFn(prev) : updateFn
    );
  }, []);

  /* -------------------------------------------------------------
     🌀 LOADING STATE
  ------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  /* -------------------------------------------------------------
     🎨 MAIN LAYOUT
  ------------------------------------------------------------- */
  return (
    <div
      className="
        relative flex w-full flex-col items-start gap-6 px-3
        sm:px-4
        lg:grid lg:grid-cols-[1fr_400px] lg:px-6
        xl:grid-cols-[1fr_440px]
      "
    >
      {/* LEFT SIDE — Daily Plans / Food List */}
      <div className="min-w-0 w-full flex-1">
        <DailyPlans
          foods={foods}
          mealWindows={mealWindows}
          selectedFoods={selectedFoods}
          onSelectionChange={handleSelectionChange}
          selectedMealType={selectedMealType}
          focusTags={focusTags}
          selectedDate={selectedDate}
        />
      </div>

      {/* RIGHT SIDE — CART (Desktop) */}
      <aside
        className="
          hidden w-full flex-col rounded-2xl border border-gray-200
          bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-visible
          lg:sticky lg:top-4 lg:flex
        "
      >
        <DailyMealPlanCart
          foods={foods}
          mealWindows={mealWindows}
          selectedFoods={selectedFoods}
          onSelectionChange={handleSelectionChange}
          onMealSelect={handleMealSelect}
          focusTags={focusTags}
        />
      </aside>

      {/* 🛒 FLOATING CART BUTTON (Mobile) */}
      <button
        onClick={() => setIsCartOpen(true)}
        aria-label="Open Meal Plan Cart"
        className="
          fixed right-4 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2
          rounded-full bg-gradient-to-r from-[#FFA94D] to-[#EB5633]
          px-5 py-3 text-white
          font-semibold shadow-[0_4px_15px_rgba(235,86,51,0.5)]
          transition-transform duration-300
          hover:scale-105 active:scale-95
          lg:hidden
        "
      >
        <ShoppingBagIcon className="h-5 w-5" />
        {totalItems > 0 ? `Cart (${totalItems})` : "Cart"}
      </button>

      {/* 🍔 MOBILE CART DRAWER */}
      <Transition show={isCartOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex flex-col justify-end"
          onClose={() => setIsCartOpen(false)}
        >
          {/* OVERLAY */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          {/* DRAWER PANEL */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="translate-y-full scale-95 opacity-0"
            enterTo="translate-y-0 scale-100 opacity-100"
            leave="ease-in duration-400"
            leaveFrom="translate-y-0 scale-100 opacity-100"
            leaveTo="translate-y-full scale-95 opacity-0"
          >
            <Dialog.Panel
              className="
                relative mx-auto flex w-full max-w-md flex-col overflow-hidden
                rounded-t-3xl border-t-4 border-[#EB5633]
                bg-white shadow-[0_-4px_30px_rgba(0,0,0,0.25)]
              "
            >
              {/* HEADER */}
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                <Dialog.Title className="text-lg font-bold text-[#1A4255]">
                  Your Meal Plan {totalItems > 0 && `(${totalItems})`}
                </Dialog.Title>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
                <DailyMealPlanCart
                  foods={foods}
                  mealWindows={mealWindows}
                  selectedFoods={selectedFoods}
                  onSelectionChange={handleSelectionChange}
                  onMealSelect={(id) => {
                    handleMealSelect(id);
                    setIsCartOpen(false); // auto-close drawer on select
                  }}
                  focusTags={focusTags}
                />
              </div>

              <div className="h-6 sm:h-0" />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
