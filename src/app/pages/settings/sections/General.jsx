// src/app/pages/settings/General.jsx

import { PhoneIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { HiPencil } from "react-icons/hi";
import axios from "axios";

// Local Imports
import { PreviewImg } from "components/shared/PreviewImg";
import { Avatar, Button, Input, Upload } from "components/ui";
import { getSessionData } from "utils/sessionStorage";
import { toast } from "sonner";

// ✅ Import your default avatar
import defaultAvatar from "./avatar-11.jpg";

export default function General() {
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile summary
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { userId } = getSessionData() ?? { userId: 34 };
        const tenantId = 1;

        const res = await axios.get(
          `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/${userId}/profile-summary?tenantId=${tenantId}`
        );

        setProfile(res.data?.data);
      } catch (err) {
        console.error("Failed to fetch profile summary", err);
        toast.error("Unable to load profile details");
      }
    }
    fetchProfile();
  }, []);

  // ✅ Save handler
  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      const { userId } = profile;
      const tenantId = 1;

      const formData = new FormData();
      formData.append("fullName", profile.fullName || "");
      formData.append("email", profile.email || "");
      formData.append("mobileNumber", profile.mobileNumber || "");
      if (avatar) formData.append("avatar", avatar);

      await axios.put(
        `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/User/${userId}/profile?tenantId=${tenantId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to save profile changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl 2xl:max-w-5xl">
      {/* Heading */}
      <h5 className="text-lg font-medium text-primary-950 dark:text-dark-50">
        General
      </h5>
      <p className="mt-0.5 text-balance text-sm text-primary-950 dark:text-dark-200">
        Update your account settings.
      </p>

      <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />

      {/* Avatar */}
      <div className="mt-4 flex flex-col space-y-1.5">
        <span className="text-base font-medium text-primary-950 dark:text-dark-100">
          Avatar
        </span>
        <Avatar
          size={20}
          imgComponent={PreviewImg}
          imgProps={{ file: avatar }}
          // ✅ Fallback chain: uploaded → API → default
          src={
            avatar
              ? URL.createObjectURL(avatar)
              : profile?.imageUrl || defaultAvatar
          }
          classNames={{
            root: "rounded-xl ring-primary-600 ring-offset-[3px] ring-offset-white transition-all hover:ring-3 dark:ring-primary-500 dark:ring-offset-dark-700",
            display: "rounded-xl",
          }}
          indicator={
            <div className="absolute bottom-0 right-0 -m-1 flex items-center justify-center rounded-full bg-white dark:bg-dark-700">
              {avatar ? (
                <Button
                  onClick={() => setAvatar(null)}
                  isIcon
                  className="size-6 rounded-full"
                >
                  <XMarkIcon className="size-4" />
                </Button>
              ) : (
                <Upload name="avatar" onChange={setAvatar} accept="image/*">
                  {({ ...props }) => (
                    <Button isIcon className="size-6 rounded-full" {...props}>
                      <HiPencil className="size-3.5" />
                    </Button>
                  )}
                </Upload>
              )}
            </div>
          }
        />
      </div>

      {/* User Info Inputs */}
      <div className="mt-5 text-primary-950 grid grid-cols-1 gap-4 sm:grid-cols-2 [&_.prefix]:pointer-events-none">
        <Input
          placeholder="Enter Nickname"
          label="Display name"
          className="rounded-xl"
          prefix={<UserIcon className="size-4.5 text-primary-600" />}
          value={profile?.username || ""}
          readOnly
        />
        <Input
          placeholder="Enter FullName"
          label="Full name"
          className="rounded-xl"
          prefix={<UserIcon className="size-4.5 text-primary-600" />}
          value={profile?.fullName || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, fullName: e.target.value }))
          }
        />
        <Input
          placeholder="Enter Email"
          label="Email"
          className="rounded-xl"
          prefix={<EnvelopeIcon className="size-4.5 text-primary-600" />}
          value={profile?.email || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Input
          placeholder="Phone Number"
          label="Phone Number"
          className="rounded-xl"
          prefix={<PhoneIcon className="size-4.5 text-primary-600" />}
          value={profile?.mobileNumber || ""}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, mobileNumber: e.target.value }))
          }
        />
      </div>

      <div className="my-7 h-px bg-gray-200 dark:bg-dark-500" />

      {/* Linked Accounts */}
      {/* <div>
        <div>
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            Linked Accounts
          </p>
          <p className="mt-0.5">
            Manage your linked accounts and their permissions.
          </p>
        </div>
        <div>
          {[
            { name: "Google", logo: "/images/logos/google.svg" },
            { name: "Github", logo: "/images/logos/github-round.svg" },
            { name: "Instagram", logo: "/images/logos/instagram-round.svg" },
            { name: "Discord", logo: "/images/logos/discord-round.svg" },
          ].map((acc) => (
            <div
              key={acc.name}
              className="mt-4 flex items-center justify-between space-x-2 "
            >
              <div className="flex min-w-0 items-center space-x-4 ">
                <div className="size-12">
                  <img className="h-full w-full" src={acc.logo} alt="logo" />
                </div>
                <p className="truncate font-medium">Sign In with {acc.name}</p>
              </div>
              <Button
                className="h-8 rounded-full px-3 text-xs-plus"
                variant="outlined"
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]">Cancel</Button>
        <Button
          className="min-w-[7rem]"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
