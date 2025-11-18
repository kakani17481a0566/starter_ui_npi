import { useState, useEffect, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DailyPlans from "./Daily/DailyPlans";
import DailyMealPlanCart from "./Daily/DailyMealPlanCart";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { loadNutritionData } from "./Daily/data";
import { Spinner } from "components/ui";

export default function DailyMealPlanner() {
  const [foods, setFoods] = useState([]);
  const [mealWindows, setMealWindows] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [focusTags, setFocusTags] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /* -------------------------------------------------------------
     ⭐ Load Nutrition Data ONCE
  ------------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await loadNutritionData();
        if (!mounted) return;

        setFoods(res.foods || []);
        setMealWindows(res.mealWindows || []);
        setSelectedFoods(res.selectedFoods || {});
        setFocusTags(res.focusTags || []);
      } catch (err) {
        console.error("❌ Failed loading nutrition data:", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  /* -------------------------------------------------------------
     ⭐ Total qty for badge
  ------------------------------------------------------------- */
  const totalItems = Object.values(selectedFoods).reduce(
    (sum, v) => sum + v,
    0
  );

  /* -------------------------------------------------------------
     ⭐ Prevent body scroll on mobile drawer
  ------------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isCartOpen]);

  /* -------------------------------------------------------------
     ⭐ ESC key closes drawer
  ------------------------------------------------------------- */
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setIsCartOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  /* -------------------------------------------------------------
     ⭐ Callback: selecting meal in Cart highlights in DailyPlans
  ------------------------------------------------------------- */
  const handleMealSelect = useCallback((mealId) => {
    setSelectedMealType(mealId);
  }, []);

  /* -------------------------------------------------------------
     ⭐ Callback: update qty
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
      <div className="flex items-center justify-center h-[60vh] w-full">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  /* -------------------------------------------------------------
     🎨 LAYOUT UI
  ------------------------------------------------------------- */
  return (
    <div
      className="
        relative w-full flex flex-col
        lg:grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]
        gap-6 px-3 sm:px-4 lg:px-6 items-start
      "
    >
      {/* LEFT SIDE — FOOD LIST / FOCUS LIST */}
      <div className="flex-1 min-w-0 w-full">
        <DailyPlans
          foods={foods}
          mealWindows={mealWindows}
          selectedFoods={selectedFoods}       // ⭐ FIXED
          onSelectionChange={handleSelectionChange}
          selectedMealType={selectedMealType}
          focusTags={focusTags}
        />
      </div>

      {/* RIGHT SIDE — CART (Desktop) */}
      <aside className="
        hidden lg:flex flex-col w-full sticky top-4
        bg-white border border-gray-200 rounded-2xl
        shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-visible
      ">
        <DailyMealPlanCart
          foods={foods}
          mealWindows={mealWindows}
          selectedFoods={selectedFoods}
          onSelectionChange={handleSelectionChange}
          onMealSelect={handleMealSelect}
          focusTags={focusTags}
        />
      </aside>

      {/* ---------------------------------------------------------
         🛒 MOBILE FLOAT BUTTON
      ---------------------------------------------------------- */}
      <button
        onClick={() => setIsCartOpen(true)}
        aria-label="Open Meal Plan Cart"
        className="
          lg:hidden fixed top-1/2 right-4 -translate-y-1/2 z-40
          flex items-center gap-2
          bg-gradient-to-r from-[#FFA94D] to-[#EB5633]
          text-white font-semibold px-5 py-3 rounded-full
          shadow-[0_4px_15px_rgba(235,86,51,0.5)]
          hover:scale-105 active:scale-95
          transition-transform duration-300
        "
      >
        <ShoppingBagIcon className="w-5 h-5" />
        {totalItems > 0 ? `Cart (${totalItems})` : "Cart"}
      </button>

      {/* ---------------------------------------------------------
         🍔 MOBILE CART DRAWER (SLIDE-UP)
      ---------------------------------------------------------- */}
      <Transition show={isCartOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 flex flex-col justify-end"
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
            <Dialog.Panel className="
              relative w-full max-w-md mx-auto
              bg-white rounded-t-3xl
              shadow-[0_-4px_30px_rgba(0,0,0,0.25)]
              flex flex-col overflow-hidden
              border-t-4 border-[#EB5633]
            ">
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <Dialog.Title className="text-lg font-bold text-[#1A4255]">
                  Your Meal Plan {totalItems > 0 && `(${totalItems})`}
                </Dialog.Title>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
                <DailyMealPlanCart
                  foods={foods}
                  mealWindows={mealWindows}
                  selectedFoods={selectedFoods}
                  onSelectionChange={handleSelectionChange}
                  onMealSelect={(id) => {
                    handleMealSelect(id);
                    setIsCartOpen(false); // auto-close drawer
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
