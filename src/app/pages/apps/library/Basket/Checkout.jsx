// Import Dependencies
import {
  CreditCardIcon,
  QrCodeIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Checkout({ items }) {
  // 🔹 Calculate totals
  const subtotal =
    items?.reduce((sum, item) => sum + Number(item.price) * item.count, 0) || 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  // Hide checkout if no items
  if (!items?.length) return null;

  return (
    <div>
      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
      <div className="space-y-2">
        <div className="flex justify-between text-gray-800 dark:text-dark-100">
          <p>Subtotal</p>
          <p className="font-medium tracking-wide">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-xs-plus">
          <p>Tax (5%)</p>
          <p className="font-medium tracking-wide">${tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-primary-600 dark:text-primary-400">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-5 grid grid-cols-3 gap-4 text-center">
        <Button variant="outlined" className="flex-col py-3">
          <WalletIcon className="size-10 stroke-1 opacity-80" />
          <span className="mt-1 text-primary-600 dark:text-primary-400">
            Cash
          </span>
        </Button>
        <Button variant="outlined" className="flex-col py-3">
          <CreditCardIcon className="size-10 stroke-1 opacity-80" />
          <span className="mt-1 text-primary-600 dark:text-primary-400">
            Debit
          </span>
        </Button>
        <Button variant="outlined" className="flex-col py-3">
          <QrCodeIcon className="size-10 stroke-1 opacity-80" />
          <span className="mt-1 text-primary-600 dark:text-primary-400">
            Scan
          </span>
        </Button>
      </div>

      {/* Checkout button */}
      <Button color="primary" className="mt-5 h-11 w-full justify-between">
        <span>Checkout</span>
        <span>${total.toFixed(2)}</span>
      </Button>
    </div>
  );
}

Checkout.propTypes = {
  items: PropTypes.array,
};
