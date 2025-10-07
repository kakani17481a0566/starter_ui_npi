// src/app/pages/forms/StudentRegistrationForm/components/FeeTable.jsx
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { TagIcon } from "@heroicons/react/24/outline";
import { Input, Checkbox } from "components/ui";
import { useEffect, useState, useMemo, useCallback } from "react";

// INR formatter
const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(val || 0));

// helper: round to 2 decimals to stabilize floats
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

function FeeTable({
  setCurrentStep,
  selectedPackage,
  selectedCorporate,
  onFeeDataChange
}) {
  const [discountMode, setDiscountMode] = useState("individual");
  const isGlobalMode = discountMode === "global";

  // Generate fee rows from selected package - FIXED VERSION
  const collectionList = useMemo(() => {
    if (!selectedPackage) return [];

    // Create base rows from ALL fee items in the selected package
    const baseRows = selectedPackage.items.map((item, index) => ({
      id: index + 1,
      name: item.feeStructureName,
      monthly_fee: item.paymentPeriodName === "Monthly" ? item.amount : 0,
      term_fee: item.paymentPeriodName === "Term" ? item.amount : 0,
      annual_fee: item.paymentPeriodName === "Annual" ? item.amount : 0,
      gst: 0,
      discount: 0,
      specialDiscount: 0,
      enableDiscount: false,
      enableSpecialDiscount: false,
      enableCorporateDiscount: true,
      isEditable: false,
      originalItem: item // Keep reference to original data
    }));

    // Add optional additional services
    const additionalRows = ["Transport", "Meals"].map((name, idx) => ({
      id: baseRows.length + idx + 1,
      name,
      monthly_fee: 0,
      term_fee: 0,
      annual_fee: 0,
      gst: 0,
      discount: 0,
      specialDiscount: 0,
      enableDiscount: false,
      enableSpecialDiscount: false,
      enableCorporateDiscount: true,
      isEditable: true,
    }));

    return [...baseRows, ...additionalRows];
  }, [selectedPackage]);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: { fees: collectionList, globalDiscount: 0 },
  });

  // Watch fees and globalDiscount
  const fees = watch("fees") || [];
  const globalDiscount = Number(watch("globalDiscount")) || 0;

  // Reset when package changes
  useEffect(() => {
    reset({ fees: collectionList, globalDiscount: 0 });
    setDiscountMode("individual");
  }, [collectionList, reset]);

  // Notify parent when fee data changes
  useEffect(() => {
    if (onFeeDataChange && fees.length > 0) {
      const feeData = {
        fees,
        globalDiscount,
        discountMode,
        totals: calculateTotals()
      };
      onFeeDataChange(feeData);
    }
  }, [fees, globalDiscount, discountMode, onFeeDataChange]);

  // If corporate selected, disable regular discounts and switch to individual mode
  useEffect(() => {
    if (selectedCorporate && fees.length > 0) {
      fees.forEach((_, index) => {
        setValue(`fees.${index}.enableDiscount`, false);
        setValue(`fees.${index}.discount`, 0);
        setValue(`fees.${index}.enableCorporateDiscount`, true);
      });
      setDiscountMode("individual");
      setValue("globalDiscount", 0);
    } else if (fees.length > 0) {
      fees.forEach((_, index) => {
        setValue(`fees.${index}.enableCorporateDiscount`, false);
      });
    }
  }, [selectedCorporate, setValue, fees]);

  const onSubmit = (data) => {
    console.log("Submitted fee data:", {
      ...data,
      selectedPackage: {
        packageMasterId: selectedPackage.packageMasterId,
        packageName: selectedPackage.packageName,
        courseId: selectedPackage.courseId,
        courseName: selectedPackage.courseName
      },
      selectedCorporate,
      totals: calculateTotals()
    });
    setCurrentStep?.(1);
  };

  // Memoized calculation function
  const calculateRowTotals = useCallback((row) => {
    const base = round2(
      (Number(row.monthly_fee) || 0) +
      (Number(row.term_fee) || 0) +
      (Number(row.annual_fee) || 0)
    );

    const gstPercent = Math.max(0, Number(row.gst) || 0);
    const gstWithoutDiscount = round2((base * gstPercent) / 100);
    const totalWithoutDiscount = round2(base + gstWithoutDiscount);

    let subtotal = base;
    let corporateDiscountValue = 0;
    let discountValue = 0;
    let specialDiscountValue = 0;

    // Corporate discount first
    if (selectedCorporate && row.enableCorporateDiscount) {
      const corporateDiscountPercent = Math.max(0, Number(selectedCorporate.discount) || 0);
      corporateDiscountValue = round2((subtotal * corporateDiscountPercent) / 100);
      subtotal = round2(Math.max(0, subtotal - corporateDiscountValue));
    }

    // Regular discount second
    if (!selectedCorporate && row.enableDiscount) {
      const discountPercent = isGlobalMode
        ? Math.max(0, globalDiscount)
        : Math.max(0, Number(row.discount) || 0);

      discountValue = round2((subtotal * discountPercent) / 100);
      subtotal = round2(Math.max(0, subtotal - discountValue));
    }

    // Special discount third
    if (row.enableSpecialDiscount) {
      const specialPercent = Math.max(0, Number(row.specialDiscount) || 0);
      specialDiscountValue = round2((subtotal * specialPercent) / 100);
      subtotal = round2(Math.max(0, subtotal - specialDiscountValue));
    }

    // GST on final discounted amount
    const gstWithDiscount = round2((subtotal * gstPercent) / 100);
    const totalAfterDiscount = round2(subtotal + gstWithDiscount);

    return {
      base,
      totalWithoutDiscount,
      corporateDiscountValue,
      discountValue,
      specialDiscountValue,
      totalAfterDiscount,
    };
  }, [selectedCorporate, isGlobalMode, globalDiscount]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const withDiscount = {
      base: 0,
      discount: 0,
      specialDiscount: 0,
      corporateDiscount: 0,
      finalAmount: 0,
    };
    const withoutDiscount = { base: 0, finalAmount: 0 };

    fees.forEach((row) => {
      const rowTotals = calculateRowTotals(row);

      withoutDiscount.base = round2(withoutDiscount.base + rowTotals.base);
      withoutDiscount.finalAmount = round2(
        withoutDiscount.finalAmount + rowTotals.totalWithoutDiscount
      );

      withDiscount.base = round2(withDiscount.base + rowTotals.base);
      withDiscount.discount = round2(withDiscount.discount + rowTotals.discountValue);
      withDiscount.specialDiscount = round2(
        withDiscount.specialDiscount + rowTotals.specialDiscountValue
      );
      withDiscount.corporateDiscount = round2(
        withDiscount.corporateDiscount + rowTotals.corporateDiscountValue
      );
      withDiscount.finalAmount = round2(
        withDiscount.finalAmount + rowTotals.totalAfterDiscount
      );
    });

    const totalSavings = round2(withoutDiscount.finalAmount - withDiscount.finalAmount);

    return {
      totalsWith: withDiscount,
      totalsWithout: withoutDiscount,
      totalSavings
    };
  }, [fees, calculateRowTotals]);

  const { totalsWith, totalsWithout, totalSavings } = calculateTotals();

  // Handlers
  const handleGlobalDiscount = (value) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));
    setValue("globalDiscount", numValue);

    if (isGlobalMode) {
      fees.forEach((row, index) => {
        if (row.enableDiscount) {
          setValue(`fees.${index}.discount`, numValue);
        }
      });
    }
  };

  const handleDiscountToggle = (index, checked) => {
    setValue(`fees.${index}.enableDiscount`, checked);
    if (!checked) {
      setValue(`fees.${index}.discount`, 0);
    } else if (isGlobalMode) {
      setValue(`fees.${index}.discount`, globalDiscount);
    }
  };

  const handleCorporateDiscountToggle = (index, checked) => {
    setValue(`fees.${index}.enableCorporateDiscount`, checked);
  };

  const handleSpecialDiscountToggle = (index, checked) => {
    setValue(`fees.${index}.enableSpecialDiscount`, checked);
    if (!checked) setValue(`fees.${index}.specialDiscount`, 0);
  };

  const handleIndividualDiscountChange = (index, value) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));
    setValue(`fees.${index}.discount`, numValue);
  };

  const handleSpecialDiscountChange = (index, value) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));
    setValue(`fees.${index}.specialDiscount`, numValue);
  };

  const handleDiscountModeChange = (mode) => {
    setDiscountMode(mode);

    if (mode === "global") {
      fees.forEach((row, index) => {
        if (row.enableDiscount) {
          setValue(`fees.${index}.discount`, globalDiscount);
        }
      });
    }
  };

  if (!selectedPackage) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-gray-500">
        Select a fee package to view fees
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Package Info */}
      {selectedPackage && (
        <div className="bg-primary-50 p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary-800">
                {selectedPackage.packageName} ({selectedPackage.courseName})
              </h3>
              <p className="text-sm text-primary-600">
                Package includes {selectedPackage.items.length} fee components
              </p>
            </div>
            {selectedCorporate && (
              <div className="text-right">
                <div className="px-3 py-2 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">
                    Corporate Discount
                  </p>
                  <p className="text-sm text-green-700">
                    {selectedCorporate.name} - {selectedCorporate.discount}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Discount Control */}
      {!selectedCorporate && (
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Regular Discount:</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={globalDiscount}
                onChange={(e) => handleGlobalDiscount(e.target.value)}
                className={`h-8 w-16 border rounded px-2 text-sm text-center pr-6 ${
                  isGlobalMode ? "bg-white" : "bg-gray-100"
                }`}
                placeholder="0"
                disabled={!isGlobalMode}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                %
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={isGlobalMode}
                  onChange={() => handleDiscountModeChange("global")}
                  className="h-4 w-4 text-primary-600"
                />
                Apply Global Percentage
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={!isGlobalMode}
                  onChange={() => handleDiscountModeChange("individual")}
                  className="h-4 w-4 text-primary-600"
                />
                Set Per Row
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary-50 text-primary-700">
            <tr>
              <th className="px-4 py-3 text-center">
                <TagIcon className="w-4 h-4 inline mr-1" /> Fee Head
              </th>
              <th className="px-4 py-3 text-center">Monthly (₹)</th>
              <th className="px-4 py-3 text-center">Term (₹)</th>
              <th className="px-4 py-3 text-center">Annual (₹)</th>
              <th className="px-4 py-3 text-center">GST (%)</th>
              <th className="px-4 py-3 text-center">
                {selectedCorporate ? "Corporate (%)" : "Regular (%)"}
              </th>
              <th className="px-4 py-3 text-center">Special (%)</th>
              <th className="px-4 py-3 text-center">Net Amount (₹)</th>
              <th className="px-4 py-3 text-center">Gross Total (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fees.map((row, index) => {
              const { totalAfterDiscount, totalWithoutDiscount } = calculateRowTotals(row);
              const readOnlyProps = row.isEditable ? {} : { readOnly: true, disabled: true };
              const isRegularDiscountInputDisabled =
                !row.enableDiscount ||
                !!selectedCorporate ||
                isGlobalMode;

              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center font-medium">
                    {row.name}
                    {row.isEditable && (
                      <span className="ml-1 text-xs text-blue-600">(Editable)</span>
                    )}
                  </td>

                  {["monthly_fee", "term_fee", "annual_fee"].map((field) => (
                    <td key={field} className="px-4 py-2 text-center">
                      <Controller
                        name={`fees.${index}.${field}`}
                        control={control}
                        render={({ field: formField }) => (
                          <Input
                            {...formField}
                            type="number"
                            min="0"
                            className="h-8 text-xs text-center"
                            prefix="₹"
                            {...readOnlyProps}
                            onChange={(e) => formField.onChange(Number(e.target.value) || 0)}
                          />
                        )}
                      />
                    </td>
                  ))}

                  <td className="px-4 py-2 text-center">
                    <Controller
                      name={`fees.${index}.gst`}
                      control={control}
                      render={({ field }) => (
                        <div className="relative flex justify-center">
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="100"
                            className="h-8 w-20 text-xs text-center pr-5"
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">%</span>
                        </div>
                      )}
                    />
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {selectedCorporate ? (
                        <div className="flex items-center justify-center gap-2">
                          <Controller
                            name={`fees.${index}.enableCorporateDiscount`}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value}
                                onChange={(e) => handleCorporateDiscountToggle(index, e.target.checked)}
                                className="h-4 w-4 text-green-600"
                              />
                            )}
                          />
                          <div className="relative">
                            <input
                              type="number"
                              value={selectedCorporate.discount}
                              className={`h-8 w-20 border rounded text-xs text-center pr-5 ${
                                row.enableCorporateDiscount
                                  ? "bg-green-50 text-green-700 font-semibold"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                              disabled
                              readOnly
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">%</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Controller
                            name={`fees.${index}.enableDiscount`}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value}
                                onChange={(e) => handleDiscountToggle(index, e.target.checked)}
                                className="h-4 w-4"
                              />
                            )}
                          />
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={row.discount}
                              onChange={(e) => handleIndividualDiscountChange(index, e.target.value)}
                              className={`h-8 w-20 border rounded text-xs text-center pr-5 ${
                                isRegularDiscountInputDisabled ? "bg-gray-100" : "bg-white"
                              }`}
                              disabled={isRegularDiscountInputDisabled}
                              placeholder="0"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Controller
                        name={`fees.${index}.enableSpecialDiscount`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => handleSpecialDiscountToggle(index, e.target.checked)}
                            className="h-4 w-4"
                          />
                        )}
                      />
                      <Controller
                        name={`fees.${index}.specialDiscount`}
                        control={control}
                        render={({ field }) => (
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="100"
                              className="h-8 w-20 text-xs text-center pr-5"
                              disabled={!row.enableSpecialDiscount}
                              onChange={(e) => handleSpecialDiscountChange(index, e.target.value)}
                              placeholder="0"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">%</span>
                          </div>
                        )}
                      />
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center font-semibold text-green-700">
                    {formatINR(totalAfterDiscount)}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold text-blue-700">
                    {formatINR(totalWithoutDiscount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-600">Base Total</p>
            <p className="font-semibold text-lg">
              {formatINR(totalsWith.base)}
            </p>
          </div>
          {selectedCorporate && (
            <div>
              <p className="text-gray-600">Corporate Discount</p>
              <p className="font-semibold text-lg text-green-600">
                - {formatINR(totalsWith.corporateDiscount)}
              </p>
            </div>
          )}
          {!selectedCorporate && (
            <div>
              <p className="text-gray-600">Regular Discount</p>
              <p className="font-semibold text-lg text-orange-600">
                - {formatINR(totalsWith.discount)}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-600">Special Discount</p>
            <p className="font-semibold text-lg text-purple-600">
              - {formatINR(totalsWith.specialDiscount)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Final Amount Due</p>
            <p className="font-bold text-xl text-green-700">
              {formatINR(totalsWith.finalAmount)}
            </p>
          </div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <p className="font-bold text-blue-700">Gross Total (No Discount)</p>
            <p className="font-bold text-blue-700">
              {formatINR(totalsWithout.finalAmount)}
            </p>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between border-t pt-2">
              <p className="font-semibold text-orange-600">Total Savings</p>
              <p className="font-bold text-orange-600">
                {formatINR(totalSavings)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 bg-gray-50 border-t">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-gray-700"
        >
          Save Fee Details
        </button>
      </div>
    </div>
  );
}

FeeTable.propTypes = {
  setCurrentStep: PropTypes.func,
  selectedPackage: PropTypes.object,
  selectedCorporate: PropTypes.object,
  onFeeDataChange: PropTypes.func,
};

export default FeeTable;