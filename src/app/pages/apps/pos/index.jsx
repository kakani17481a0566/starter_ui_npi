import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Categories } from "./Categories";
import { Basket } from "./Basket";
import CoursesDatatable from "./courses-datatable";
import { useState } from "react";
import { toast } from "sonner";

export default function Pos() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [basketItems, setBasketItems] = useState([]);

  const addToBasket = (course) => {
    setBasketItems((prev) => {
      const existing = prev.find((item) => item.course_id === course.course_id);
      if (existing) {
        const updated = prev.map((item) =>
          item.course_id === course.course_id
            ? { ...item, count: item.count + 1 }
            : item
        );
        toast.success(`${course.name} quantity increased`, { position: "top-center" });
        return updated;
      }

      toast.success(`${course.name} added to basket`, { position: "top-center" });
      return [
        ...prev,
        {
          uid: course.course_id,
          course_id: course.course_id,
          name: course.name,
          count: 1,
          image: course.image || "/images/800x600.png",
          price: course.price,
          description: course.category || "No description",
        },
      ];
    });
  };

  const handleIncrease = (uid) => {
    setBasketItems((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const handleDecrease = (uid) => {
    setBasketItems((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, count: item.count - 1 } : item
      )
    );
  };

  const handleRemove = (uid) => {
    setBasketItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  return (
    <Page title="Point of Sales App">
      <Header />
      <main className="main-content transition-content grid grid-cols-12 gap-4 px-(--margin-x) pb-6 pt-5 sm:gap-5 lg:gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          <Categories onCategorySelect={setSelectedCategory} />
          <CoursesDatatable categoryId={selectedCategory} onRowClick={addToBasket} />
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-5 xl:col-span-4">
          <div className="sm:sticky sm:top-20 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-50 max-sm:bg-white dark:max-sm:bg-dark-800">
            <Basket
              items={basketItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </main>
      <Sidebar />
    </Page>
  );
}
