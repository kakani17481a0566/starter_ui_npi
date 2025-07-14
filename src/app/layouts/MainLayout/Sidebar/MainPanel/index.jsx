// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router";
import clsx from "clsx";

// Local Imports
import Logo from "assets/appLogo.svg?react";
import { Menu } from "./Menu";
import { Item } from "./Menu/Item";
import { Profile } from "../../Profile";
import { useThemeContext } from "app/contexts/theme/context";
import { settings } from "app/navigation/settings";
import { useNavigate } from "react-router-dom";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

export function MainPanel({ nav, setActiveSegment, activeSegment }) {
  const { cardSkin } = useThemeContext();
  const { role } = getSessionData();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    if (role === "Teacher") {
      navigate("/dashboards/home"); // ✅ absolute path
    } else if (role === "Nanny") {
      navigate("/dashboards/mark-attendance"); // ✅ fixed
    } else {
      navigate("/"); // ✅
    }
  };

  return (
    <div className="main-panel">
      <div
        className={clsx(
          "flex h-full w-full flex-col items-center bg-white",
          "border-r-1 !border-[#33CDCD]",
          "rounded-tr-xl rounded-br-xl",
          "shadow-[0_0_20px_#33CDCD] transition-shadow",
          cardSkin === "shadow-sm" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        {/* Application Logo */}
        <div className="w-full rounded-r-xl">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Logo className="text-primary-600 dark:text-primary-400 h-[80px] w-[65px]" />
          </div>
        </div>

        <Menu
          nav={nav}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />

        {/* Bottom Links */}
        <div className="flex flex-col items-center space-y-3 py-2.5">
          <Item
            id={settings.id}
            component={Link}
            to="/settings/appearance"
            title={"Settings"}
            isActive={activeSegment === settings.path}
            Icon={settings.Icon}
          />
          <Profile />
        </div>
      </div>
    </div>
  );
}

MainPanel.propTypes = {
  nav: PropTypes.array,
  setActiveSegment: PropTypes.func,
  activeSegment: PropTypes.string,
};
