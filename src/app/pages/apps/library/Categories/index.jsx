// Import Dependencies
import { useEffect, useRef,useState } from "react";
import { register } from "swiper/element/bundle";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import invariant from "tiny-invariant";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";
import { Button, Card } from "components/ui";
import { useIsomorphicEffect } from "hooks";
import axios from "axios";

// ----------------------------------------------------------------------

// const items = [
//   { uid: "1", name: "All", image: "/images/4300_7_03.jpg" },
//   { uid: "2", name: "PreNursery", image: "/images/4300_7_03.jpg" },
//   { uid: "3", name: "Nursery", image: "/images/4300_7_03.jpg" },
//   { uid: "4", name: "K1", image: "/images/4300_7_03.jpg" },
//   { uid: "5", name: "K2", image: "/images/4300_7_03.jpg" },
// ];

register();

export function Categories({ selectedCategory, onSelectCategory }) {
  const { direction } = useLocaleContext();
  const carouselRef = useRef(null);
  const [data,setData]=useState([]);
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const response=await axios.get("https://localhost:7202/api/Genres/1");
        setData(response.data.data);
      }
      catch(error)
      {
        console.log(error);
      }
    }
    fetchData()
  },[])

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

  const handleClick = (name) => {
    onSelectCategory?.(name);
  };

  return (
    <swiper-container
      ref={carouselRef}
      init="false"
      slides-per-view="auto"
      dir={direction}
      space-between="16"
    >
      {/* Toolbar above carousel */}
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

      {/* Render categories */}
      {data.map(({ id, name, image }) => (
        <swiper-slide key={id} className="w-24">
          <Card
            onClick={() => handleClick(name)}
            tabIndex={0}
            aria-pressed={selectedCategory === name}
            className={`w-full shrink-0 cursor-pointer px-2 py-4 text-center border rounded-xl
              shadow-sm transition-all duration-200
              ${
                selectedCategory === name
                  ? "border-primary-500 ring-2 ring-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-700 dark:text-white"
                  : "border-gray-300 dark:border-dark-500 bg-white dark:bg-dark-600 text-gray-800 dark:text-dark-100"
              }
              hover:scale-105 hover:shadow-md
            `}
          >
            <img alt={name} src={image} loading="lazy" className="mx-auto w-12 rounded-md" />
            <p className="truncate pt-2 font-medium tracking-wide">{name}</p>
          </Card>
        </swiper-slide>
      ))}
    </swiper-container>
  );
}
