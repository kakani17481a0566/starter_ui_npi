// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Badge } from "components/ui";
import { courseStatusOptions } from "./data";

// ----------------------------------------------------------------------

export function CourseNameCell({ row, getValue }) {
  const name = getValue?.() ?? "Unnamed Course";

  return (
    <div className="flex max-w-xs items-center space-x-4 2xl:max-w-sm">
      <div className="size-12 shrink-0">
        <img
          className="h-full w-full rounded-lg object-cover object-center"
          src={row.original.image}
          alt={name}
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate">
          <a
            href="javascript:void(0)"
            className="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400"
          >
            {name}
          </a>
        </p>
      </div>
    </div>
  );
}

export function StatusCell({ getValue }) {
  const val = getValue?.();
  const option = courseStatusOptions.find((item) => item.value === val);

  return (
    <Badge
      color={option?.color ?? "gray"}
      className="rounded-full"
      variant="outlined"
    >
      {option?.label ?? val ?? "Unknown"}
    </Badge>
  );
}

export function PriceCell({ getValue }) {
  const value = getValue?.();

  // ✅ Format in INR
  const formatINR = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(val || 0));

  return <>{value != null ? formatINR(value) : "—"}</>;
}

// ----------------------------------------------------------------------
// ✅ PropTypes

CourseNameCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      image: PropTypes.string,
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
