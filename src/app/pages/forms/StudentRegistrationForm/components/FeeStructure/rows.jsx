// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { formatNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function NameCell({  getValue }) {
  const val = getValue();
  return (
    <div className="flex items-center space-x-4 ">
      <div className="size-10">
       <span className="font-medium text-gray-800 dark:text-dark-100">
        {val}
      </span>
      </div>
      
    </div>
  );
}

export function MonthlyFeeCell({ getValue }) {
  return <> {formatter.format(getValue())}</>;
}

export function DiscountCell({ getValue }) {
  const val = getValue();

  return (
    <span
      className={clsx(
        "font-semibold",
        val > 0
          ? "text-success dark:text-success-light"
          : "text-error dark:text-error-light",
      )}
    >
      {val}%
    </span>
  );
}

export function TermFeeCell({ getValue }) {
  return <>{formatNumber(getValue())}</>;
}

export function AnnualFeeCell({ getValue }) {
  return <>{getValue().toLocaleString("en-US")}</>;
}

NameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

MonthlyFeeCell.propTypes = {
  getValue: PropTypes.func,
};

DiscountCell.propTypes = {
  getValue: PropTypes.func,
};

TermFeeCell.propTypes = {
  getValue: PropTypes.func,
};

AnnualFeeCell.propTypes = {
  getValue: PropTypes.func,
};
