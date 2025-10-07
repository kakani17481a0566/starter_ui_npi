// Lib.jsx

// Import Dependencies
import { useState } from "react";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Categories } from "./Categories";
import { Basket } from "./Basket";
import LibTable from "./LibTable";

// ----------------------------------------------------------------------

export default function Lib() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [basketItems, setBasketItems] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // always {value,label}

  // 🔹 Helper: normalize book identifier
  const getBookId = (book) =>
    book.book_id ?? book.bookId ?? book.id ?? book._id;

  // ➕ Add book
  const handleAddToBasket = (book) => {
    const bookId = getBookId(book);

    setBasketItems((prev) => {
      const existing = prev.find((item) => item.book_id === bookId);
      if (existing) {
        return prev.map((item) =>
          item.book_id === bookId ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { ...book, book_id: bookId, count: 1 }];
    });
  };

  // ➖ Decrease
  const handleDecreaseQuantity = (bookId) => {
    setBasketItems((prev) =>
      prev
        .map((item) =>
          item.book_id === bookId ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );
  };

  // ➕ Increase
  const handleIncreaseQuantity = (bookId) => {
    setBasketItems((prev) =>
      prev.map((item) =>
        item.book_id === bookId ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  // 🗑 Remove
  const handleRemoveFromBasket = (bookId) => {
    setBasketItems((prev) => prev.filter((item) => item.book_id !== bookId));
  };

  // 🧹 Clear all
  const handleClearBasket = () => {
    setBasketItems([]);
  };

  // 📚 Assign
  const handleAssignBooks = async (student, items) => {
    try {
      if (!student) {
        toast.error("❌ Please select a student");
        return;
      }
      if (items.length === 0) {
        toast.error("❌ Basket is empty");
        return;
      }

      console.log("Assigning books →", { student, items });

      // Example API call:
      // await fetch("/api/library/assign", { method: "POST", body: JSON.stringify({ student, items }) });

      toast.success(`✅ Books assigned to ${student.label}`);
      setBasketItems([]);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to assign books");
    }
  };

  // ✅ Ensure always storing {value,label}
  const handleSelectStudent = (option) => {
    setSelectedStudent(option);
  };

  return (
    <Page title="Library Book Assignment">
      <Header />
      <main className="main-content transition-content grid grid-cols-12 gap-4 px-(--margin-x) pb-6 pt-5 sm:gap-5 lg:gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          <Categories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <LibTable
            selectedCategory={selectedCategory}
            onAddToBasket={handleAddToBasket}
          />
        </div>

        {/* Basket */}
        <div className="max-sm:block sm:sticky sm:top-20 sm:col-span-6 sm:self-start lg:col-span-4">
          <Basket
            items={basketItems}
            onRemove={handleRemoveFromBasket}
            onClearBasket={handleClearBasket}
            onAssignBooks={handleAssignBooks}
            onIncrease={handleIncreaseQuantity}
            onDecrease={handleDecreaseQuantity}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
          />
        </div>
      </main>
      <Sidebar />
    </Page>
  );
}
