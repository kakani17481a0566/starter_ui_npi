import PropTypes from "prop-types";
import { Button, Select } from "components/ui";

// Mock students (replace with API later)
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
  const totalBooks = items.reduce((sum, i) => sum + i.count, 0);

  const handleAssign = () => {
    if (!selectedStudent) {
      alert("Please select a student before assigning books.");
      return;
    }
    onAssignBooks?.(selectedStudent, items);
  };

  return (
    <div className="mt-5 space-y-4 border-t border-gray-200 pt-4 dark:border-dark-500">
      {/* Total Books */}
      <div className="flex justify-between text-gray-800 dark:text-dark-100">
        <p className="font-medium">Total Books</p>
        <p className="font-semibold">{totalBooks}</p>
      </div>

      {/* Student Selector */}
      <div>
        <Select
          value={selectedStudent}
          onChange={onSelectStudent}   // 🔹 always set {value,label}
          placeholder="Select student"
          data={studentsMock}
        />
      </div>

      {/* Assign Button */}
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
