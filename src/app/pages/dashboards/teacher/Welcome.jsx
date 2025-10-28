// Import Dependencies
import clsx from "clsx";

// Local Imports
import { Card } from "components/ui";
import TeacherWelcome from "./BannerImage.svg?react";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

// 🎨 Gradient stop config
const GRADIENT_STOPS = {
  from: "from-[#33cdcd] from-4%",
  via: "via-[#33cdcd] via-50%",
  to: "to-[#33cdcd] to-150%",
};

// 🎨 Gradient stop config (easy to adjust) // const GRADIENT_STOPS = { // from: "from-primary-400 from-4%", // via: "via-[#2BBBAD] via-50%", // to: "to-primary-950 to-150%", // };

export function Welcome() {
  const { userProfile } = getSessionData();

  return (
    <Card
      className={clsx(
        `mt-12 flex flex-col items-center justify-center bg-gradient-to-l ${GRADIENT_STOPS.from} ${GRADIENT_STOPS.via} ${GRADIENT_STOPS.to} p-5 sm:mt-0 sm:flex-row`,
      )}
    >
      {/* Illustration */}
      <div className="flex justify-center sm:order-last">
        <TeacherWelcome className="-mt-16 h-40 sm:mt-0" />
      </div>

      {/* Welcome Text */}
      <div className="mt-2 flex flex-1 items-center justify-center pt-2 sm:mt-0">
        <h3 className="text-center font-semibold text-3xl text-primary-950">
          WELCOME{" "}
          <span className="font-semibold text-primary-950">
            {userProfile
              ? userProfile.firstName.toUpperCase() + " "+userProfile.lastName.toUpperCase()
              : ""}
          </span>
        </h3>
      </div>
    </Card>
  );
}
