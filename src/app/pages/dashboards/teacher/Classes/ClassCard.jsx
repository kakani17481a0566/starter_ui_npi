// Import Dependencies
import {
  ArrowUpRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
// import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Button, Card, Tag } from "components/ui";

// Domain-specific color mapping
const domainColorMap = {
  CLL: "rgba(147,197,253,0.5)", // Blue 300 @70% opacity
  PSRN: "rgba(252,165,165,0.5)", // Red 300 @70%
  KUW: "rgba(252,211,77,0.5)", // Amber 300 @70%
  PD: "rgba(110,231,183,0.5)", // Emerald 300 @70%
  EAD: "rgba(196,181,253,0.5)", // Violet 300 @70%
  PSED: "rgba(249,168,212,0.5)", // Pink 300 @70%
};

export function ClassCard({ name, category, time, students }) {
  const domainColor = domainColorMap[name] || "#465C8A"; // Fallback to CLL blue

  return (
    <Card className="group dark:border-dark-700 flex overflow-hidden rounded-2xl border border-gray-300 shadow-sm transition duration-300 hover:shadow-md">
      {/* Colored Stripe */}
      <div className="w-1 sm:w-1.5" style={{ backgroundColor: domainColor }} />

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex flex-col gap-1">
          {/* Icon */}
          <DocumentTextIcon className="text-primary-600 mb-2 h-8 w-8" />

          {/* Title */}
          <h3 className="dark:text-dark-100 line-clamp-2 text-sm font-semibold text-primary-950">
            {name}
          </h3>

          {/* Time */}
          <p className="dark:text-dark-300 text-xs text-primary-950">{time}</p>

          {/* Tag with custom background */}
          <div className="mt-2 max-w-full">
            <Tag
              className="line-clamp-2 w-full text-center break-words whitespace-normal text-primary-950"
              style={{ backgroundColor: domainColor }}
            >
              {category}
            </Tag>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex -space-x-2">
            {students.map((student) => (
              <Avatar
                size={7}
                key={student.uid}
                name={student.name}
                src={student.avatar}
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-110",
                  display: "dark:ring-dark-700 text-xs ring-2 ring-white",
                }}
              />
            ))}
          </div>
          <Button
            className="group-hover:bg-primary-600 size-7 rounded-full transition group-hover:text-white"
            isIcon
          >
            <ArrowUpRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

ClassCard.propTypes = {
  name: PropTypes.string.isRequired, // Domain like CLL, PSED, etc.
  category: PropTypes.string.isRequired, // Topic
  time: PropTypes.string.isRequired, // Day (e.g., Monday)
  students: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ),
};

ClassCard.defaultProps = {
  students: [],
};
