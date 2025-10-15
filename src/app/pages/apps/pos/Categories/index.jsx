// ----------------------------------------------------------------------
// Import Dependencies
// ----------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { register } from "swiper/element/bundle";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import invariant from "tiny-invariant";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";
import { Button, Card } from "components/ui";
import { useIsomorphicEffect } from "hooks";
import { UserCard } from "app/pages/dashboards/ParentStudent/Student-card/UserCard";
import axios from "axios";
import { POS_CATEGORIES } from "constants/apis";

// ----------------------------------------------------------------------

register();

export function Categories({ onCategorySelect, selectedKid }) {
  const [data, setData] = useState([]);
  const { direction } = useLocaleContext();
  const carouselRef = useRef(null);

  // 🔹 Fetch Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(POS_CATEGORIES);
        setData(response.data.data);
      } catch (err) {
        console.log("❌ Failed to fetch categories:", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Initialize Swiper
  useIsomorphicEffect(() => {
    invariant(carouselRef.current, "carouselRef is null");
    const params = {
      navigation: {
        nextEl: ".next-btn",
        prevEl: ".prev-btn",
      },
    };
    Object.assign(carouselRef.current, params);
    setTimeout(() => {
      carouselRef.current.initialize();
    });
  }, []);

  // ----------------------------------------------------------------------
  // 🔹 Render
  // ----------------------------------------------------------------------
  return (
    <swiper-container
      ref={carouselRef}
      init="false"
      slides-per-view="auto"
      dir={direction}
      space-between="16"
    >
      {/* 🔹 Header */}
      <span slot="container-start">
        <div className="flex min-w-0 items-center justify-between pb-3">
          {/* ✅ Added Icon beside title */}
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="w-5 h-5 text-primary-400" />
            <p className="truncate text-base font-medium text-gray-800 dark:text-dark-100">
              Categories
            </p>
          </div>

          {/* 🔹 Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* 🆕 All Button (Primary) */}
            <Button
              size="sm"
              variant="solid" // ✅ switched to primary solid
              className="bg-primary-500 hover:bg-primary-600 text-white"
              onClick={() => onCategorySelect?.(null)}
            >
              All
            </Button>

            {/* Navigation Arrows */}
            <Button
              isIcon
              className="prev-btn size-7 rounded-full"
              variant="flat"
            >
              <ChevronLeftIcon className="size-5 rtl:rotate-180" />
            </Button>
            <Button
              isIcon
              className="next-btn size-7 rounded-full"
              variant="flat"
            >
              <ChevronRightIcon className="size-5 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </span>

      {/* 🔹 Category Items */}
      {data.map(({ id, name, image }) => (
        <swiper-slide key={id} class="w-24">
          <Card
            className="w-full shrink-0 cursor-pointer px-2 py-4 text-center text-gray-800 dark:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-700"
            onClick={() => onCategorySelect?.(id)}
          >
            <img
              alt={name}
              src={image}
              loading="lazy"
              className="mx-auto w-24 h-12 object-contain"
            />
            <p className="truncate pt-2 font-medium tracking-wide">{name}</p>
          </Card>
        </swiper-slide>
      ))}

      {/* 🔹 Selected Kid Card */}
      {selectedKid && (
        <swiper-slide class="w=140">
          <Card className="p-2">
            <UserCard
              {...selectedKid}
              className="scale-90 transform origin-top"
            />
          </Card>
        </swiper-slide>
      )}
    </swiper-container>
  );
}
