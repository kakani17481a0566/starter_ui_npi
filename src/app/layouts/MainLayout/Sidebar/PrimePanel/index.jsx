// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Button } from "components/ui";
import { Menu } from "./Menu";

// ----------------------------------------------------------------------

export function PrimePanel({ currentSegment, pathname, close }) {
  const { cardSkin } = useThemeContext();
  const { t } = useTranslation();

  const title = t(currentSegment?.transKey) || currentSegment?.title;

  return (
    <div
      className={clsx(
        "prime-panel flex h-full flex-col",
        "rounded-tr-sm rounded-br-sm", // ✅ curved top-right & bottom-right
        "border-r-1 border-[#33CDCD]", // ✅ right-side neon border
        "shadow-[0_0_15px_#33CDCD]", // ✅ optional neon glow
        "dark:border-[#33CDCD]", // ✅ ensures neon in dark mode
        cardSkin === "shadow-sm" ? "shadow-soft dark:shadow-dark-900/60" : "",
      )}
    >
      <div
        className={clsx(
          "flex h-full grow flex-col overflow-hidden bg-white", // ✅ added overflow-hidden
          "rounded-tr-sm rounded-br-sm", // ✅ also apply curves here
          "ltr:pl-(--main-panel-width) rtl:pr-(--main-panel-width)",
          cardSkin === "shadow-sm" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        <div className="relative flex h-16 w-full shrink-0 items-center justify-between pr-1 pl-4 rtl:pr-4 rtl:pl-1">
          <p className="dark:text-dark-100 truncate text-base tracking-wider text-gray-800">
            {title}
          </p>
          <Button
            onClick={close}
            isIcon
            variant="flat"
            className="size-7 rounded-full xl:hidden"
          >
            <ChevronLeftIcon className="size-6 rtl:rotate-180" />
          </Button>
        </div>

        {currentSegment?.childs && (
          <Menu
            nav={currentSegment?.childs}
            pathname={pathname}
            onItemClick={close}
          />
        )}
      </div>
    </div>
  );
}

PrimePanel.propTypes = {
  currentSegment: PropTypes.object,
  pathname: PropTypes.string,
  close: PropTypes.func,
};
