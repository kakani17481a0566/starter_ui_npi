import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";

// ✅ INR formatter
const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(val || 0));

export function Items({ items, onIncrease, onDecrease, onRemove }) {
  if (!items.length) {
    return <p className="text-sm text-gray-400">No items in basket</p>;
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 dark:border-dark-500 text-sm">
          <thead className="bg-gray-100 dark:bg-dark-600">
            <tr>
              <th className="border px-3 py-2 text-left">Item</th>
              <th className="border px-3 py-2 text-center">Quantity</th>
              <th className="border px-3 py-2 text-right">Price</th>
              <th className="border px-3 py-2 text-right">GST (5%)</th>
              <th className="border px-3 py-2 text-right">Overall Price</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemSubtotal = item.count * Number(item.price);
              const itemGst = itemSubtotal * 0.05;
              const itemTotal = itemSubtotal + itemGst;

              return (
                <tr
                  key={item.uid}
                  className="hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  {/* Image + Name */}
                  <td className="border px-3 py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-12 rounded object-cover border"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 dark:text-dark-100 truncate">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-dark-300 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Quantity controls */}
                  <td className="border px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        isIcon
                        size="sm"
                        variant="outline"
                        aria-label="Decrease quantity"
                        onClick={() => {
                          if (item.count > 1) {
                            onDecrease(item.uid);
                          } else {
                            if (
                              window.confirm(`Remove ${item.name} from cart?`)
                            ) {
                              onRemove(item.uid);
                            }
                          }
                        }}
                      >
                        <MinusIcon className="size-4" />
                      </Button>

                      <span>{item.count}</span>

                      <Button
                        isIcon
                        size="sm"
                        variant="outline"
                        aria-label="Increase quantity"
                        onClick={() => onIncrease(item.uid)}
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                  </td>

                  {/* Prices */}
                  <td className="border px-3 py-2 text-right">
                    {formatINR(item.price)}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {formatINR(itemGst)}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {formatINR(itemTotal)}
                  </td>

                  {/* Remove button */}
                  <td className="border px-3 py-2 text-center">
                    <Button
                      isIcon
                      size="sm"
                      variant="danger"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => {
                        if (window.confirm(`Remove ${item.name} from cart?`)) {
                          onRemove(item.uid);
                        }
                      }}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
