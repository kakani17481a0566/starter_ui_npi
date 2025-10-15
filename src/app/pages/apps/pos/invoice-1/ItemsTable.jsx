// Local Imports
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

// ----------------------------------------------------------------------

export function ItemsTable({ items = [] }) {
  return (
    <div className="hide-scrollbar min-w-full overflow-x-auto">
      <Table zebra className="w-full text-left rtl:text-right">
        <THead>
          <Tr>
            <Th className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
              #
            </Th>
            <Th className="bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
              DESCRIPTION
            </Th>
            <Th className="bg-gray-200 text-end font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
              QTY
            </Th>
            <Th className="bg-gray-200 text-end font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
              UNIT PRICE
            </Th>
            <Th className="bg-gray-200 text-end font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
              GST
            </Th>
            <Th className="bg-gray-200 text-end font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100">
              SUBTOTAL
            </Th>
          </Tr>
        </THead>
        <TBody>
          {items.map((item, idx) => (
            <Tr key={item.itemId}>
              <Td>{idx + 1}</Td>
              <Td className="whitespace-normal">
                <div className="min-w-[16rem]">
                  <p className="truncate font-medium text-gray-800 dark:text-dark-100">
                    {item.itemName}
                  </p>
                </div>
              </Td>
              <Td className="text-end">{item.quantity}</Td>
              <Td className="text-end">₹{item.unitPrice.toFixed(2)}</Td>
              <Td className="text-end">₹{item.gstValue.toFixed(2)}</Td>
              <Td className="text-end font-semibold">
                ₹{(item.unitPrice * item.quantity + item.gstValue).toFixed(2)}
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
