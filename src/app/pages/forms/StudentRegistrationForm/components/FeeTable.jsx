import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TagIcon } from "@heroicons/react/24/outline";

import { Input, Checkbox } from "components/ui";
import { personalInfoSchema } from "../schema";

const collectionList = [
  { collection_id: 1, name: "Kit Fee", monthly_fee: 0, term_fee: 0, annual_fee: 12500, gst: 0, discount: 0, enableDiscount: false },
  { collection_id: 2, name: "Tuition Fee", monthly_fee: 9000, term_fee: 0, annual_fee: 0, gst: 0, discount: 0, enableDiscount: false },
  { collection_id: 3, name: "Activity Fee", monthly_fee: 0, term_fee: 1000, annual_fee: 0, gst: 0, discount: 0, enableDiscount: false },
  { collection_id: 4, name: "Meals", monthly_fee: 0, term_fee: 0, annual_fee: 0, gst: 0, discount: 0, enableDiscount: false },
  { collection_id: 5, name: "Transport", monthly_fee: 0, term_fee: 0, annual_fee: 0, gst: 0, discount: 0, enableDiscount: false },
];

// INR formatter
const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(val || 0));

function FeeTable({ setCurrentStep }) {
  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: { fees: collectionList, globalDiscount: 0 },
  });

  const fees = watch("fees");
  const globalDiscount = Number(watch("globalDiscount")) || 0;

  const onSubmit = (data) => {
    console.log("Submitted:", data);
    if (setCurrentStep) setCurrentStep(1);
  };

  // Totals calculation
  const totals = fees.reduce(
    (acc, item) => {
      const monthly = Number(item.monthly_fee) || 0;
      const term = Number(item.term_fee) || 0;
      const annual = Number(item.annual_fee) || 0;
      const gstPercent = Number(item.gst) || 0;

      const discountPercent = item.enableDiscount
        ? (globalDiscount > 0 ? globalDiscount : Number(item.discount) || 0)
        : 0;

      const base = monthly + term + annual;
      const discountValue = (base * discountPercent) / 100;
      const subtotal = base - discountValue;

      const gstValue = (subtotal * gstPercent) / 100;
      const rowTotal = subtotal + gstValue;

      acc.base += base;
      acc.discount += discountValue;
      acc.subtotal += subtotal;
      acc.gstTotal += gstValue;
      acc.finalAmount += rowTotal;
      return acc;
    },
    { base: 0, discount: 0, subtotal: 0, gstTotal: 0, finalAmount: 0 }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Editable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-50 text-primary-700">
              <tr>
                <th className="px-4 py-3 text-center whitespace-nowrap">
                  <TagIcon className="w-4 h-4 inline mr-1" /> Fee Head
                </th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Monthly (₹)</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Term (₹)</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Annual (₹)</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">GST (%)</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Discount (%)</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Total (₹)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {fees.map((row, index) => {
                const monthly = Number(row.monthly_fee) || 0;
                const term = Number(row.term_fee) || 0;
                const annual = Number(row.annual_fee) || 0;
                const gstPercent = Number(row.gst) || 0;

                const discountPercent = row.enableDiscount
                  ? (globalDiscount > 0 ? globalDiscount : Number(row.discount) || 0)
                  : 0;

                const base = monthly + term + annual;
                const discountValue = (base * discountPercent) / 100;
                const subtotal = base - discountValue;
                const gstValue = (subtotal * gstPercent) / 100;
                const rowTotal = subtotal + gstValue;

                const isEditableFee = row.name === "Transport" || row.name === "Meals";
                const readOnlyProps = { readOnly: true, disabled: true };

                return (
                  <tr key={row.collection_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center font-medium text-gray-800 whitespace-nowrap">
                      {row.name}
                    </td>

                    {/* Monthly Fee */}
                    <td className="px-4 py-2 text-center">
                      <Controller
                        name={`fees.${index}.monthly_fee`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            className="h-8 py-1 text-xs text-center"
                            prefix="₹"
                            {...(!isEditableFee ? readOnlyProps : {})}
                          />
                        )}
                      />
                    </td>

                    {/* Term Fee */}
                    <td className="px-4 py-2 text-center">
                      <Controller
                        name={`fees.${index}.term_fee`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            className="h-8 py-1 text-xs text-center"
                            prefix="₹"
                            {...(!isEditableFee ? readOnlyProps : {})}
                          />
                        )}
                      />
                    </td>

                    {/* Annual Fee */}
                    <td className="px-4 py-2 text-center">
                      <Controller
                        name={`fees.${index}.annual_fee`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            className="h-8 py-1 text-xs text-center"
                            prefix="₹"
                            {...(!isEditableFee ? readOnlyProps : {})}
                          />
                        )}
                      />
                    </td>

                    {/* GST */}
                    <td className="px-4 py-2 text-center">
                      <Controller
                        name={`fees.${index}.gst`}
                        control={control}
                        render={({ field }) => (
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              className="h-8 py-1 text-xs text-center w-20 pr-5"
                              min={0}
                              max={100}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 text-xs">%</span>
                          </div>
                        )}
                      />
                    </td>

                    {/* Discount (with checkbox) */}
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Controller
                          name={`fees.${index}.enableDiscount`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                            />
                          )}
                        />
                        <Controller
                          name={`fees.${index}.discount`}
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <Input
                                {...field}
                                type="number"
                                className="h-8 py-1 text-xs text-center w-20 pr-5"
                                min={0}
                                max={100}
                                disabled={!fees[index].enableDiscount || globalDiscount > 0}
                                value={
                                  globalDiscount > 0 && fees[index].enableDiscount
                                    ? globalDiscount
                                    : field.value
                                }
                                readOnly={globalDiscount > 0 && fees[index].enableDiscount}
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 text-xs">%</span>
                            </div>
                          )}
                        />
                      </div>
                    </td>

                    {/* Row Total */}
                    <td className="px-4 py-2 text-center font-semibold text-green-700 whitespace-nowrap">
                      {formatINR(rowTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Summary Card */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-600">Base Total</p>
              <p className="font-semibold">{formatINR(totals.base)}</p>
            </div>

            {/* Global Discount */}
            <div>
              <p className="text-gray-600">Global Discount (%)</p>
              <Controller
                name="globalDiscount"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      type="number"
                      min={0}
                      max={100}
                      className="h-8 py-1 text-xs text-center w-24 pr-5 border rounded"
                    />
                    
                  </div>
                )}
              />
            </div>

            <div>
              <p className="text-gray-600">Discount</p>
              <p className="font-semibold text-orange-600">- {formatINR(totals.discount)}</p>
            </div>
            <div>
              <p className="text-gray-600">GST Total</p>
              <p className="font-semibold">{formatINR(totals.gstTotal)}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <p className="text-lg font-bold text-green-700">Grand Total (Incl. GST)</p>
            <p className="text-xl font-bold text-green-700">{formatINR(totals.finalAmount)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 bg-white border-t">
          <button
            type="button"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded shadow hover:bg-primary-700"
          >
            Save & Next
          </button>
        </div>
      </div>
    </form>
  );
}

FeeTable.propTypes = {
  setCurrentStep: PropTypes.func,
};

export default FeeTable;
