import { psLinkData } from "./PsLinkData";
import { Avatar } from "components/ui";

const getGradientClassByGender = (gender) => {
  switch ((gender || "").toLowerCase()) {
    case "male":
      return "bg-gradient-to-r from-blue-400 to-blue-600";
    case "female":
      return "bg-gradient-to-r from-pink-400 to-rose-500";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-600";
  }
};

export const PsLink = ({ onKidSelect, selectedKidId }) => {
  return (
    <div className="flex flex-col gap-6">
      {psLinkData.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between gap-4 bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm"
        >
          {/* Parent Avatar */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => {}}
              className={`inline-flex size-16 rounded-full cursor-pointer ${getGradientClassByGender(
                entry.parent.gender
              )} p-0.5`}
              title="Parent"
            >
              <Avatar
                size={15}
                className="rounded-full bg-white p-[3px] dark:bg-dark-700"
                src={entry.parent.image}
              />
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {entry.parent.name}
            </span>
          </div>

          {/* Kids Avatars */}
          <div className="flex gap-6">
            {entry.kids.map((kid) => (
              <div
                key={kid.id}
                className="flex flex-col items-center text-center"
              >
                <div
                  onClick={() => onKidSelect(kid.id)}
                  className={`inline-flex size-14 rounded-full cursor-pointer ${getGradientClassByGender(
                    kid.gender
                  )} p-0.5 ${
                    kid.id === selectedKidId
                      ? "ring-2 ring-offset-2 ring-primary-500"
                      : ""
                  }`}
                  title={`Select ${kid.name}`}
                >
                  <Avatar
                    size={15}
                    className="rounded-full bg-white p-[3px] dark:bg-dark-700"
                    src={kid.image}
                  />
                </div>
                <span className="mt-1 text-xs text-gray-700 dark:text-dark-100">
                  {kid.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
