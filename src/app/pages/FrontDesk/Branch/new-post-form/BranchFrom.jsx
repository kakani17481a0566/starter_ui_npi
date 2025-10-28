// ----------------------------------------------------------------------
// Import Dependencies
// ----------------------------------------------------------------------
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import axios from "axios";

// Local Imports
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { Button, Card, Input, Textarea } from "components/ui";
import { getSessionData } from "utils/sessionStorage";

// ----------------------------------------------------------------------

const initialState = {
  name: "",
  contact: "",
  address: "",
  pincode: "",
  district: "",
  state: "",
};

const BranchForm = ({ onCancel, onCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
  });

  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);

  // 🔹 Load session from local/session storage
  useEffect(() => {
    const session = getSessionData();
    if (session?.tenantId && session?.user) {
      setSessionInfo(session);

      // 🧾 Log for testing
      console.log("📦 Loaded Session Info:", {
        tenantId: session.tenantId,
        userId: session.userId,
        user: session.user,
        role: session.role,
      });
    } else {
      toast.error("No session found. Please log in again.");
    }
  }, []);

  // ✅ Handle Save
  const onSubmit = async (data) => {
    if (!sessionInfo?.tenantId) {
      toast.error("Tenant info missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: data.name,
        contact: data.contact,
        address: data.address,
        pincode: data.pincode,
        district: data.district,
        state: data.state,
        tenantId: Number(sessionInfo.tenantId),
        createdBy: Number(sessionInfo.userId) || 1,
        createdOn: new Date().toISOString(),
      };

      // 🧾 Log payload for testing
      console.log("🛰️ Sending Branch Payload:", payload);

      const url = `https://localhost:7202/api/Branch`;

      // 🧾 Log request URL
      console.log("🔗 API Endpoint:", url);

      const res = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(sessionInfo.token
            ? { Authorization: `Bearer ${sessionInfo.token}` }
            : {}),
        },
      });

      // 🧾 Log response for testing
      console.log("✅ API Response:", res.status, res.data);

      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Branch created successfully!");
        reset(initialState);
        onCreated?.();
      } else {
        toast.error("⚠️ Failed to create branch.");
        console.warn("Unexpected response:", res);
      }
    } catch (err) {
      console.error("❌ Error creating branch:", err.response || err);
      toast.error("Error creating branch.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Cancel
  const handleCancel = () => {
    console.log("🚫 Branch creation cancelled by user.");
    reset(initialState);
    onCancel?.();
  };

  return (
    <Page title="Create Branch">
      <div className="transition-content px-(--margin-x) pb-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-3">
            <DocumentPlusIcon className="size-7 text-primary-600" />
            <h2 className="line-clamp-1 text-xl font-semibold text-gray-800 dark:text-dark-50">
              New Branch
            </h2>
          </div>

          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="branch-form"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Form */}
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="branch-form"
        >
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            {/* LEFT SIDE - Branch Info */}
            <div className="col-span-12 lg:col-span-8">
              <Card className="p-4 sm:px-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                  Branch Details
                </h3>

                <div className="mt-5 space-y-5">
                  <Input
                    label="Branch Name"
                    placeholder="Enter branch name"
                    {...register("name")}
                    error={errors?.name?.message}
                  />
                  <Input
                    label="Contact Number"
                    placeholder="Enter contact number"
                    {...register("contact")}
                    error={errors?.contact?.message}
                  />
                  <Textarea
                    label="Address"
                    placeholder="Enter branch address"
                    {...register("address")}
                    error={errors?.address?.message}
                  />
                  <Input
                    label="Pincode"
                    placeholder="Enter pincode"
                    {...register("pincode")}
                    error={errors?.pincode?.message}
                  />
                  <Input
                    label="District"
                    placeholder="Enter district"
                    {...register("district")}
                    error={errors?.district?.message}
                  />
                  <Input
                    label="State"
                    placeholder="Enter state"
                    {...register("state")}
                    error={errors?.state?.message}
                  />
                </div>
              </Card>
            </div>

            {/* RIGHT SIDE - Session Info (non-editable) */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="p-4 sm:px-5 space-y-5">
                <h3 className="text-base font-semibold text-gray-800 dark:text-dark-100">
                  Session Info
                </h3>

                {sessionInfo ? (
                  <div className="space-y-4">
                    <Input
                      label="Tenant Name"
                      value={`Tenant #${sessionInfo.tenantId}`}
                      disabled
                      readOnly
                      className="bg-gray-100 dark:bg-dark-600"
                    />
                    <Input
                      label="User Name"
                      value={sessionInfo.user || "Unknown User"}
                      disabled
                      readOnly
                      className="bg-gray-100 dark:bg-dark-600"
                    />
                    <Input
                      label="Role"
                      value={sessionInfo.role || "N/A"}
                      disabled
                      readOnly
                      className="bg-gray-100 dark:bg-dark-600"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-red-500">
                    No session found. Please log in again.
                  </p>
                )}
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default BranchForm;
