// src/app/pages/dashboards/Parent/FeeSummaryCard.jsx
// import { Avatar, Card, Input } from "components/ui";
import { Avatar, Card } from "components/ui";

import {
  UserIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { useState } from "react";

// export default function FeeSummaryCard({ feeReport, isLoading, onPaymentSuccess }) {

export default function FeeSummaryCard({ feeReport, isLoading }) {
  // const [paymentAmount, setPaymentAmount] = useState(feeReport?.pendingFee || "");
  // const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  if (isLoading) {
    return (
      <Card className="col-span-12 lg:col-span-4 p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!feeReport) {
    return (
      <Card className="col-span-12 lg:col-span-4 p-6 text-center">
        <CurrencyRupeeIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500 text-xs">No fee data</p>
      </Card>
    );
  }

  // After payment completion, show no balance state
  if (paymentCompleted) {
    return (
      <Card className="col-span-12 lg:col-span-4 p-6 text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div className="flex flex-col items-center justify-center">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Payment Successful!
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            Your fee payment has been processed successfully.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 w-full max-w-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Student:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {feeReport.studentName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Amount Paid:</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                ₹{feeReport.pendingFee.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            className="mt-4 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            onClick={() => setPaymentCompleted(false)}
          >
            View Fee Details
          </button>
        </div>
      </Card>
    );
  }

  const progress = (feeReport.totalPaid / feeReport.totalFee) * 100;
  const isFullyPaid = feeReport.pendingFee === 0;

  // const handlePayNow = () => {
  //   setShowPaymentOptions(true);
  // };

  // const handleAmountChange = (e) => {
  //   const value = e.target.value;
  //   if (
  //     value === "" ||
  //     (Number(value) >= 0 && Number(value) <= feeReport.pendingFee)
  //   ) {
  //     setPaymentAmount(value);
  //   }
  // };

  // const handlePaymentSuccess = () => {
  //   setShowPaymentOptions(false);
  //   setPaymentCompleted(true);
  //   setPaymentAmount("");

    // 🔹 Notify parent (Fee.jsx) to refresh table + summary
  //   onPaymentSuccess?.();
  // };

  // const handleCancelPayment = () => {
  //   setShowPaymentOptions(false);
  // };

  // const amountToPay = paymentAmount || feeReport.pendingFee;

  return (
    <Card className="col-span-12 lg:col-span-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Compact Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Avatar
            size={12}
            name={feeReport.studentName}
            initialColor={isFullyPaid ? "success" : "primary"}
            initialVariant="soft"
            className="border border-white dark:border-gray-800"
          />
          {isFullyPaid && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border border-white dark:border-gray-800">
              <CheckCircleIcon className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {feeReport.studentName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {feeReport.courseName}
          </p>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isFullyPaid
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
          }`}
        >
          {isFullyPaid ? "Paid" : "Due"}
        </div>
      </div>

      {/* Student ID */}
      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          <UserIcon className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs text-gray-600 dark:text-gray-300">ID</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white text-xs">
          #{feeReport.studentId}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-300">Progress</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              isFullyPaid ? "bg-green-400" : "bg-blue-400"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg mb-3 border border-red-100 dark:border-red-800">
        <div className="flex items-center gap-2">
          <XCircleIcon className="h-3.5 w-3.5 text-red-500" />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            Pending
          </span>
        </div>
        <span className="font-bold text-red-600 dark:text-red-400 text-sm">
          ₹{feeReport.pendingFee.toLocaleString()}
        </span>
      </div>

      {/* Payment Input & Button */}
      {/* {!isFullyPaid && (
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Payment Amount
            </label>
            <Input
              placeholder="Enter amount"
              className="h-7 py-1 text-xs"
              type="number"
              value={paymentAmount}
              onChange={handleAmountChange}
              max={feeReport.pendingFee}
            />
          </div>


          {!showPaymentOptions && (
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
              onClick={handlePayNow}
            >
              Pay ₹{amountToPay.toLocaleString()}
            </button>
          )}


          {showPaymentOptions && (
            <div className="space-y-1.5">
              <div className="text-center mb-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pay ₹{amountToPay.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-1.5 rounded text-xs font-medium transition-colors"
                  onClick={() => {
                    alert(`UPI Payment of ₹${amountToPay} initiated!`);
                    handlePaymentSuccess();
                  }}
                >
                  UPI
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded text-xs font-medium transition-colors"
                  onClick={() => {
                    alert(`Cash Payment of ₹${amountToPay} recorded!`);
                    handlePaymentSuccess();
                  }}
                >
                  Cash
                </button>
              </div>
              <button
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-1.5 rounded text-xs font-medium transition-colors"
                onClick={handleCancelPayment}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )} */}
    </Card>
  );
}

FeeSummaryCard.propTypes = {
  feeReport: PropTypes.shape({
    studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    studentName: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    totalFee: PropTypes.number.isRequired,
    totalPaid: PropTypes.number.isRequired,
    pendingFee: PropTypes.number.isRequired,
  }),
  isLoading: PropTypes.bool,
  onPaymentSuccess: PropTypes.func, // 🔹 new
};

FeeSummaryCard.defaultProps = {
  isLoading: false,
};
