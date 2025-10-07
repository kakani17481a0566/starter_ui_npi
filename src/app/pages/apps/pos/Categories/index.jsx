// Import Dependencies
import { useEffect, useRef, useState } from "react";
import { register } from "swiper/element/bundle";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import invariant from "tiny-invariant";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";
import { Button, Card } from "components/ui";
import { useIsomorphicEffect } from "hooks";
// import UserCard from "/app/pages/dashboards/ParentStudent/Student-card/UserCard.jsx"; // 🔹 adjust path as needed
import { UserCard } from "app/pages/dashboards/ParentStudent/Student-card/UserCard";
import axios from "axios";
import {POS_CATEGORIES} from "constants/apis";

// ----------------------------------------------------------------------


// const items = [
//   {
//     uid: "1",
//     name: "Books",
//     image: "/images/categories/books",
//   },
//   {
//     uid: "2",
//     name: "Uniform",
//     image: "/images/categories/uniform.jpg",
//   },
//   {
//     uid: "3",
//     name: "Accessories",
//     image: "/images/categories/accessories",
//   },
// ];

register();

export function Categories({ onCategorySelect, selectedKid }) {
  const[data,setData]=useState([]);
  const { direction } = useLocaleContext();
  const carouselRef = useRef(null);
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const response=await axios.get(POS_CATEGORIES);
        setData(response.data.data);
      }
      catch (err){
        console.log(err);
      }

    };
    fetchData();

},[]);

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

  return (
    <swiper-container
      ref={carouselRef}
      init="false"
      slides-per-view="auto"
      dir={direction}
      space-between="16"
    >
      <span slot="container-start">
        <div className="flex min-w-0 items-center justify-between pb-3">
          <p className="truncate text-base font-medium text-gray-800 dark:text-dark-100">
            Categories
          </p>
          <div className="flex">
            <Button isIcon className="prev-btn size-7 rounded-full" variant="flat">
              <ChevronLeftIcon className="size-5 rtl:rotate-180" />
            </Button>
            <Button isIcon className="next-btn size-7 rounded-full" variant="flat">
              <ChevronRightIcon className="size-5 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </span>

      {/* 🔹 Student Card Slide */}


      {/* 🔹 Category Items */}
      {data.map(({ id, name, image }) => (
        <swiper-slide key={id} class="w-24">
          <Card
            className="w-full shrink-0 cursor-pointer px-2 py-4 text-center text-gray-800 dark:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-700"
            onClick={() => onCategorySelect?.(id)} // send uid back
          >
            <img
              alt={name}
              src={image}
              loading="lazy"
              className="mx-auto w-24 h-12"
            />
            <p className="truncate pt-2 font-medium tracking-wide">{name}</p>
          </Card>
        </swiper-slide>
      ))}
            {selectedKid && (
  <swiper-slide class="w=140"> {/* smaller width */}
    <Card className="p-2">
      <UserCard
        {...selectedKid}
        className="scale-90 transform origin-top" // shrink proportionally
      />
    </Card>
  </swiper-slide>
)}
    </swiper-container>
  );
}
