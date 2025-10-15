// ----------------------------------------------------------------------
// Import Dependencies
// ----------------------------------------------------------------------
import PropTypes from "prop-types";
import { Badge } from "components/ui";

// ----------------------------------------------------------------------
// 🧾 Item Name Cell
// ----------------------------------------------------------------------
export function ItemNameCell({ row, getValue }) {
  const name = getValue?.() ?? "Unnamed Item";
  const image = row.original.image || "/images/placeholder.png";
  const category = row.original.categoryName || "Uncategorized";

  return (
    <div className="flex max-w-xs items-center gap-3 2xl:max-w-sm">
      {/* Thumbnail */}
      <div className="size-12 shrink-0">
        <img
          className="h-full w-full rounded-lg object-cover border border-gray-200 dark:border-dark-600"
          src={image}
          alt={name}
          onError={(e) => (e.target.src = "/images/placeholder.png")}
          loading="lazy"
        />
      </div>

      {/* Text Info */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-800 dark:text-dark-100">
          {name}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-dark-400">
          {category}
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ✅ Status Cell (dynamic colors from backend)
// ----------------------------------------------------------------------
const STATUS_COLOR_MAP = {
  available: "success",
  "not available": "error",
};

export function StatusCell({ getValue }) {
  const val = getValue?.() ?? "Unknown";
  const normalized = val.toLowerCase();

  const color =
    STATUS_COLOR_MAP[normalized] ??
    (normalized.includes("available") && !normalized.includes("not")
      ? "success"
      : normalized.includes("not")
      ? "error"
      : "gray");

  return (
    <Badge
      color={color}
      variant="outlined"
      className="rounded-full text-xs capitalize"
    >
      {val}
    </Badge>
  );
}

// ----------------------------------------------------------------------
// 💰 Price Cell
// ----------------------------------------------------------------------
export function PriceCell({ getValue }) {
  const value = getValue?.();
  if (value == null) return <span>—</span>;

  return (
    <span className="font-medium text-primary-700 dark:text-primary-400">
      ₹{Number(value).toLocaleString("en-IN")}
    </span>
  );
}

// ----------------------------------------------------------------------
// ✅ PropTypes
// ----------------------------------------------------------------------
ItemNameCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      image: PropTypes.string,
      categoryName: PropTypes.string,
    }),
  }),
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
};

PriceCell.propTypes = {
  getValue: PropTypes.func,
};
