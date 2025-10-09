// Import Dependencies
import clsx from "clsx";

// Local Imports
import { Card } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
// import TeacherWelcome from "assets/illustrations/teacher-welcome.svg?react";
import TeacherWelcome from "./BannerImage.svg?react";


import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

// 🎨 Gradient stop config (easy to adjust)
const GRADIENT_STOPS = {
  from: "from-primary-400 from-4%",
  via: "via-[#2BBBAD] via-50%",
  to: "to-primary-950 to-150%",
};

export function Welcome() {
  const { smAndUp } = useBreakpointsContext();
  const { user } = getSessionData();

  return (
    <Card
      className={clsx(
        smAndUp && `${GRADIENT_STOPS.via} ${GRADIENT_STOPS.to}`,
        `mt-12 flex flex-col bg-gradient-to-l ${GRADIENT_STOPS.from} p-5 sm:mt-0 sm:flex-row`
      )}
    >
      <div className="flex justify-center sm:order-last">
        <TeacherWelcome className="-mt-16 h-40 sm:mt-0" />
      </div>

      <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-start">
        <h3 className="text-xl">
          Welcome Back,{" "}
          <span className="font-semibold">
            {user?.charAt(0).toUpperCase() + user?.slice(1).toLowerCase()}
          </span>
        </h3>
      </div>
    </Card>
  );
}
