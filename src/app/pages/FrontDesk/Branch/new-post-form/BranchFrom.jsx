// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

// Local Imports
import { schema } from "./schema"; // branch schema
import { Page } from "components/shared/Page";
import { Button, Card, Input, Textarea } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";

// ----------------------------------------------------------------------

const initialState = {
  name: "",
  contact: "",
  address: "",
  pincode: "",
  district: "",
  state: "",
  tenant_id: "",
  department_id: "",
};

const BranchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
  });

  // 🔹 Local state for tenants & departments
  const [tenants, setTenants] = useState([]);
  const [departments, setDepartments] = useState([]);

  // 🔹 Simulate fetching with useEffect
  useEffect(() => {
    const tenantData = [
      { id: "t1", label: "Tenant One" },
      { id: "t2", label: "Tenant Two" },
      { id: "t3", label: "Tenant Three" },
    ];
    const deptData = [
      { id: "1", label: "HR" },
      { id: "2", label: "Finance" },
      { id: "3", label: "Operations" },
    ];

    setTimeout(() => {
      setTenants(tenantData);
      setDepartments(deptData);
    }, 500);
  }, []);

  const onSubmit = (data) => {
    console.log("✅ Branch Data:", data);
    toast.success("Branch saved successfully!");
    reset();
  };

  return (
    <Page title="Branch Form">
      <div className="transition-content px-(--margin-x) pb-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-2">
            <DocumentPlusIcon className="size-7 text-primary-600" />
            <h2 className="line-clamp-1 text-xl font-semibold text-gray-800 dark:text-dark-50">
              Branch
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="branch-form"
            >
              Save
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
                    label={<span className="font-semibold">Branch Name</span>}
                    placeholder="Enter branch name"
                    className="h-8 py-1 text-xs"
                    {...register("name")}
                    error={errors?.name?.message}
                  />

                  <Input
                    label={<span className="font-semibold">Contact Number</span>}
                    placeholder="Enter contact number"
                    className="h-8 py-1 text-xs"
                    {...register("contact")}
                    error={errors?.contact?.message}
                  />

                  <Textarea
                    label={<span className="font-semibold">Address</span>}
                    placeholder="Enter branch address"
                    className="h-16 py-1 text-xs"
                    {...register("address")}
                    error={errors?.address?.message}
                  />

                  <Input
                    label={<span className="font-semibold">Pincode</span>}
                    placeholder="Enter pincode"
                    className="h-8 py-1 text-xs"
                    {...register("pincode")}
                    error={errors?.pincode?.message}
                  />

                  <Input
                    label={<span className="font-semibold">District</span>}
                    placeholder="Enter district"
                    className="h-8 py-1 text-xs"
                    {...register("district")}
                    error={errors?.district?.message}
                  />

                  <Input
                    label={<span className="font-semibold">State</span>}
                    placeholder="Enter state"
                    className="h-8 py-1 text-xs"
                    {...register("state")}
                    error={errors?.state?.message}
                  />
                </div>
              </Card>
            </div>

            {/* RIGHT SIDE - Tenant & Department */}
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="space-y-5 p-4 sm:px-5">
                {/* Tenant Dropdown */}
                <Controller
                  render={({ field }) => (
                    <Listbox
                      data={tenants}
                      value={tenants.find((t) => t.id === field.value) || null}
                      onChange={(val) => field.onChange(val.id)}
                      name={field.name}
                      label={<span className="font-semibold">Tenant</span>}
                      placeholder="Select Tenant"
                      displayField="label"
                      className="h-8 py-1 text-xs"
                      error={errors?.tenant_id?.message}
                    />
                  )}
                  control={control}
                  name="tenant_id"
                />

                {/* Department Dropdown */}
                <Controller
                  render={({ field }) => (
                    <Listbox
                      data={departments}
                      value={departments.find((d) => d.id === field.value) || null}
                      onChange={(val) => field.onChange(val.id)}
                      name={field.name}
                      label={<span className="font-semibold">Department</span>}
                      placeholder="Select Department"
                      displayField="label"
                      className="h-8 py-1 text-xs"
                      error={errors?.department_id?.message}
                    />
                  )}
                  control={control}
                  name="department_id"
                />
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default BranchForm;
