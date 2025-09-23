// Checkout.jsx
import { useState } from "react";
import {
  CreditCardIcon,
  QrCodeIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Button, Input } from "components/ui";

export function Checkout({ subtotal, gst, total }) {
  const [method, setMethod] = useState(null);
  const [cashPaid, setCashPaid] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const remaining = cashPaid ? (Number(cashPaid) - total).toFixed(2) : null;
  const handlePayment=()=>{

  }

  return (
    <div>
      {/* Totals */}
      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
      <div className="space-y-2">
        <div className="flex justify-between text-gray-800 dark:text-dark-100">
          <p>Subtotal</p>
          <p className="font-medium tracking-wide">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-xs-plus">
          <p>Tax (5%)</p>
          <p className="font-medium tracking-wide">${gst.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-primary-600 dark:text-primary-400">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment options */}
      <div className="mt-5 grid grid-cols-3 gap-4 text-center">
        <Button
          variant={method === "cash" ? "primary" : "outlined"}
          className="flex-col py-3"
          onClick={() => setMethod("cash")}
        >
          <WalletIcon className="size-10 stroke-1 opacity-80" />
          <span className="mt-1">Cash</span>
        </Button>

        <Button
          variant={method === "card" ? "primary" : "outlined"}
          className="flex-col py-3"
          onClick={() => setMethod("card")}
        >
          <CreditCardIcon className="size-10 stroke-1 opacity-80" />
          <span className="mt-1">Card</span>
        </Button>

        <Button
          variant={method === "qr" ? "primary" : "outlined"}
          className="flex-col py-3"
          onClick={() => setMethod("qr")}
        >
          <QrCodeIcon className="size-10 stroke-1 opacity-80" />
          <span className="mt-1">QR</span>
        </Button>
      </div>

      {/* Dynamic Section */}
      <div className="mt-4 space-y-3">
        {method === "cash" && (
          <div>
            <label className="block text-sm font-medium">Enter Cash Paid</label>
            <Input
              type="number"
              value={cashPaid}
              onChange={(e) => setCashPaid(e.target.value)}
              placeholder="Enter amount"
              className="mt-1"
            />
            {cashPaid && (
              <p
                className={`mt-2 font-medium ${
                  Number(cashPaid) < total
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {Number(cashPaid) < total
                  ? `Remaining: $${(total - cashPaid).toFixed(2)}`
                  : `Change: $${remaining}`}
              </p>
            )}
          </div>
        )}

        {method === "card" && (
          <div className="space-y-2">
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
              <Input
                placeholder="CVV"
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
              />
            </div>
          </div>
        )}

        {method === "qr" && (
          <div className="flex flex-col items-center">
            <img
              src="/images/categories/qrcode.jpg"
              alt="QR Code"
              className="w-40 h-40"
            />
            <p className="mt-2 text-sm text-gray-500">Scan to pay</p>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <Button color="primary" className="mt-5 h-11 w-full justify-between" onClick={handlePayment}>
        <span>Checkout</span>
        <span>${total.toFixed(2)}</span>
      </Button>
    </div>
  );
}
