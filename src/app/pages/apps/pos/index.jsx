// src/app/pages/apps/pos/index.jsx
import { useState } from "react";
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Categories } from "./Categories";
import { Basket } from "./Basket";
import CoursesDatatable from "./courses-datatable";

export default function Pos() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [basketItems, setBasketItems] = useState([]);

  // 🛒 Add to Basket
  const addToBasket = (item) => {
    setBasketItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        // already in basket → increase quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, count: i.count + 1 } : i
        );
      }

      // new item → add to basket
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          count: 1,
          image: item.image || "/images/800x600.png",
          price: Number(item.price) || 0,
          description: item.categoryName || "No description",
        },
      ];
    });
  };

  // ➕ Increase
  const handleIncrease = (id) => {
    setBasketItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, count: i.count + 1 } : i))
    );
  };

  // ➖ Decrease
  const handleDecrease = (id) => {
    setBasketItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, count: Math.max(i.count - 1, 0) } : i
        )
        .filter((i) => i.count > 0)
    );
  };

  // ❌ Remove
  const handleRemove = (id) => {
    setBasketItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Page title="Point of Sales App">
      <Header />

      <main className="main-content transition-content grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-5 pb-6 pt-5">
        {/* 📦 Product Section */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          <Categories onCategorySelect={setSelectedCategory} />
          <CoursesDatatable
            categoryId={selectedCategory}
            onRowClick={addToBasket}
          />
        </div>

        {/* 🧺 Basket Section */}
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
