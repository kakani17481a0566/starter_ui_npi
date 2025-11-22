import { useEffect, useState, useMemo, useRef } from "react";
import { register } from "swiper/element/bundle";

import { Page } from "components/shared/Page";
import { BasicInitial } from "./Component/NameCard/BasicInitial.jsx";
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

  // Mood feedback questions
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Monitoring
  const [monitor, setMonitor] = useState(null);
  const [monitorStatus, setMonitorStatus] = useState("idle");
  const [monitorError, setMonitorError] = useState(null);

  const [selectedFoods, setSelectedFoods] = useState({});
  const carouselRef = useRef(null);

  /* -------------------------------------------------------------
     Load Feedback Questions
------------------------------------------------------------- */
  useEffect(() => {
    async function loadQuestions() {
      try {
        const qs = await fetchFeedbackQuestions(userId, tenantId); // <-- FIXED
        setQuestions(qs || []);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      }
    }
    loadQuestions();
  }, [userId, tenantId]);

  /* -------------------------------------------------------------
     Load Monitoring Data
------------------------------------------------------------- */
  useEffect(() => {
    let isCancelled = false;

    async function loadMonitoring() {
      try {
        setMonitorStatus("loading");
        const data = await fetchMealMonitoring(userId, tenantId);
        if (!isCancelled) {
          setMonitor(data);
          setMonitorStatus("success");
        }
      } catch {
        if (!isCancelled) {
          setMonitorStatus("error");
          setMonitorError("Something went wrong while loading your plan.");
        }
      }
    }

    loadMonitoring();
    return () => (isCancelled = true);
  }, [userId, tenantId]);

  /* -------------------------------------------------------------
     Build Maps
------------------------------------------------------------- */
  const foodMap = useMemo(() => {
    const map = {};
    monitor?.allFoods?.forEach((f) => {
      if (f?.id != null) map[f.id] = f;
    });
    return map;
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

    if (!carouselRef.current.initialized) {
      carouselRef.current.initialize?.();
    }
  }, [allCards.length]);

  /* -------------------------------------------------------------
     Flow Handlers
------------------------------------------------------------- */
  const handleChecklistFinish = () => {
    if (questions.length === 0) return setStep("monitor");

    setQuestionIndex(0);
    setStep("mood");
  };

  const handleMoodDone = () => {
    if (questionIndex < questions.length - 1) {
      return setQuestionIndex(questionIndex + 1);
    }
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
      <ManiKLayout>
        {/* HEADER */}
        <div className="mb-6 space-y-3 text-center sm:text-left">
          <BasicInitial />

          <h2 className="text-primary-950 text-sm tracking-tight sm:text-2xl">
            Nutrition
          </h2>

          <p className="text-primary-950 mt-0.5 text-sm">
            Find the right nutrition plan curated just for you here
          </p>
        </div>

        {/* STEP 1 — CHECKLIST */}
        {step === "checklist" && (
          <QuickChecklistCard onFinish={handleChecklistFinish} />
        )}

        {/* STEP 2 — DYNAMIC MOOD QUESTIONS */}
        {step === "mood" && questions.length > 0 && (
          <MoodCard
            question={questions[questionIndex].name}
            questionId={questions[questionIndex].id}
            targetDate={questions[questionIndex].targetDate} // <-- FIXED
            save={({ questionId, text, date }) =>
              saveMood({ userId, tenantId, questionId, text, date })
            }
            onDone={handleMoodDone}
          />
        )}

        {/* STEP 3 — MONITORING */}
        {step === "monitor" && (
          <div>
            {/* LOADING */}
            {monitorStatus === "loading" && (
              <div className="flex flex-col items-center justify-center py-10">
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
                  onClick={handleRetryMonitoring}
                  className="mt-3 inline-flex items-center rounded-lg bg-[#548C62] px-3 py-1.5 text-xs text-white shadow-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {/* SUCCESS */}
            {monitorStatus === "success" && monitor && (
              <>
                {allCards.length === 1 && <WithIcon />}

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

                    <WithIcon />
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
