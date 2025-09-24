// Import Dependencies
import { PencilSquareIcon, TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Items({ items, onRemove, onIncrease, onDecrease }) {
  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-dark-300">
        <TrashIcon className="mb-2 size-6" />
        <p>No items in basket</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3.5">
      {items.map((item) => (
        <div
          key={item.book_id}
          className="group flex items-center justify-between gap-3"
        >
          {/* Image + title + author */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex shrink-0">
              <img
                src={item.book?.cover_img || "/images/800x600.png"}
                className="mask is-star size-11 origin-center object-cover"
                alt={item.book?.title}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate font-medium text-gray-800 dark:text-dark-100">
                  {item.book?.title}
                </p>
                <Button
                  isIcon
                  variant="flat"
                  className="size-6 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <PencilSquareIcon className="size-4" />
                </Button>
              </div>
              <p className="truncate text-xs-plus text-gray-400 dark:text-dark-300">
                {item.author}
              </p>
            </div>
          </div>

          {/* Quantity controls + remove button */}
          <div className="flex items-center gap-2">
            <Button
              isIcon
              size="xs"
              variant="outline"
              onClick={() => onDecrease?.(item.book_id)}
            >
              <MinusIcon className="size-4" />
            </Button>
            <span className="min-w-[2rem] text-center font-semibold text-gray-800 dark:text-dark-100">
              {item.count}
            </span>
            <Button
              isIcon
              size="xs"
              variant="outline"
              onClick={() => onIncrease?.(item.book_id)}
            >
              <PlusIcon className="size-4" />
            </Button>

            <Button
              isIcon
              variant="flat"
              color="error"
              onClick={() => onRemove?.(item.book_id)}
              className="size-6 rounded-full opacity-0 group-hover:opacity-100"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

Items.propTypes = {
  items: PropTypes.array,
  onRemove: PropTypes.func,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};
