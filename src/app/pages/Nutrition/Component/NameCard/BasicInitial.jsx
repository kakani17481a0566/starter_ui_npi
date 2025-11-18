import { useEffect, useState } from "react";
import { Avatar } from "components/ui";
import { userProfile } from "../NameCard/user-profile.js";

/**
 * ----------------------------------------------------------------------
 * 🧩 BasicInitial
 * ----------------------------------------------------------------------
 * Displays the user avatar and name.
 * Simulates fetching profile data asynchronously.
 * Shows skeleton loader & graceful error handling.
 * ----------------------------------------------------------------------
 */
const BasicInitial = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Simulate async fetch (e.g., from API)
      setLoading(true);
      setTimeout(() => {
        setUser(userProfile);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Unable to load user data");
      setLoading(false);
    }
  }, []);

  // 🕓 Loading Skeleton
  if (loading)
    return (
      <div className="flex animate-pulse items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-gray-200"></div>
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );

  // ⚠️ Error State
  if (error)
    return (
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );

  // ✅ Render Profile
  return (
    <div className="flex items-center justify-end gap-3 transition-all">
      {/* 🧑 Avatar */}
      <Avatar
        src={user?.avatarUrl}
        name={user?.name || "User"}
        initialColor={user?.initialColor || "primary"}
        className="h-12 w-12" // ✅ Increased avatar size here
      />

      {/* 💬 User Name */}
      <span className="text-primary-950 text-base font-semibold sm:text-lg">
        {`Hello ${user?.name || "User"}!`}
      </span>
    </div>
  );
};

export { BasicInitial };
