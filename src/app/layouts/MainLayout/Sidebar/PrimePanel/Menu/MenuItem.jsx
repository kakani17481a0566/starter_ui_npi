// Import Dependencies
import PropTypes from "prop-types";
import { NavLink, useRouteLoaderData } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

// Local Imports
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { Badge } from "components/ui";

// ----------------------------------------------------------------------

export function MenuItem({ data }) {
  const { path, transKey, id,Icon: IconComp } = data;
  const { t } = useTranslation();
  const { lgAndDown } = useBreakpointsContext();
  const { close } = useSidebarContext();
  const title = t(transKey) || data.title;

  const info = useRouteLoaderData("root")?.[id]?.info;

  const handleMenuItemClick = () => lgAndDown && close();

  return (
    <NavLink
      to={path}
      onClick={handleMenuItemClick}
      className={({ isActive }) =>
        clsx(
          "outline-hidden transition-colors duration-300 ease-in-out",
          isActive
            ? "font-medium text-primary-600 dark:text-primary-400"
            : "text-gray-600 hover:text-gray-900 dark:text-dark-200 dark:hover:text-dark-50",
        )
      }
    >
       {({ isActive }) => (
              <div
                data-menu-active={isActive}
                className="flex min-w-0 items-center justify-between"
                style={{ height: "34px" }}
              >
                <div className="flex min-w-0 items-center space-x-2">
                  {IconComp ? (
                    <IconComp
                      aria-hidden="true"
                      className={clsx(
                        "size-4 shrink-0",
                        isActive
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-500 dark:text-dark-300",
                      )}
                    />
                  ) : (
                    <span
                      className={clsx(
                        isActive
                          ? "bg-primary-600 dark:bg-primary-400 opacity-80"
                          : "opacity-50 transition-all",
                        "size-1.5 rounded-full border border-current",
                      )}
                    />
                  )}
      
                  <span className="truncate">{title}</span>
                </div>
      
                {info?.val && (
                  <Badge
                    color={info.color}
                    className="h-5 min-w-[1.25rem] shrink-0 rounded-full p-[5px]"
                  >
                    {info.val}
                  </Badge>
                )}
              </div>
            )}
    </NavLink>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object,
};
