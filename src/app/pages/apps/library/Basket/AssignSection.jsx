import PropTypes from "prop-types";
import { Button } from "components/ui";
import { toast } from "sonner";
import axios from "axios";

export function AssignSection({
  items = [],
  onAssignBooks,
  selectedStudent, // studentId (number)
}) {
  const totalBooks = items.length;

  const handleAssign = async () => {
    if (!selectedStudent) {
      toast.error("❌ No student selected");
      return;
    }

    if (totalBooks === 0) {
      toast.error("❌ Basket is empty");
      return;
    }
    const payload = {
      studentId: selectedStudent,     
      checkInBy: 1,                    
      bookIds: items.map((b) => b.book_id),
    };

    console.log("📦 Final Payload →", payload);

    try {
      const res = await axios.post("https://localhost:7202/api/LibraryTransaction", payload);
      // console.log(res);
      if(res.data.data==="assigned"){
      toast.success("✅ Books assigned successfully");
      }
      onAssignBooks?.(selectedStudent, items); // optional callback to parent
    } catch (error) {
      console.error("❌ Error assigning books", error);
      toast.error("❌ Failed to assign books");
    }
  };

  return (
    <div className="mt-5 space-y-4 border-t border-gray-200 pt-4 dark:border-dark-500">
      <div className="flex justify-between text-gray-800 dark:text-dark-100">
        <p className="font-medium">Total Books</p>
        <p className="font-semibold">{totalBooks} / 3</p>
      </div>

      <Button
        color="primary"
        disabled={!items.length}
        className="h-11 w-full justify-center"
        onClick={handleAssign}
      >
        Assign Books
      </Button>
    </div>
  );
}

AssignSection.propTypes = {
  items: PropTypes.array,
  onAssignBooks: PropTypes.func,
  selectedStudent: PropTypes.number,   // ✅ studentId is a number now
};
