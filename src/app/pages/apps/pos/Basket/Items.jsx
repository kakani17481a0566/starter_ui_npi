import { useEffect, useState } from "react";
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
  // 🔹 Maintain local copy to allow smooth clearing on ghost refresh
  const [localItems, setLocalItems] = useState(items);

  // 🔄 Sync when parent prop changes (e.g. add/remove/update count)
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // 👻 Listen for global ghost refresh event
  useEffect(() => {
    const handleRefresh = () => {
      setLocalItems([]);
    };
    window.addEventListener("basket:refresh", handleRefresh);
    return () => window.removeEventListener("basket:refresh", handleRefresh);
  }, []);

  if (!localItems.length) {
    return (
      <div className="text-center py-6 text-gray-400 dark:text-dark-300">
        🛒 No items in basket
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
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
            {localItems.map((item) => {
              const itemSubtotal = item.count * Number(item.price);
              const itemGst = itemSubtotal * 0.05;
              const itemTotal = itemSubtotal + itemGst;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-150"
                >
                  {/* Item Info */}
                  <td className="border px-3 py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/images/categories/default.png"}
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

                  {/* Quantity Controls */}
                  <td className="border px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        isIcon
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (item.count > 1) {
                            onDecrease(item.id);
                          } else if (
                            window.confirm(`Remove ${item.name} from basket?`)
                          ) {
                            onRemove(item.id);
                          }
                        }}
                      >
                        <MinusIcon className="size-4" />
                      </Button>

                      <span className="font-medium">{item.count}</span>

                      <Button
                        isIcon
                        size="sm"
                        variant="outline"
                        onClick={() => onIncrease(item.id)}
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                  </td>

                  {/* Pricing Columns */}
                  <td className="border px-3 py-2 text-right">
                    {formatINR(item.price)}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {formatINR(itemGst)}
                  </td>
                  <td className="border px-3 py-2 text-right font-medium">
                    {formatINR(itemTotal)}
                  </td>

                  {/* Remove */}
                  <td className="border px-3 py-2 text-center">
                    <Button
                      isIcon
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (window.confirm(`Remove ${item.name} from basket?`)) {
                          onRemove(item.id);
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
