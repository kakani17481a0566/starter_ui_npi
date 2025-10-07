import PropTypes from "prop-types";
import { Button, Select } from "components/ui";
import { toast } from "sonner";

const studentsMock = [
  { value: 1, label: "Abhiram Charan" },
  { value: 2, label: "Priya Sharma" },
  { value: 3, label: "Rohit Kumar" },
];

export function AssignSection({
  items = [],
  onAssignBooks,
  selectedStudent,
  onSelectStudent,
}) {
  const totalBooks = items.length;

  const handleAssign = () => {
    console.log("👉 handleAssign called, selectedStudent:", selectedStudent);

    if (!selectedStudent) {
      toast.error("❌ Please select a student before assigning books");
      return;
    }
    if (totalBooks === 0) {
      toast.error("❌ Basket is empty");
      return;
    }

    console.log("✅ Assigning books to:", selectedStudent, "items:", items);
    onAssignBooks?.(selectedStudent, items);
  };

  return (
    <div className="mt-5 space-y-4 border-t border-gray-200 pt-4 dark:border-dark-500">
      <div className="flex justify-between text-gray-800 dark:text-dark-100">
        <p className="font-medium">Total Books</p>
        <p className="font-semibold">{totalBooks} / 3</p>
      </div>

      <Select
        value={selectedStudent?.value || ""}
        onChange={(e) => {
          let val = e?.target?.value;
          if (val !== undefined && val !== null) {
            val = Number(val);
          }

          const found = studentsMock.find((s) => s.value === val);
          console.log("🔍 Final mapped student:", found);

          onSelectStudent(found || null);
        }}
        placeholder="Select student"
        data={studentsMock}
      />

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
  selectedStudent: PropTypes.object,
  onSelectStudent: PropTypes.func,
};
