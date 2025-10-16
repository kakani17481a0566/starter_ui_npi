// ----------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  HeartIcon,
  UsersIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import axios from "axios";
import { schema } from "app/pages/forms/Genetics/GeneticRegitrationForm/schema"; // ✅ external schema

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card, Input, Textarea } from "components/ui";

// ----------------------------------------------------------------------
// Initial Values
// ----------------------------------------------------------------------
const initialState = {
  // ✅ Personal Information
  studentName: "",
  studentId: "",
  className: "",
  branch: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  countryCode: "+91",
  contactNumber: "",

  // ✅ Health + Lifestyle
  age: "",
  gender: "",
  height: "",
  weight: "",
  foodFrequency: "",
  consanguinity: "",
  parentsOccupation: "",
  dietType: "",
  activity: "",
  sleepDuration: "",
  sleepQuality: "",
  screenTime: "",
  foodTiming: "",
  fruits: "",
  vegetables: "",
  familyType: "",
  siblings: "",
  vaccination: "",
  natureAccess: "",
  pollutionAir: "",
  pollutionNoise: "",
  pollutionWater: "",
  travelTime: "",
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const HealthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState,
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/health-form", data);
      toast.success("Health form submitted successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    }
  };

  // ----------------------------------------------------------------------
  // JSX
  // ----------------------------------------------------------------------
  return (
    <Page title="Genetic Regitration Form">
      <div className="transition-content pb-6">
        {/* Header Bar */}
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-primary-600" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              Genetic Regitration Form
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="health-form"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Full Width Form */}
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} id="health-form">
          <div className="space-y-5">
            {/* ✅ Section 0: Personal Information */}
            <Card className="p-4 sm:px-5 w-full">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-dark-100">
                <UserCircleIcon className="w-5 h-5 text-primary-600" />
                Personal Information
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Student Name"
                  {...register("studentName")}
                  error={errors?.studentName?.message}
                  placeholder="Enter student full name"
                />
                <Input
                  label="Student ID / Roll No"
                  {...register("studentId")}
                  error={errors?.studentId?.message}
                  placeholder="Enter student ID"
                />
                <Input
                  label="Class / Grade"
                  {...register("className")}
                  error={errors?.className?.message}
                  placeholder="e.g., Grade 4 - A"
                />
                <Input
                  label="Branch / Campus"
                  {...register("branch")}
                  error={errors?.branch?.message}
                  placeholder="e.g., Main Campus"
                />
                <Input
                  label="Father’s Name"
                  {...register("fatherName")}
                  error={errors?.fatherName?.message}
                  placeholder="Enter father’s name"
                />
                <Input
                  label="Father’s Occupation"
                  {...register("fatherOccupation")}
                  error={errors?.fatherOccupation?.message}
                  placeholder="e.g., Engineer"
                />
                <Input
                  label="Mother’s Name"
                  {...register("motherName")}
                  error={errors?.motherName?.message}
                  placeholder="Enter mother’s name"
                />
                <Input
                  label="Mother’s Occupation"
                  {...register("motherOccupation")}
                  error={errors?.motherOccupation?.message}
                  placeholder="e.g., Teacher"
                />

                {/* ✅ Country Code + Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Contact Number
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Country Code */}
                    <select
                      {...register("countryCode")}
                      className="w-24 rounded-md border border-gray-300 px-2 py-2 shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>

                    {/* Phone Input */}
                    <input
                      type="text"
                      {...register("contactNumber")}
                      placeholder="9876543210"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>

                  {errors?.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Section 1: Basic Info */}
            <Card className="p-4 sm:px-5 w-full">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-dark-100">
                <UserCircleIcon className="w-5 h-5 text-primary-600" />
                Basic Information
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Age"
                  type="number"
                  {...register("age")}
                  error={errors?.age?.message}
                />
                <Input
                  label="Gender"
                  {...register("gender")}
                  error={errors?.gender?.message}
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  {...register("height")}
                  error={errors?.height?.message}
                />
                <Input
                  label="Weight (Kg)"
                  type="number"
                  {...register("weight")}
                  error={errors?.weight?.message}
                />
              </div>
            </Card>

            {/* Section 2: Dietary & Lifestyle */}
            <Card className="p-4 sm:px-5 w-full">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-dark-100">
                <HeartIcon className="w-5 h-5 text-primary-600" />
                Dietary & Lifestyle
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  label="Food Frequency Questionnaire"
                  placeholder="List common foods/frequency"
                  {...register("foodFrequency")}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Consanguinity
                  </label>
                  <select
                    {...register("consanguinity")}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {errors?.consanguinity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.consanguinity.message}
                    </p>
                  )}
                </div>
                <Input
                  label="Parents' Occupation"
                  {...register("parentsOccupation")}
                  placeholder="e.g., Engineer, Teacher"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Diet Type
                  </label>
                  <select
                    {...register("dietType")}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                  >
                    <option value="">Select...</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
                  {errors?.dietType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dietType.message}
                    </p>
                  )}
                </div>
                <Input
                  label="Activity"
                  {...register("activity")}
                  error={errors?.activity?.message}
                />
                <Input
                  label="Sleep Duration"
                  {...register("sleepDuration")}
                  error={errors?.sleepDuration?.message}
                />
                <Input
                  label="Sleep Quality"
                  {...register("sleepQuality")}
                  error={errors?.sleepQuality?.message}
                />
                <Input
                  label="Screen Time"
                  {...register("screenTime")}
                  error={errors?.screenTime?.message}
                />
                <Input label="Timing of Food" {...register("foodTiming")} />
                <Input label="Fruits Consumed" {...register("fruits")} />
                <Input label="Vegetables Consumed" {...register("vegetables")} />
              </div>
            </Card>

            {/* Section 3: Family & Health History */}
            <Card className="p-4 sm:px-5 w-full">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-dark-100">
                <UsersIcon className="w-5 h-5 text-primary-600" />
                Family & Health History
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Family Type
                  </label>
                  <select
                    {...register("familyType")}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                  >
                    <option value="">Select...</option>
                    <option value="nuclear">Nuclear</option>
                    <option value="joint">Joint</option>
                  </select>
                  {errors?.familyType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.familyType.message}
                    </p>
                  )}
                </div>
                <Input
                  label="Number of Siblings"
                  type="number"
                  {...register("siblings")}
                  error={errors?.siblings?.message}
                />
                <Textarea
                  label="Vaccination"
                  {...register("vaccination")}
                  error={errors?.vaccination?.message}
                  placeholder="e.g., Fully or Partially Vaccinated"
                />
              </div>
            </Card>

            {/* Section 4: Environment & Exposure */}
            <Card className="p-4 sm:px-5 w-full">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-dark-100">
                <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                Environment & Exposure
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Access to Nature
                  </label>
                  <select
                    {...register("natureAccess")}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600"
                  >
                    <option value="">Select...</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="occasional">Occasional</option>
                    <option value="virtual">Virtual Only</option>
                  </select>
                </div>
                <Input label="Pollution (Air)" {...register("pollutionAir")} />
                <Input label="Pollution (Noise)" {...register("pollutionNoise")} />
                <Input label="Pollution (Water)" {...register("pollutionWater")} />
                <Input
                  label="Travel Time"
                  {...register("travelTime")}
                  error={errors?.travelTime?.message}
                />
              </div>
            </Card>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default HealthForm;
