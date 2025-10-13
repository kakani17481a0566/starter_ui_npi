// Lib.jsx

import { useState,useEffect } from "react";
import { toast } from "sonner";

// Local Imports
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Categories } from "./Categories";
import { Basket } from "./Basket";
import LibTable from "./LibTable";
import BookTable from "./PreviousBooks";
import{useLocation} from "react-router-dom";
import { fetchPreviousBooks } from "./PreviousBooks/data";

// ----------------------------------------------------------------------

export default function Lib() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [basketItems, setBasketItems] = useState([]);
  const [previousBooks, setPreviousBooks] = useState([]); 
  // const [selectedStudent, setSelectedStudent] = useState(null); // {value,label}
  const location=useLocation();
  const {studentId,studentName}=location.state;
 useEffect(() => {
    const loadPreviousBooks = async () => {
      try {
        if (!studentId) return;
        const result = await fetchPreviousBooks(studentId);
        setPreviousBooks(result.book || []);
      } catch (error) {
        console.error("Error fetching previous books", error);
      }
    };
    loadPreviousBooks();
  }, [studentId]);
  const getBookId = (book) =>
    book.book_id ?? book.bookId ?? book.id ?? book._id;

  // ➕ Add book (max 3 unique, 1 copy each)
  const handleAddToBasket = (book) => {
    const bookId = getBookId(book);

    setBasketItems((prev) => {
      if (prev.find((item) => item.book_id === bookId)) {
        toast.error("❌ This book is already in your basket");
        return prev;
      }
      if (prev.length >= 3) {
        toast.error("❌ You cannot have more than 3 books in your basket");
        return prev;
      }
      return [...prev, { ...book, book_id: bookId, count: 1 }];
    });
  };

  // ➖ Decrease = remove (only 1 copy allowed)
  const handleDecreaseQuantity = (bookId) => {
    setBasketItems((prev) => prev.filter((item) => item.book_id !== bookId));
  };

  // ➕ Increase not allowed
  const handleIncreaseQuantity = () => {
    toast.error("❌ You can only have one copy of each book");
  };

  // 🗑 Remove book
  const handleRemoveFromBasket = (bookId) => {
    setBasketItems((prev) => prev.filter((item) => item.book_id !== bookId));
  };

  // 🧹 Clear basket
  const handleClearBasket = () => {
    setBasketItems([]);
  };

  // 📚 Assign books
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

      toast.success(`✅ Books assigned to ${student.label}`);
      setBasketItems([]); // clear on success
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to assign books");
    }
  };

  // ✅ Ensure always storing {value,label}
  const handleSelectStudent = (option) => {
    if (!option) return;
    // setSelectedStudent(option);
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
            previousBooks={previousBooks} 
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
            selectedStudent={studentId}
            onSelectStudent={handleSelectStudent}
          />
          <BookTable data={previousBooks} studentId={studentId} studentName={studentName}/>

        </div>


      </main>
      <Sidebar />
    </Page>
  );
}
