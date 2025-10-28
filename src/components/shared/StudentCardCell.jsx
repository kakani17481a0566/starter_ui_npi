// ----------------------------------------------------------------------
// StudentCardCell — simplified: shows avatar + name only
// ----------------------------------------------------------------------

import PropTypes from "prop-types";
import clsx from "clsx";
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

export function StudentCardCell({
  avatar,
  name,
  shape = "circle",
  color = "blue",
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Avatar
        src={avatar}
        name={name}
        size={10}
        initialColor={color}
        classNames={{
          display: clsx(
            "text-sm",
            shape && shape !== "circle" && ["rounded-none"]
          ),
        }}
      />
      <span className="font-medium text-gray-800 dark:text-dark-100 text-sm leading-tight">
        {name}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// PropTypes
// ----------------------------------------------------------------------

StudentCardCell.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string.isRequired,
  shape: PropTypes.oneOf([
    "circle",
    "squircle",
    "triangle",
    "diamond",
    "hexagon",
    "hexagon2",
    "star",
    "star2",
    "octagon",
  ]),
  color: PropTypes.string,
};
