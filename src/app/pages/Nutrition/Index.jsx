import { useEffect, useState, useMemo, useRef } from "react";
import { register } from "swiper/element/bundle";

import { Page } from "components/shared/Page";
import { BasicInitial } from "./Component/NameCard/BasicInitial.jsx";
import QuickChecklistCard from "./Component/QuickChecklistCard";
import MoodCard from "./Component/FeedBack/MoodCard";
import MealPlanMonitoringCards from "./Component/FeedBack/MealPlanMonitoringCards";
import WithIcon from "./Component/MainTab/MainTab";
import { fetchMealMonitoring } from "./Component/FeedBack/data";
import { Spinner } from "components/ui";

register();

/* -------------------------------------------------------------
   Layout Wrapper
------------------------------------------------------------- */
function ManiKLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F5FFF5]">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/nutration/ManiKLayoutBackground.svg')] bg-cover bg-center opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-white/40" />
      <div className="relative z-10 flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   Build sections for history days
------------------------------------------------------------- */
function buildSectionsFromHistoryDay(day, foodMap = {}) {
  return day.sections.map((sec) => ({
    mealTypeId: sec.mealTypeId,
    mealTypeName: sec.mealTypeName,
    time: sec.time,
    items: sec.items.map((item) => {
      const meta = foodMap[item.itemId];
      return {
        itemId: item.itemId,
        title: item.title,
        unit: item.unit ?? "",
        itemImage: meta?.image || item.itemImage || "",
        kcal: item.kcal,
        plannedQty: item.plannedQty ?? item.qty ?? 1,
        consumedQty: item.consumedQty ?? 0,
        isUnplanned: item.isUnplanned,
      };
    }),
  }));
}

