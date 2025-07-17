import { useState } from "react";
import { Input, Button, Card } from "components/ui";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { getSessionData } from "utils/sessionStorage";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "app/contexts/auth/context";

// Icons
import {
  ArrowPathIcon,
  LockClosedIcon,
  KeyIcon,
  LockOpenIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

// Validation Schema
const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const { userId, tenantId, token } = getSessionData();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setResponseMsg("");

    try {
      const res = await axios.put(
        `https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net/api/user/${userId}/password?tenantId=${tenantId}`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const message = res.data.message || "Password updated successfully ✅";
      setResponseMsg(message);
      reset();

      if (message.toLowerCase().includes("success")) {
        setTimeout(async () => {
          await logout();
          navigate("/login?redirect=/");
        }, 3000);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "❌ Failed to update password.";
      setResponseMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-dark-900">
      <Card className="w-full max-w-xl p-8 rounded-xl shadow-md bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gray-200 dark:bg-dark-700">
              <LockClosedIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-primary-950 dark:text-white">
            Change Your Password
          </h2>
          <p className="text-sm text-primary-950 dark:text-gray-400 mt-1">
            Keep your account secure
          </p>
        </div>

        {responseMsg && (
          <div
            className={`flex items-center gap-2 mb-6 text-sm px-4 py-3 rounded-lg shadow-sm transition-all duration-300 ${
              responseMsg.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {responseMsg.toLowerCase().includes("success") ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <ExclamationCircleIcon className="w-5 h-5" />
            )}
            <span className="text-primary-950">{responseMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-primary-950">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
            className="h-9 text-sm px-3 py-2"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter a new password"
            icon={<LockOpenIcon className="h-5 w-5 text-gray-400" />}
            className="h-9 text-sm px-3 py-2"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter the new password"
            icon={<ShieldCheckIcon className="h-5 w-5 text-gray-400" />}
            className="h-9 text-sm px-3 py-2"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[140px] flex items-center justify-center gap-2 bg-primary-600 text-white hover:bg-primary-700 transition-all"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
