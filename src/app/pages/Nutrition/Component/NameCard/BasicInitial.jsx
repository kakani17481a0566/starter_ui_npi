import { useEffect, useState } from "react";
import { Avatar } from "components/ui/index.js";
import { userProfile } from "../NameCard/user-profile.js"; // ✅ Import local data

const BasicInitial = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Simulate async fetch (optional delay)
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
    }, []); // ✅ Runs only once when mounted

    if (loading)
        return (
            <div className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                <span className="text-gray-400 text-sm">Loading...</span>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-end gap-3">
                <span className="text-red-500 text-sm">{error}</span>
            </div>
        );

    return (
        <div className="flex items-center justify-end gap-3 transition-all">
            {/* Left: Avatar */}
            <Avatar
                src={user?.avatarUrl}
                name={user?.name || "User"}
                initialColor={user?.initialColor || "primary"}
            />

            {/* Right: User Name */}
            <span className="text-primary-950 font-semibold text-base sm:text-lg">
        {user?.name || "User"}
      </span>
        </div>
    );
};

export { BasicInitial };
