import { useEffect, useState, useMemo, useRef } from "react";
import { register } from "swiper/element/bundle";

import { Page } from "components/shared/Page";
import QuickChecklistCard from "./Component/QuickChecklistCard";
import MoodCard from "./Component/FeedBack/MoodCard";
import MealPlanMonitoringCards from "./Component/FeedBack/MealPlanMonitoringCards";
import WithIcon from "./Component/MainTab/MainTab";

import {
  fetchMealMonitoring,
  fetchFeedbackQuestions,
  saveMood,
} from "./Component/FeedBack/data";

import { Spinner } from "components/ui";

register();

/* -------------------------------------------------------------
   Background Layout ONLY for SWIPER
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
   Build sections for pending days
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

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [monitor, setMonitor] = useState(null);
  const [monitorStatus, setMonitorStatus] = useState("idle");
  const [monitorError, setMonitorError] = useState(null);

  const [selectedFoods, setSelectedFoods] = useState({});
  const carouselRef = useRef(null);

  /* -------------------------------------------------------------
     Load Questions
------------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const q = await fetchFeedbackQuestions(userId, tenantId);
        setQuestions(q || []);
      } catch {
        // Ignore errors here
      }
    }
    load();
  }, [userId, tenantId]);

  /* -------------------------------------------------------------
     Load Monitoring
------------------------------------------------------------- */
  useEffect(() => {
    let cancel = false;

    async function load() {
      try {
        setMonitorStatus("loading");
        const data = await fetchMealMonitoring(userId, tenantId);
        if (!cancel) {
          setMonitor(data);
          setMonitorStatus("success");
        }
      } catch {
        if (!cancel) {
          setMonitorStatus("error");
          setMonitorError("Something went wrong while loading your plan.");
        }
      }
    }

    load();
    return () => (cancel = true);
  }, [userId, tenantId]);

  /* -------------------------------------------------------------
     Process Data
------------------------------------------------------------- */
  const foodMap = useMemo(() => {
    const m = {};
    monitor?.allFoods?.forEach((f) => {
      if (f.id != null) m[f.id] = f;
    });
    return m;
  }, [monitor?.allFoods]);

  const pendingDays = useMemo(
    () => monitor?.missedDays?.history ?? [],
    [monitor],
  );

  const allCards = useMemo(() => {
    if (!monitor) return [];

    const arr = [
      {
        date: monitor.date,
        sections: monitor.sections,
        achievedFocus: monitor.achievedFocus || [],
        isPending: false,
      },
    ];

    pendingDays.forEach((d) =>
      arr.push({
        date: d.date,
        sections: buildSectionsFromHistoryDay(d, foodMap),
        achievedFocus: [],
        isPending: true,
      }),
    );

    return arr;
  }, [monitor, pendingDays, foodMap]);

  /* -------------------------------------------------------------
     Swiper Init
------------------------------------------------------------- */
  useEffect(() => {
    if (!carouselRef.current || !allCards.length) return;

    Object.assign(carouselRef.current, {
      navigation: true,
      pagination: { clickable: true },
      spaceBetween: 16,
      slidesPerView: 1,
    });

    carouselRef.current.initialize?.();
  }, [allCards.length]);

  /* -------------------------------------------------------------
     Handlers
------------------------------------------------------------- */
  const handleChecklistFinish = () => {
    if (questions.length === 0) return setStep("monitor");

    setQuestionIndex(0);
    setStep("mood");
  };

  const handleMoodDone = () => {
    if (questionIndex < questions.length - 1)
      return setQuestionIndex(questionIndex + 1);

    setStep("monitor");
  };

  const handleRetryMonitoring = async () => {
    try {
      setMonitorStatus("loading");
      const data = await fetchMealMonitoring(userId, tenantId);
      setMonitor(data);
      setMonitorStatus("success");
    } catch {
      setMonitorStatus("error");
      setMonitorError("Still unable to load your plan.");
    }
  };

  /* -------------------------------------------------------------
     RENDER
------------------------------------------------------------- */
  return (
    <Page title="Nutrition Dashboard">
      {/* 1️⃣ Checklist Mode */}
      {step === "checklist" && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <QuickChecklistCard onFinish={handleChecklistFinish} />
        </div>
      )}

      {/* 2️⃣ Mood Mode */}
      {step === "mood" && questions.length > 0 && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <MoodCard
            question={questions[questionIndex].name}
            questionId={questions[questionIndex].id}
            targetDate={questions[questionIndex].targetDate}
            save={({ questionId, text, date }) =>
              saveMood({ userId, tenantId, questionId, text, date })
            }
            onDone={handleMoodDone}
          />
        </div>
      )}

      {/* 3️⃣ Monitoring Mode */}
      {step === "monitor" && (
        <>
          {/* LOADING */}
          {monitorStatus === "loading" && (
            <div className="flex min-h-screen flex-col items-center justify-center">
              <Spinner color="primary" />
              <div className="mt-3 text-sm">
                Loading your personalized plan...
              </div>
            </div>
          )}

          {/* ERROR */}
          {monitorStatus === "error" && (
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-800">
                <p>{monitorError}</p>
                <button
                  onClick={handleRetryMonitoring}
                  className="mt-3 inline-flex items-center rounded-lg bg-[#548C62] px-3 py-1.5 text-xs text-white shadow-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {monitorStatus === "success" && monitor && (
            <>
              {/* ⭐ SINGLE DAY → ONLY SHOW ICON */}
              {allCards.length === 1 && (
                <div className="flex min-h-screen items-center justify-center px-4">
                  <WithIcon />
                </div>
              )}

              {/* ⭐ MULTI-DAY → SHOW CARDS IN SWIPER */}
              {allCards.length > 1 && (
                <ManiKLayout>
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
                          onReload={() => handleRetryMonitoring()}
                        />
                      </swiper-slide>
                    ))}
                  </swiper-container>
                </ManiKLayout>
              )}
            </>
          )}
        </>
      )}
    </Page>
  );
}
