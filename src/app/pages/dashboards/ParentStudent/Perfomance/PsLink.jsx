import { useEffect, useState } from "react";
import { Avatar } from "components/ui";
import { fetchPsLinkData } from "./PsLinkData";

const primaryGradient = "bg-gradient-to-r from-primary-400 to-primary-600";

export const PsLink = ({ userId = 139, tenantId = 1, onKidSelect, selectedKidId }) => {
  const [psLinkData, setPsLinkData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPsLinkData(userId, tenantId);
      setPsLinkData(data);
      setLoading(false);
    };
    loadData();
  }, [userId, tenantId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading linked kids...</p>;
  }

  if (!psLinkData.length) {
    return <p className="text-sm text-gray-500">No kids linked</p>;
  }

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
              className={`inline-flex size-16 rounded-full p-0.5 ${primaryGradient}`}
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
          <div className="flex gap-4">
            {entry.kids.map((kid) => (
              <div key={kid.id} className="flex flex-col items-center text-center">
                <div
                  onClick={() => onKidSelect?.(kid.id)}
                  title={`Select ${kid.name}`}
                  className={`inline-flex size-14 rounded-full p-0.5 cursor-pointer transition-transform hover:scale-105 ${
                    kid.id === selectedKidId ? "ring-2 ring-primary-500" : primaryGradient
                  }`}
                >
                  <Avatar
                    size={15}
                    className="rounded-full bg-white p-[3px] dark:bg-dark-700"
                    src={kid.image}
                  />
                </div>
                <span className="mt-1 text-xs text-gray-700 dark:text-dark-100 text-center w-[56px] truncate">
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
