// src/app/pages/forms/StudentRegistrationForm/components/FeeTable.jsx
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { TagIcon, ReceiptPercentIcon, ReceiptRefundIcon } from "@heroicons/react/24/outline";
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

    return baseRows;
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

  // CORRECTED Memoized calculation function
  const calculateRowTotals = useCallback((row) => {
    // Calculate base amount (sum of all period fees)
    const base = round2(
      (Number(row.monthly_fee) || 0) +
      (Number(row.term_fee) || 0) +
      (Number(row.annual_fee) || 0)
    );

    // Calculate GST on base amount
    const gstPercent = Math.max(0, Number(row.gst) || 0);
    const gstAmount = round2((base * gstPercent) / 100);

    // Gross Total = Base + GST
    const grossTotal = round2(base + gstAmount);

    let discountedBase = base;
    let corporateDiscountValue = 0;
    let discountValue = 0;
    let specialDiscountValue = 0;

    // Apply discounts on BASE amount only (before GST)
    // Corporate discount first
    if (selectedCorporate && row.enableCorporateDiscount) {
      const corporateDiscountPercent = Math.max(0, Number(selectedCorporate.discount) || 0);
      corporateDiscountValue = round2((discountedBase * corporateDiscountPercent) / 100);
      discountedBase = round2(Math.max(0, discountedBase - corporateDiscountValue));
    }

    // Regular discount second
    if (!selectedCorporate && row.enableDiscount) {
      const discountPercent = isGlobalMode
        ? Math.max(0, globalDiscount)
        : Math.max(0, Number(row.discount) || 0);

      discountValue = round2((discountedBase * discountPercent) / 100);
      discountedBase = round2(Math.max(0, discountedBase - discountValue));
    }

    // Special discount third
    if (row.enableSpecialDiscount) {
      const specialPercent = Math.max(0, Number(row.specialDiscount) || 0);
      specialDiscountValue = round2((discountedBase * specialPercent) / 100);
      discountedBase = round2(Math.max(0, discountedBase - specialDiscountValue));
    }

    // Calculate GST on final discounted base amount
    const finalGstAmount = round2((discountedBase * gstPercent) / 100);
    const netAmount = round2(discountedBase + finalGstAmount);

    return {
      base,
      grossTotal, // Base + GST (no discounts)
      corporateDiscountValue,
      discountValue,
      specialDiscountValue,
      netAmount, // Final amount after all discounts and GST
      totalDiscounts: round2(corporateDiscountValue + discountValue + specialDiscountValue),
      finalBaseAfterDiscounts: discountedBase,
      gstAmount: finalGstAmount
    };
  }, [selectedCorporate, isGlobalMode, globalDiscount]);

  // CORRECTED Calculate totals
  const calculateTotals = useCallback(() => {
    const withDiscount = {
      base: 0,
      grossTotal: 0,
      discount: 0,
      specialDiscount: 0,
      corporateDiscount: 0,
      totalDiscounts: 0,
      gstAmount: 0,
      finalAmount: 0,
    };
    const withoutDiscount = {
      base: 0,
      grossTotal: 0,
      gstAmount: 0
    };

    fees.forEach((row) => {
      const rowTotals = calculateRowTotals(row);

      // Without discount totals
      withoutDiscount.base = round2(withoutDiscount.base + rowTotals.base);
      withoutDiscount.grossTotal = round2(withoutDiscount.grossTotal + rowTotals.grossTotal);
      withoutDiscount.gstAmount = round2(withoutDiscount.gstAmount + (rowTotals.base * (Number(row.gst) || 0) / 100));

      // With discount totals
      withDiscount.base = round2(withDiscount.base + rowTotals.base);
      withDiscount.grossTotal = round2(withDiscount.grossTotal + rowTotals.grossTotal);
      withDiscount.discount = round2(withDiscount.discount + rowTotals.discountValue);
      withDiscount.specialDiscount = round2(withDiscount.specialDiscount + rowTotals.specialDiscountValue);
      withDiscount.corporateDiscount = round2(withDiscount.corporateDiscount + rowTotals.corporateDiscountValue);
      withDiscount.totalDiscounts = round2(withDiscount.totalDiscounts + rowTotals.totalDiscounts);
      withDiscount.gstAmount = round2(withDiscount.gstAmount + rowTotals.gstAmount);
      withDiscount.finalAmount = round2(withDiscount.finalAmount + rowTotals.netAmount);
    });

    const totalSavings = round2(withoutDiscount.grossTotal - withDiscount.finalAmount);

    return {
      totalsWith: withDiscount,
      totalsWithout: withoutDiscount,
      totalSavings
    };
  }, [fees, calculateRowTotals]);

  const { totalsWith, totalsWithout, totalSavings } = calculateTotals();

  // Handlers (remain the same)
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
        <div className="bg-primary-50 p-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-semibold text-primary-800 text-sm sm:text-base">
                {selectedPackage.packageName} ({selectedPackage.courseName})
              </h3>
              <p className="text-xs sm:text-sm text-primary-600">
                Package includes {selectedPackage.items.length} fee components
              </p>
            </div>
            {selectedCorporate && (
              <div className="text-right">
                <div className="px-2 py-1 bg-green-100 border border-green-300 rounded text-xs">
                  <p className="font-semibold text-green-800">
                    Corporate Discount
                  </p>
                  <p className="text-green-700">
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Regular Discount:</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={globalDiscount}
                  onChange={(e) => handleGlobalDiscount(e.target.value)}
                  className={`h-7 w-12 border rounded px-1 text-xs text-center pr-4 ${
                    isGlobalMode ? "bg-white" : "bg-gray-100"
                  }`}
                  placeholder="0"
                  disabled={!isGlobalMode}
                />
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  %
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    checked={isGlobalMode}
                    onChange={() => handleDiscountModeChange("global")}
                    className="h-3 w-3 text-primary-600"
                  />
                  Global
                </label>
                <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    checked={!isGlobalMode}
                    onChange={() => handleDiscountModeChange("individual")}
                    className="h-3 w-3 text-primary-600"
                  />
                  Per Row
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table with horizontal scroll and corrected order */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <table className="w-full text-xs">
            <thead className="bg-primary-50 text-primary-700">
              <tr>
                <th className="px-2 py-2 text-center min-w-[100px] whitespace-nowrap">
                  <TagIcon className="w-3 h-3 inline mr-1" /> Fee Head
                </th>
                <th className="px-1 py-2 text-center min-w-[70px] whitespace-nowrap">Monthly</th>
                <th className="px-1 py-2 text-center min-w-[60px] whitespace-nowrap">Term</th>
                <th className="px-1 py-2 text-center min-w-[70px] whitespace-nowrap">Annual</th>
                <th className="px-1 py-2 text-center min-w-[50px] whitespace-nowrap">GST%</th>
                <th className="px-1 py-2 text-center min-w-[90px] whitespace-nowrap">Gross Total</th>
                <th className="px-1 py-2 text-center min-w-[90px] whitespace-nowrap">
                  {selectedCorporate ? "Corporate%" : "Regular%"}
                </th>
                <th className="px-1 py-2 text-center min-w-[80px] whitespace-nowrap">Special%</th>
                <th className="px-1 py-2 text-center min-w-[80px] whitespace-nowrap">Net Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((row, index) => {
                const { netAmount, grossTotal } = calculateRowTotals(row);
                const readOnlyProps = row.isEditable ? {} : { readOnly: true, disabled: true };
                const isRegularDiscountInputDisabled =
                  !row.enableDiscount ||
                  !!selectedCorporate ||
                  isGlobalMode;

                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-2 py-1 text-center font-medium min-w-[100px]">
                      <div className="flex flex-col items-center">
                        <span className="text-xs whitespace-nowrap">{row.name}</span>
                        {row.isEditable && (
                          <span className="text-[10px] text-blue-600">(Editable)</span>
                        )}
                      </div>
                    </td>

                    {["monthly_fee", "term_fee", "annual_fee"].map((field) => (
                      <td key={field} className="px-1 py-1 text-center min-w-[60px]">
                        <Controller
                          name={`fees.${index}.${field}`}
                          control={control}
                          render={({ field: formField }) => (
                            <Input
                              {...formField}
                              type="number"
                              min="0"
                              className="h-6 text-xs text-center w-full min-w-[50px] px-1"
                              {...readOnlyProps}
                              onChange={(e) => formField.onChange(Number(e.target.value) || 0)}
                            />
                          )}
                        />
                      </td>
                    ))}

                    <td className="px-1 py-1 text-center min-w-[50px]">
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
                              className="h-6 w-12 text-xs text-center px-1"
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            />
                          </div>
                        )}
                      />
                    </td>

                    {/* Gross Total - Before discounts */}
                    <td className="px-1 py-1 text-center font-semibold text-blue-700 min-w-[90px] text-xs whitespace-nowrap">
                      {formatINR(grossTotal)}
                    </td>

                    <td className="px-1 py-1 text-center min-w-[90px]">
                      <div className="flex items-center justify-center gap-1">
                        {selectedCorporate ? (
                          <div className="flex items-center justify-center gap-1">
                            <Controller
                              name={`fees.${index}.enableCorporateDiscount`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value}
                                  onChange={(e) => handleCorporateDiscountToggle(index, e.target.checked)}
                                  className="h-3 w-3 text-green-600"
                                />
                              )}
                            />
                            <div className="relative">
                              <input
                                type="number"
                                value={selectedCorporate.discount}
                                className={`h-6 w-10 border rounded text-xs text-center px-1 ${
                                  row.enableCorporateDiscount
                                    ? "bg-green-50 text-green-700 font-semibold"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                                disabled
                                readOnly
                              />
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
                                  className="h-3 w-3"
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
                                className={`h-6 w-10 border rounded text-xs text-center px-1 ${
                                  isRegularDiscountInputDisabled ? "bg-gray-100" : "bg-white"
                                }`}
                                disabled={isRegularDiscountInputDisabled}
                                placeholder="0"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-1 py-1 text-center min-w-[80px]">
                      <div className="flex items-center justify-center gap-1">
                        <Controller
                          name={`fees.${index}.enableSpecialDiscount`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => handleSpecialDiscountToggle(index, e.target.checked)}
                              className="h-3 w-3"
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
                                className="h-6 w-10 text-xs text-center px-1"
                                disabled={!row.enableSpecialDiscount}
                                onChange={(e) => handleSpecialDiscountChange(index, e.target.value)}
                                placeholder="0"
                              />
                            </div>
                          )}
                        />
                      </div>
                    </td>

                    {/* Net Amount - Final amount after all discounts */}
                    <td className="px-1 py-1 text-center font-semibold text-green-700 min-w-[80px] text-xs whitespace-nowrap">
                      {formatINR(netAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CORRECTED Main Totals Summary with Icons */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Without Discount Section */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <ReceiptPercentIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-700 text-sm">Without Discount</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Base Amount:</span>
                <span className="font-semibold text-sm">{formatINR(totalsWithout.base)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">GST Amount:</span>
                <span className="font-semibold text-sm">{formatINR(totalsWithout.gstAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 text-sm font-bold">Gross Total:</span>
                <span className="font-bold text-blue-700 text-lg">{formatINR(totalsWithout.grossTotal)}</span>
              </div>
            </div>
          </div>

          {/* With Discount Section */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <ReceiptRefundIcon className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-700 text-sm">With Discount</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Base Amount:</span>
                <span className="font-semibold text-sm">{formatINR(totalsWith.base)}</span>
              </div>

              {selectedCorporate && totalsWith.corporateDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Corporate Discount:</span>
                  <span className="font-semibold text-green-600 text-sm">- {formatINR(totalsWith.corporateDiscount)}</span>
                </div>
              )}

              {!selectedCorporate && totalsWith.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Regular Discount:</span>
                  <span className="font-semibold text-orange-600 text-sm">- {formatINR(totalsWith.discount)}</span>
                </div>
              )}

              {totalsWith.specialDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Special Discount:</span>
                  <span className="font-semibold text-purple-600 text-sm">- {formatINR(totalsWith.specialDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">GST Amount:</span>
                <span className="font-semibold text-sm">{formatINR(totalsWith.gstAmount)}</span>
              </div>

              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-bold text-sm">Final Amount:</span>
                <span className="font-bold text-green-700 text-lg">{formatINR(totalsWith.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings and Button Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-t pt-4">
          {/* Savings Section */}
          {totalSavings > 0 && (
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-gray-600 text-xs">Total Savings</p>
                  <p className="font-bold text-orange-600 text-lg">
                    {formatINR(totalSavings)}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  You save {((totalSavings / totalsWithout.grossTotal) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="lg:w-auto">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold w-full lg:w-auto whitespace-nowrap shadow-md"
            >
              Save Fee Details
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="sm:hidden bg-gray-100 py-1 text-center">
        <span className="text-xs text-gray-500">← Scroll horizontally to view all columns →</span>
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