/* -------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------- */
export default function Nutrition() {
  const userId = 1;
  const tenantId = 1;

  const [step, setStep] = useState("checklist");
  const [monitor, setMonitor] = useState(null);
  const [monitorStatus, setMonitorStatus] = useState("idle");
  const [monitorError, setMonitorError] = useState(null);

  const [selectedFoods, setSelectedFoods] = useState({});
  const carouselRef = useRef(null);

  /* -------------------------------------------------------------
     Preload monitoring data
  ------------------------------------------------------------- */
  useEffect(() => {
    let isCancelled = false;

    async function loadMonitoring() {
      try {
        setMonitorStatus((prev) => (prev === "success" ? prev : "loading"));
        setMonitorError(null);

        const data = await fetchMealMonitoring(userId, tenantId);
        if (isCancelled) return;

        setMonitor(data);
        setMonitorStatus("success");
      } catch {
        if (isCancelled) return;
        setMonitorStatus("error");
        setMonitorError("Something went wrong while loading your plan.");
      }
    }

    loadMonitoring();
    return () => (isCancelled = true);
  }, [userId, tenantId]);

  /* -------------------------------------------------------------
     Food lookup map
  ------------------------------------------------------------- */
  const foodMap = useMemo(() => {
    const map = {};
    monitor?.allFoods?.forEach((f) => {
      if (f?.id != null) map[f.id] = f;
    });
    return map;
  }, [monitor?.allFoods]);

  /* -------------------------------------------------------------
     Pending days
  ------------------------------------------------------------- */
  const pendingDays = useMemo(
    () => monitor?.missedDays?.history ?? [],
    [monitor]
  );

  /* -------------------------------------------------------------
     Build cards (today + pending)
  ------------------------------------------------------------- */
  const allCards = useMemo(() => {
    if (!monitor) return [];

    const arr = [];

    // TODAY
    arr.push({
      date: monitor.date,
      sections: monitor.sections,
      achievedFocus: monitor.achievedFocus || [],
      isPending: false,
    });

    // PENDING
    pendingDays.forEach((day) => {
      arr.push({
        date: day.date,
        sections: buildSectionsFromHistoryDay(day, foodMap),
        achievedFocus: [],
        isPending: true,
      });
    });

    return arr;
  }, [monitor, pendingDays, foodMap]);

  /* -------------------------------------------------------------
     Swiper Setup
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!carouselRef.current || !allCards.length) return;

    const swiper = carouselRef.current;

    Object.assign(swiper, {
      navigation: true,
      pagination: { clickable: true },
      spaceBetween: 16,
      slidesPerView: 1,
    });

    if (!swiper.initialized) swiper.initialize?.();
  }, [allCards.length]);

  /* -------------------------------------------------------------
     Step Events
  ------------------------------------------------------------- */
  const handleChecklistFinish = () => setStep("mood1");
  const handleMood1Done = () => setStep("mood2");
  const handleMood2Done = () => setStep("monitor");

  const handleRetryMonitoring = async () => {
    try {
      setMonitorStatus("loading");
      setMonitorError(null);
      const data = await fetchMealMonitoring(userId, tenantId);
      setMonitor(data);
      setMonitorStatus("success");
    } catch {
      setMonitorStatus("error");
      setMonitorError("Still unable to load your plan. Please try again.");
    }
  };

  /* -------------------------------------------------------------
     Render
  ------------------------------------------------------------- */
  return (
    <Page title="Nutrition Dashboard">
      <ManiKLayout>
        {/* Header */}
        <div className="mb-6 space-y-3 text-center sm:text-left">
          <BasicInitial />

          <h2 className="text-primary-950 text-sm tracking-tight sm:text-2xl">
            Nutrition
          </h2>

          <p className="text-primary-950 mt-0.5 text-sm">
            Find the right nutrition plan curated just for you here
          </p>
        </div>

        {/* STEP 1 */}
        {step === "checklist" && (
          <QuickChecklistCard onFinish={handleChecklistFinish} />
        )}

        {/* STEP 2 */}
        {step === "mood1" && (
          <MoodCard
            themeColor="#548C62"
            buttonColor="#8EB297"
            textColor="#1A4255"
            onDone={handleMood1Done}
          />
        )}

        {/* STEP 3 */}
        {step === "mood2" && (
          <MoodCard
            themeColor="#548C62"
            buttonColor="#8EB297"
            textColor="#1A4255"
            onDone={handleMood2Done}
          />
        )}

        {/* STEP 4: Monitoring */}
        {step === "monitor" && (
          <div className="">
            {/* LOADING */}
            {monitorStatus === "loading" && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Spinner color="primary" />
                <div className="mt-3 text-sm">
                  Loading your personalized plan...
                </div>
              </div>
            )}

            {/* ERROR */}
            {monitorStatus === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-800">
                <p>{monitorError}</p>
                <button
                  type="button"
                  onClick={handleRetryMonitoring}
                  className="mt-3 inline-flex items-center rounded-lg bg-[#548C62] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#436F4D]"
                >
                  Retry
                </button>
              </div>
            )}

            {/* SUCCESS */}
            {monitorStatus === "success" && monitor && (
              <>
                {/* CASE 1 → Only ONE card → SHOW ONLY WITHICON */}
                {allCards.length === 1 && (
                  <div >
                    <WithIcon />
                  </div>
                )}

                {/* CASE 2 → MULTIPLE CARDS → Show Swiper + Cards + WithIcon */}
                {allCards.length > 1 && (
                  <>
                    <swiper-container
                      ref={carouselRef}
                      style={{
                        "--swiper-navigation-size": "32px",
                        "--swiper-theme-color": "#548C62",
                        "--swiper-pagination-color": "#8EB297",
                      }}
                    >
                      {allCards.map((card, idx) => (
                        <swiper-slide key={idx}>
                          <MealPlanMonitoringCards
                            sections={card.sections}
                            cardDate={card.date}
                            achievedFocus={card.achievedFocus}
                            selectedFoods={selectedFoods}
                            onSelectionChange={setSelectedFoods}
                            isPending={card.isPending}
                            allFocusItems={monitor.allFocusItems}
                            allFocus={monitor.allFocus}
                          />
                        </swiper-slide>
                      ))}
                    </swiper-container>

                    <div >
                      <WithIcon />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </ManiKLayout>
    </Page>
  );
}
