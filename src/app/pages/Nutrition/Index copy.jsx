import { useEffect, useState, useMemo, useRef } from "react";
import invariant from "tiny-invariant";
import { register } from "swiper/element/bundle";

import { Page } from "components/shared/Page";
import { BasicInitial } from "./Component/NameCard/BasicInitial.jsx";
import WithIcon from "./Component/MainTab/MainTab";
import QuickChecklistCard from "./Component/QuickChecklistCard";
import MoodCard from "./Component/FeedBack/MoodCard";
import MealPlanMonitoringCards from "./Component/FeedBack/MealPlanMonitoringCards";
import { fetchMealMonitoring } from "./Component/FeedBack/data";

register();

/* ------------------------------------------------------------
   Build template sections for PENDING days
------------------------------------------------------------ */
function buildSectionsFromHistoryDay(day, allFoods = []) {
  return day.sections.map((sec) => ({
    mealTypeId: sec.mealTypeId,
    mealTypeName: sec.mealTypeName,
    time: sec.time,
    items: sec.items.map((item) => {
      const meta = allFoods.find((f) => f.id === item.itemId);
      return {
        itemId: item.itemId,
        title: item.title,
        unit: item.unit ?? "",
        itemImage: meta?.image || item.itemImage || "",
        kcal: item.kcal,
        plannedQty: item.plannedQty ?? item.qty ?? 1,
        consumedQty: 0,
        isUnplanned: item.isUnplanned,
      };
    }),
  }));
}

/* ------------------------------------------------------------
   Layout
------------------------------------------------------------ */
function ManiKLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#F5FFF5] via-[#E7FCEB] to-[#D9F8E0] bg-fixed">
      <div className="absolute inset-0 bg-[url('/images/nutration/ManiKLayoutBackground.svg')] bg-[length:900px_900px] bg-center bg-repeat opacity-100 mix-blend-multiply" />
      <div className="absolute inset-0 bg-white/40 pointer-events-none" />
      <div className="relative z-10 flex flex-1 flex-col justify-start items-stretch px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   MAIN PAGE
------------------------------------------------------------ */
export default function NutritionDummy() {
  const userId = 1;
  const tenantId = 1;

  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState({});

  const carouselRef = useRef(null);

  /* Load data on mount */
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchMealMonitoring(userId, tenantId);
      setMonitor(data);
      setLoading(false);
    }
    load();
  }, []);

  /* Pending days extracted */
  const pendingDays = useMemo(
    () => monitor?.missedDays?.history ?? [],
    [monitor]
  );

  /* Build cards: Today + Pending days */
  const allCards = useMemo(() => {
    if (!monitor) return [];

    const cards = [];

    // TODAY CARD (read-only)
    cards.push({
      date: monitor.date,
      sections: monitor.sections,
      achievedFocus: monitor.achievedFocus,
      isPending: false,
    });

    // ALL PENDING CARDS
    pendingDays.forEach((day) => {
      cards.push({
        date: day.date,
        sections: buildSectionsFromHistoryDay(day, monitor.allFoods),
        achievedFocus: [],
        isPending: true,
      });
    });

    return cards;
  }, [monitor, pendingDays]);

  /* Initialize swiper */
  useEffect(() => {
    if (!carouselRef.current) return;
    if (!allCards.length) return;

    invariant(carouselRef.current, "Swiper ref missing");

    const params = {
      navigation: true,
      pagination: { clickable: true },
      spaceBetween: 16,
      slidesPerView: 1,
    };

    Object.assign(carouselRef.current, params);

    setTimeout(() => {
      if (!carouselRef.current.initialized) {
        carouselRef.current.initialize();
      }
    }, 0);
  }, [allCards]);

  /* ------------------------------------------------------------
     UI STATES
  ------------------------------------------------------------ */
  if (loading) {
    return (
      <Page title="Nutrition Dashboard">
        <div className="flex items-center justify-center py-10 text-gray-500">
          Loading...
        </div>
      </Page>
    );
  }

  if (!monitor) {
    return (
      <Page title="Nutrition Dashboard">
        <div className="flex items-center justify-center py-10 text-gray-500">
          No data found.
        </div>
      </Page>
    );
  }

  /* ------------------------------------------------------------
     FINAL RENDER
  ------------------------------------------------------------ */
  return (
    <Page title="Nutrition Dashboard">
      <ManiKLayout>
        {/* HEADER */}
        <div className="mb-6 space-y-3 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <BasicInitial />
          </div>

          <div className="relative inline-block">
            <h2 className="text-sm sm:text-2xl tracking-tight text-primary-950">
              Nutrition
            </h2>

            <div className="flex items-center justify-center sm:justify-start relative">
              <p className="mt-0.5 text-sm text-primary-950">
                Find the right nutrition plan curated just for you
              </p>

              <img
                src="/images/nutration/Arrow_pointingDow_curvy.svg"
                alt="arrow"
                className="w-15 h-auto ml-3 absolute right-[-3rem] top-[-1.8rem] sm:right-[-1.5rem] sm:top-[-3rem]"
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-2 space-y-6">
          <WithIcon />
          <QuickChecklistCard />

          {/* Mood Cards */}
          <MoodCard
            title="How are you feeling today?"
            placeholder="Tell us how you feel..."
            themeColor="#548C62"
            buttonColor="#8EB297"
            textColor="#1A4255"
          />

          <MoodCard
            title="Share Your Feedback"
            placeholder="Tell us how you feel..."
            themeColor="#548C62"
            buttonColor="#8EB297"
            textColor="#1A4255"
          />

          {/* SWIPER – TODAY + ALL PENDING */}
          <div className="max-w-md mx-auto">
            <swiper-container
              ref={carouselRef}
              init="false"
              style={{
                "--swiper-navigation-size": "32px",
                "--swiper-theme-color": "#548C62",
                "--swiper-pagination-color": "#8EB297",
              }}
            >
              {allCards.map((card, i) => (
                <swiper-slide key={i}>
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
          </div>
        </div>
      </ManiKLayout>
    </Page>
  );
}
