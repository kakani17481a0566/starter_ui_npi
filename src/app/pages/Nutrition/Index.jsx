// ----------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------
import { useEffect, useState, useMemo, useRef } from "react";
import invariant from "tiny-invariant";
import { register } from "swiper/element/bundle";

import { Page } from "components/shared/Page";
import { BasicInitial } from "./Component/NameCard/BasicInitial.jsx";
import WithIcon from "./Component/MainTab/MainTab";
import QuickChecklistCard from "./Component/QuickChecklistCard/index";
import MoodCard from "./Component/FeedBack/MoodCard";

import MealPlanMonitoringCards from "./Component/FeedBack/MealPlanMonitoringCards";
import { fetchMealMonitoring } from "./Component/FeedBack/data";

// register Swiper web components
register();

// ----------------------------------------------------------------------
// Build pending-day meal sections correctly
// ----------------------------------------------------------------------
function buildSectionsFromHistoryDay(day, allFoods = []) {
  return day.sections.map((sec) => {
    const items = sec.items.map((it) => {
      const meta = allFoods.find((f) => f.id === it.itemId);

      return {
        itemId: it.itemId,
        title: it.title,
        unit: it.unit ?? "",
        itemImage: meta?.image || "",
        kcal: it.kcal,
        plannedQty: it.plannedQty ?? it.qty ?? 1,
        consumedQty: 0,
        isUnplanned: it.isUnplanned,
      };
    });

    return {
      mealTypeId: sec.mealTypeId,
      mealTypeName: sec.mealTypeName,
      time: sec.time,
      items,
    };
  });
}

// ----------------------------------------------------------------------
// Layout (unchanged)
// ----------------------------------------------------------------------
function ManiKLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#F5FFF5] via-[#E7FCEB] to-[#D9F8E0] bg-fixed">
      <div className="absolute inset-0 bg-[url('/images/nutration/ManiKLayoutBackground.svg')] bg-[length:900px_900px] bg-center bg-repeat opacity-100 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

      <div className="relative z-10 flex flex-1 flex-col justify-start items-stretch px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN PAGE — FINAL VERSION
// ----------------------------------------------------------------------
export default function Nutrition() {
  const userId = 1;
  const tenantId = 1;

  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState(null);

  const carouselRef = useRef(null);

  // Fetch API
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchMealMonitoring(userId, tenantId);
      setMonitor(data);
      setLoading(false);
    }
    load();
  }, []);

  // Pending days (memoized BEFORE early returns)
  const pendingDays = useMemo(() => {
    return monitor?.missedDays?.history ?? [];
  }, [monitor]);

  // Build all cards for carousel (today + pending)
  const allCards = useMemo(() => {
    if (!monitor) return [];

    const result = [];

    // Today card
    result.push({
      date: monitor.date,
      sections: monitor.sections,
      isPending: false,
    });

    // Pending cards
    pendingDays.forEach((day) => {
      result.push({
        date: day.date,
        sections: buildSectionsFromHistoryDay(day, monitor.allFoods),
        isPending: true,
      });
    });

    return result;
  }, [monitor, pendingDays]);

  // Initialize Swiper after cards load
  useEffect(() => {
    if (!carouselRef.current) return;

    invariant(carouselRef.current, "Swiper ref is null");

    const params = {
      navigation: true,
      pagination: {
        clickable: true,
      },
      spaceBetween: 16,
      slidesPerView: 1,
    };

    Object.assign(carouselRef.current, params);

    setTimeout(() => {
      carouselRef.current.initialize();
    });
  }, [allCards]);

  // Loading state
  if (loading) {
    return (
      <Page>
        <div>Loading...</div>
      </Page>
    );
  }

  // No data
  if (!monitor) {
    return (
      <Page>
        <div>No data found</div>
      </Page>
    );
  }

  // UI -------------------------------------------------------------
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
                Find the right nutrition plan curated just for you here
              </p>

              <img
                src="/images/nutration/Arrow_pointingDow_curvy.svg"
                alt="Decorative Arrow"
                className="w-15 h-auto ml-2 sm:ml-3 absolute right-[-3rem] top-[-1.8rem] sm:right-[-1.5rem] sm:top-[-3rem] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* MAIN SECTIONS */}
        <div className="mt-2 space-y-6">
          <WithIcon />
          <QuickChecklistCard />

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

          {/* FINAL SWIPER CAROUSEL */}
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
              {allCards.map((card, idx) => (
                <swiper-slide key={idx}>
                  <MealPlanMonitoringCards
                    sections={card.sections}
                    cardDate={card.date}
                    selectedFoods={{}}
                    onSelectionChange={() => { }}
                    isPending={card.isPending}
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
