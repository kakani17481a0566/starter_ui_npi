// ----------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import {
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  HeartIcon,
  UsersIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import { useState, useEffect } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { toast } from "sonner";
import axios from "axios";
import { schema } from "./schema";
import { DatePicker } from "components/shared/form/Datepicker";
import { getSessionData } from "utils/sessionStorage";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card, Input } from "components/ui";
import { HEALTH_REGISTRATION } from "constants/apis";

// ----------------------------------------------------------------------
// Initial Values
// ----------------------------------------------------------------------

const getInitialState = () => ({
  // Personal Information
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
  country: "",
  state: "",
  city: "",
  dateOfBirth: "",
  fatherDateOfBirth: "",
  motherDateOfBirth: "",
  age: "",

  // Health & Family History
  gender: "",
  height: "",
  weight: "",
  familyType: "",
  siblings: "",
  consanguinity: "",
  vaccination: "",
  email: "",

  // Diet & Lifestyle
  dietType: "",
  activity: "",
  sleepDuration: "",
  screenTime: "",
  fruits: "",
  vegetables: "",
  plantBasedProtein: "",
  animalBasedProtein: "",
  foodTiming: "",
  sleepQuality: "",
  foodFrequency: "",

  // Environment & Exposure
  natureAccess: "",
  pollutionAir: "",
  pollutionNoise: "",
  pollutionWater: "",
  passiveSmoking: "",
  travelTime: "",
});

// ----------------------------------------------------------------------
// Tooltip Component
// ----------------------------------------------------------------------
const CustomTooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex cursor-help items-center"
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute top-full left-1/2 z-50 mt-2 w-72 -translate-x-1/2 transform">
          <div className="bg-primary-50 border-primary-200 text-primary-900 relative rounded-lg border p-3 shadow-lg">
            {/* Tooltip arrow */}
            <div className="bg-primary-50 border-primary-200 absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-t border-l"></div>

            {/* Tooltip content */}
            <div className="relative z-10">
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Enhanced Tooltip Component for Protein Fields
// ----------------------------------------------------------------------
const ProteinTooltip = ({ title, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex cursor-help items-center"
      >
        <InformationCircleIcon className="text-primary-500 hover:text-primary-600 ml-1 h-4 w-4 transition-colors" />
      </div>

      {isVisible && (
        <div className="absolute top-full left-1/2 z-50 mt-2 w-80 -translate-x-1/2 transform">
          <div className="bg-primary-50 border-primary-200 text-primary-900 relative rounded-lg border p-4 shadow-xl">
            {/* Tooltip arrow */}
            <div className="bg-primary-50 border-primary-200 absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-t border-l"></div>

            {/* Tooltip content */}
            <div className="relative z-10">
              <h4 className="text-primary-800 mb-2 text-sm font-semibold">
                {title}
              </h4>
              <p className="text-primary-700 text-xs leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Validation Debug Component
// ----------------------------------------------------------------------
const ValidationDebug = ({ errors, formValues, session }) => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-500 text-white p-2 rounded text-sm"
      >
        {Object.keys(errors).length} Errors
      </button>

      {showDebug && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg mt-2 max-w-md max-h-96 overflow-auto">
          <h4 className="font-bold mb-2">Validation Debug:</h4>
          <div className="text-sm">
            <p><strong>Total Errors:</strong> {Object.keys(errors).length}</p>
            <p><strong>Required Fields Filled:</strong> {
              Object.keys(formValues).filter(key =>
                formValues[key] && formValues[key].toString().trim() !== ''
              ).length
            } / {Object.keys(formValues).length}</p>
            <p><strong>Session:</strong> {session.userId ? `User: ${session.userId}, Tenant: ${session.tenantId}` : 'Not logged in'}</p>

            {Object.keys(errors).length > 0 && (
              <div className="mt-2">
                <strong>Errors:</strong>
                {Object.entries(errors).map(([key, error]) => (
                  <div key={key} className="text-red-500">
                    {key}: {error.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Enhanced Submit Button Component
// ----------------------------------------------------------------------
const SubmitButton = ({ isSubmitting, errors, formValues, onClick, isAuthenticated }) => {
  const hasErrors = Object.keys(errors).length > 0;
  const isFormEmpty = Object.values(formValues).every(value =>
    value === "" || value === null || value === undefined
  );

  const getButtonState = () => {
    if (!isAuthenticated) return "not-authenticated";
    if (isSubmitting) return "submitting";
    if (hasErrors) return "has-errors";
    if (isFormEmpty) return "empty";
    return "ready";
  };

  const buttonState = getButtonState();

  const getTooltipText = () => {
    switch (buttonState) {
      case "not-authenticated": return "Please log in to submit form";
      case "submitting": return "Form is submitting...";
      case "has-errors": return `Please fix ${Object.keys(errors).length} form errors`;
      case "empty": return "Please fill in required fields";
      case "ready": return "Click to submit form";
      default: return "Submit form";
    }
  };

  return (
    <Button
      color="primary"
      type="submit"
      form="health-form"
      className="min-w-[7rem] relative"
      disabled={!isAuthenticated || isSubmitting || hasErrors || isFormEmpty}
      title={getTooltipText()}
      onClick={onClick}
    >
      {!isAuthenticated ? "Login Required" : isSubmitting ? "Submitting..." : "Save & Clear"}
      {!isAuthenticated && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
      )}
      {isAuthenticated && hasErrors && !isSubmitting && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      {buttonState === "ready" && !isSubmitting && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
    </Button>
  );
};

// ----------------------------------------------------------------------
// Session Validation Hook
// ----------------------------------------------------------------------
const useSessionValidation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const session = getSessionData();
    const hasValidSession = session.token && session.tenantId && session.userId;

    setIsAuthenticated(!!hasValidSession);
    setSessionData(session);
  }, []);

  return { isAuthenticated, sessionData };
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const HealthForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getInitialState(),
  });

  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const { isAuthenticated, sessionData } = useSessionValidation();

  // Watch date of birth for age calculation
  const dateOfBirth = watch("dateOfBirth");

  // Calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      setValue("age", calculatedAge);
      trigger("age");
    } else {
      setValue("age", "");
    }
  }, [dateOfBirth, setValue, trigger]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    try {
      const actualDate = Array.isArray(birthDate) ? birthDate[0] : birthDate;
      const today = new Date();
      const birth = new Date(actualDate);

      if (isNaN(birth.getTime())) return "";

      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age > 0 ? age.toString() : "0";
    } catch {
      return "";
    }
  };

  // ----------------------------------------------------------------------
  // Date Handler Function
  // ----------------------------------------------------------------------
  const handleDateChange = (date, fieldName) => {
    let dateValue = "";

    if (Array.isArray(date) && date.length > 0) {
      dateValue = date[0];
    } else if (date) {
      dateValue = date;
    }

    setValue(fieldName, dateValue);

    if (fieldName === "dateOfBirth") {
      const calculatedAge = calculateAge(dateValue);
      setValue("age", calculatedAge);
      trigger("age");
    }
  };

  // ----------------------------------------------------------------------
  // Submit Handler with Session Data Integration
  // ----------------------------------------------------------------------
  const onSubmit = async (data) => {
    try {
      if (!isAuthenticated) {
        toast.error("Please log in to submit the form");
        return;
      }

      const isValid = await trigger();

      if (!isValid) {
        toast.error("Please fix all form errors before submitting");
        return;
      }

      // Get session data for tenantId and createdBy
      const currentTenantId = sessionData.tenantId ? parseInt(sessionData.tenantId) : 1;
      const currentUserId = sessionData.userId ? parseInt(sessionData.userId) : 1;

      const parentsOccupation = `${data.fatherOccupation || ''} & ${data.motherOccupation || ''}`.trim();

      const formatDateForAPI = (dateValue) => {
        if (!dateValue) return null;

        const actualDate = Array.isArray(dateValue) ? dateValue[0] : dateValue;

        if (!actualDate) return null;

        const date = new Date(actualDate);
        if (isNaN(date.getTime())) return null;

        return date.toISOString();
      };

      const formData = {
        // Personal Information
        userName: data.studentName,
        userId: data.studentId ? parseInt(data.studentId) : null,
        className: data.className || null,
        branch: data.branch || null,
        fatherName: data.fatherName,
        fatherOccupation: data.fatherOccupation,
        motherName: data.motherName,
        motherOccupation: data.motherOccupation,
        parentsOccupation: parentsOccupation,
        countryCode: data.countryCode || "+91",
        contactNumber: data.contactNumber,
        email: data.email,
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
        dateOfBirth: formatDateForAPI(data.dateOfBirth),
        fatherDateOfBirth: formatDateForAPI(data.fatherDateOfBirth),
        motherDateOfBirth: formatDateForAPI(data.motherDateOfBirth),
        age: data.age ? parseInt(data.age) : calculateAge(data.dateOfBirth) ? parseInt(calculateAge(data.dateOfBirth)) : null,

        // Health Information
        gender: data.gender,
        height: data.height ? parseFloat(data.height) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        consanguinity: data.consanguinity,

        // Diet & Lifestyle
        dietType: data.dietType,
        activity: data.activity,
        sleepDuration: data.sleepDuration,
        sleepQuality: data.sleepQuality || "Good",
        screenTime: data.screenTime,
        foodTiming: data.foodTiming,
        fruits: data.fruits,
        vegetables: data.vegetables,
        plantBasedProtein: data.plantBasedProtein,
        animalBasedProtein: data.animalBasedProtein,
        foodFrequency: data.foodFrequency || "3 meals per day",

        // Family & Environment
        familyType: data.familyType,
        siblings: data.siblings ? parseInt(data.siblings) : null,
        vaccination: data.vaccination,
        natureAccess: data.natureAccess,
        pollutionAir: data.pollutionAir,
        pollutionNoise: data.pollutionNoise,
        pollutionWater: data.pollutionWater,
        passiveSmoking: data.passiveSmoking,
        travelTime: data.travelTime,

        // Session Data (automatically included, not visible in frontend)
        tenantId: currentTenantId,
        createdBy: currentUserId,
        updatedBy: null,
        isDeleted: false
      };

      // Log for debugging (remove in production)
      console.log('Submitting form data with session:', {
        tenantId: currentTenantId,
        createdBy: currentUserId,
        formData: formData
      });

      await axios.post(HEALTH_REGISTRATION, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      toast.success("Genetic registration submitted successfully!");
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);

      if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else if (error.response) {
        const errorMessage = error.response?.data?.message ||
                            error.response?.data?.error ||
                            `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    }
  };

  // Handle button click
  const handleSubmitClick = () => {
    // Button click handler
  };

  // Reset form handler
  const resetForm = () => {
    reset(getInitialState());
    setSelectedCountryId(null);
    setSelectedStateId(null);
    setSelectedCityId(null);
  };

  // Handle country selection
  const handleCountryChange = (val) => {
    setSelectedCountryId(val?.id || null);
    setSelectedStateId(null);
    setSelectedCityId(null);
    setValue("country", val?.name || "");
    setValue("state", "");
    setValue("city", "");
  };

  // Handle state selection
  const handleStateChange = (val) => {
    setSelectedStateId(val?.id || null);
    setSelectedCityId(null);
    setValue("state", val?.name || "");
    setValue("city", "");
  };

  // Handle city selection
  const handleCityChange = (val) => {
    setSelectedCityId(val?.id || null);
    setValue("city", val?.name || "");
  };

  // ----------------------------------------------------------------------
  // Form Sections Configuration (Updated with missing fields)
  // ----------------------------------------------------------------------
  const formSections = [
    {
      title: "Personal Information",
      icon: UserCircleIcon,
      fields: [
        // Country, State, City
        { type: "country", key: "country", label: "Country Of Birth" },
        { type: "state", key: "state", label: "State of Birth" },
        { type: "city", key: "city", label: "Place Of Birth" },

        // Student Information
        {
          type: "input",
          key: "studentName",
          label: "User Name",
          placeholder: "Enter User Name, Middle Name, Last name",
        },
        {
          type: "date",
          key: "dateOfBirth",
          label: "User's Date of Birth",
        },
        {
          type: "input",
          key: "age",
          label: "Age (Auto-calculated)",
          inputType: "number",
          placeholder: "Auto-calculated from date of birth",
          disabled: true,
        },
        {
          type: "input",
          key: "studentId",
          label: "User ID",
          placeholder: "Enter User ID",
        },

        // Father's Information
        {
          type: "input",
          key: "fatherName",
          label: "Father's Name",
          placeholder: "Enter Father's Name, Middle Name, Last name",
        },
        {
          type: "input",
          key: "fatherOccupation",
          label: "Father's Occupation",
          placeholder: "e.g., Engineer",
        },
        {
          type: "date",
          key: "fatherDateOfBirth",
          label: "Father's Date of Birth",
        },

        // Mother's Information
        {
          type: "input",
          key: "motherName",
          label: "Mother's Name",
          placeholder: "Enter Mother's Name, Middle Name, Last name",
        },
        {
          type: "input",
          key: "motherOccupation",
          label: "Mother's Occupation",
          placeholder: "e.g., Teacher",
        },
        {
          type: "date",
          key: "motherDateOfBirth",
          label: "Mother's Date of Birth",
        },
      ],
    },
    {
      title: "Health & Family History",
      icon: UsersIcon,
      fields: [
        // Gender Radio
        {
          type: "radio",
          key: "gender",
          label: "Gender",
          options: ["male", "female"],
        },

        // Physical Attributes
        {
          type: "input",
          key: "height",
          label: "Height (cm)",
          inputType: "number",
          placeholder: "Enter height in cm",
          step: "0.1",
        },
        {
          type: "input",
          key: "weight",
          label: "Weight (Kg)",
          inputType: "number",
          placeholder: "Enter weight in kg",
          step: "0.1",
        },

        // Family Information
        {
          type: "select",
          key: "familyType",
          label: "Type of Family",
          options: [
            { value: "", label: "Select..." },
            { value: "nuclear", label: "Nuclear" },
            { value: "extended", label: "Extended" },
            { value: "joint", label: "Joint Family" },
            { value: "single", label: "Single Parent" },
          ],
        },
        {
          type: "input",
          key: "siblings",
          label: "Number of Siblings",
          inputType: "number",
          placeholder: "Enter number",
          min: "0",
        },

        // Medical History
        {
          type: "radio",
          key: "consanguinity",
          label: "Consanguinity",
          options: ["Y", "N"],
          tooltip:
            "Refers to marriage or relation between individuals closely related by blood (e.g., cousins).",
        },
        {
          type: "radio",
          key: "vaccination",
          label: "Vaccination",
          options: ["yes", "no"],
        },

        // Contact Information
        {
          type: "phone",
          key: "contactNumber",
          label: "Parent's Contact Number",
        },
        {
          type: "input",
          key: "email",
          label: "Email Address",
          inputType: "email",
          placeholder: "Enter email address",
        },
      ],
    },
    {
      title: "Diet & Lifestyle",
      icon: HeartIcon,
      fields: [
        {
          type: "input",
          key: "activity",
          label: "Extracurricular Activity",
          placeholder: "Enter activities (e.g., Football, Swimming)",
        },
        {
          type: "input",
          key: "sleepDuration",
          label: "Sleep Duration",
          placeholder: "e.g., 8 hours",
        },
        {
          type: "select",
          key: "sleepQuality",
          label: "Sleep Quality",
          options: [
            { value: "", label: "Select..." },
            { value: "poor", label: "Poor" },
            { value: "fair", label: "Fair" },
            { value: "good", label: "Good" },
            { value: "excellent", label: "Excellent" },
          ],
        },
        {
          type: "input",
          key: "screenTime",
          label: "Screen Time",
          placeholder: "e.g., 2 hours",
        },
        {
          type: "select",
          key: "dietType",
          label: "Diet Type",
          options: [
            { value: "", label: "Select..." },
            { value: "vegetarian", label: "Vegetarian" },
            { value: "vegan", label: "Vegan" },
            { value: "non-vegetarian", label: "Non-Vegetarian" },
            { value: "pescatarian", label: "Pescatarian" },
            { value: "eggetarian", label: "Eggetarian" },
          ],
        },
        {
          type: "select",
          key: "foodFrequency",
          label: "Food Frequency",
          options: [
            { value: "", label: "Select..." },
            { value: "1-2 meals", label: "1-2 meals per day" },
            { value: "3 meals", label: "3 meals per day" },
            { value: "3 meals + snacks", label: "3 meals + snacks" },
            { value: "irregular", label: "Irregular timing" },
            { value: "frequent", label: "Frequent small meals" },
          ],
        },
        {
          type: "input",
          key: "fruits",
          label: "Fruits Intake",
          placeholder: "e.g., Daily, Weekly, Types of fruits",
        },
        {
          type: "input",
          key: "vegetables",
          label: "Vegetables Intake",
          placeholder: "e.g., Daily, Weekly, Types of vegetables",
        },
        {
          type: "input",
          key: "plantBasedProtein",
          label: "Plant Based Protein Intake",
          placeholder: "e.g., Daily, Weekly, Types",
          tooltip: {
            title: "Plant-Based Protein Sources",
            content:
              "Includes: Beans, lentils, chickpeas, peas, tofu, tempeh, edamame, quinoa, nuts, seeds, and other plant-derived protein sources.",
          },
        },
        {
          type: "input",
          key: "animalBasedProtein",
          label: "Animal Based Protein Intake",
          placeholder: "e.g., Daily, Weekly, Types",
          tooltip: {
            title: "Animal-Based Protein Sources",
            content:
              "Includes: Meat, chicken, fish, eggs, dairy products (milk, cheese, yogurt), and other animal-derived protein sources.",
          },
        },
        {
          type: "input",
          key: "foodTiming",
          label: "Interval Between Meals",
          placeholder: "e.g., 4 hours",
        },
      ],
    },
    {
      title: "Environment & Exposure",
      icon: GlobeAltIcon,
      fields: [
        {
          type: "select",
          key: "natureAccess",
          label: "Access to Nature",
          options: [
            { value: "", label: "Select..." },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "occasional", label: "Occasional" },
            { value: "virtual", label: "Virtual Only" },
            { value: "rarely", label: "Rarely" },
            { value: "never", label: "Never" },
          ],
        },
        ...[
          "pollutionAir",
          "pollutionNoise",
          "pollutionWater",
          "passiveSmoking",
        ].map((field) => ({
          type: "radio",
          key: field,
          label: getPollutionLabel(field),
          options: ["yes", "no"],
        })),
        {
          type: "input",
          key: "travelTime",
          label: "Travel Time (to school/activities)",
          placeholder: "e.g., 30 minutes",
        },
      ],
    },
  ];

  // Helper function for pollution labels
  function getPollutionLabel(field) {
    const labels = {
      pollutionAir: "Pollution (Air)",
      pollutionNoise: "Pollution (Noise)",
      pollutionWater: "Pollution (Water)",
      passiveSmoking: "Passive Smoking Exposure",
    };
    return labels[field] || field;
  }

  // ----------------------------------------------------------------------
  // Render Field Component (Updated for disabled age field and fixed date handling)
  // ----------------------------------------------------------------------
  const renderField = (fieldConfig) => {
    const { type, key, label, placeholder, options, inputType, tooltip, disabled } =
      fieldConfig;
    const error = errors[key]?.message;

    switch (type) {
      case "input":
        return (
          <div key={key} className="relative">
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
              {tooltip && (
                <ProteinTooltip
                  title={tooltip.title}
                  content={tooltip.content}
                />
              )}
            </label>
            <Input
              type={inputType || "text"}
              {...register(key)}
              placeholder={placeholder}
              labelClassName="font-bold"
              className="font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50"
              error={error}
              disabled={disabled}
            />
          </div>
        );

      case "select":
        return (
          <div key={key}>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <select
              {...register(key)}
              className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm focus:outline-none"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={key}>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block flex items-center gap-1 text-sm font-bold">
              {label}
              {tooltip && (
                <CustomTooltip content={tooltip}>
                  <InformationCircleIcon className="text-primary-400 hover:text-primary-600 h-4 w-4 cursor-help transition-colors" />
                </CustomTooltip>
              )}
            </label>
            <div className="mt-1 flex gap-4">
              {options.map((val) => (
                <label
                  key={val}
                  className="text-primary-950 dark:text-dark-100 flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    value={val}
                    {...register(key)}
                    className="text-primary-600 focus:ring-primary-600 border-gray-300"
                  />
                  {val === "Y"
                    ? "Yes"
                    : val === "N"
                      ? "No"
                      : val.charAt(0).toUpperCase() + val.slice(1)}
                </label>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "date":
        return (
          <div key={key} className="w-full">
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date) => handleDateChange(date, key)}
                  options={{
                    disable: [
                      function (date) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date > today;
                      },
                    ],
                    locale: {
                      firstDayOfWeek: 1,
                    },
                  }}
                  placeholder={`Choose ${label.toLowerCase()}...`}
                  className="w-full"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "country":
        return (
          <div key={key}>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <CountrySelect
              onChange={handleCountryChange}
              value={selectedCountryId}
              className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
              placeholder="Select country"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "state":
        return (
          <div key={key}>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <StateSelect
              countryid={selectedCountryId}
              onChange={handleStateChange}
              value={selectedStateId}
              className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
              placeholder="Select state"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "city":
        return (
          <div key={key}>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <CitySelect
              countryid={selectedCountryId}
              stateid={selectedStateId}
              onChange={handleCityChange}
              value={selectedCityId}
              className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
              placeholder="Select city"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "phone":
        return (
          <div key={key}>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <div className="flex items-center gap-2">
              <select
                {...register("countryCode")}
                className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-24 rounded-md border border-gray-300 bg-white px-2 py-2 font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm focus:outline-none"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
              </select>

              <input
                type="text"
                {...register(key)}
                placeholder="9876543210"
                className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm focus:outline-none"
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  // ----------------------------------------------------------------------
  // Function to get complete card styling based on section title
  // ----------------------------------------------------------------------
  const getCardStyle = (sectionTitle) => {
    switch (sectionTitle) {
      case "Personal Information":
        return {
          background: "bg-orange-50 dark:bg-[rgba(252,211,77,0.1)]",
          border: "border border-orange-200 dark:border-[rgba(252,211,77,0.3)]",
        };

      case "Health & Family History":
        return {
          background: "bg-green-50 dark:bg-[rgba(110,231,183,0.1)]",
          border: "border-green-200 dark:border-[rgba(110,231,183,0.3)]",
        };
      case "Diet & Lifestyle":
        return {
          background: "bg-pink-50 dark:bg-[rgba(249,168,212,0.1)]",
          border: "border-pink-200 dark:border-[rgba(249,168,212,0.3)]",
        };
      case "Environment & Exposure":
        return {
          background: "bg-violet-50 dark:bg-[rgba(196,181,253,0.1)]",
          border: "border-violet-200 dark:border-[rgba(196,181,253,0.3)]",
        };
      default:
        return {
          background: "bg-white dark:bg-dark-700",
          border: "border-gray-200 dark:border-dark-600",
        };
    }
  };

  // ----------------------------------------------------------------------
  // JSX
  // ----------------------------------------------------------------------
  return (
    <Page
      title="Genetic Registration Form"
      className="dark:bg-dark-800 bg-gray-50"
    >
      <div className={`transition-content font-lato dark:bg-dark-800 bg-gray-50 pb-6 font-bold ${!isAuthenticated ? 'opacity-50 pointer-events-none' : ''}`}>

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 mx-4">
            <p className="text-yellow-800 text-center">
              ⚠️ Please log in to access the genetic registration form.
            </p>
          </div>
        )}

        {/* Header Bar */}
        <div className="dark:bg-dark-800 flex flex-col items-center justify-between space-y-4 bg-gray-50 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="text-primary-600 h-6 w-6" />
            <h2 className="text-primary-950 dark:text-dark-50 line-clamp-1 text-xl font-bold">
              Genetic Registration Form
            </h2>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={resetForm}
              className="min-w-[7rem]"
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <SubmitButton
              isSubmitting={isSubmitting}
              errors={errors}
              formValues={watch()}
              onClick={handleSubmitClick}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>

        {/* Form */}
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="health-form"
        >
          <div className="dark:bg-dark-800 space-y-5 bg-gray-50">
            {formSections.map((section) => {
              const cardStyle = getCardStyle(section.title);
              return (
                <Card
                  key={section.title}
                  className={`w-full border-2 p-4 shadow-none sm:px-5 ${cardStyle.background} ${cardStyle.border}`}
                >
                  <h3 className="text-primary-950 dark:text-dark-100 flex items-center gap-2 text-base font-medium">
                    <section.icon className="text-primary-600 h-5 w-5" />
                    {section.title}
                  </h3>
                  <div className="text-primary-950 dark:text-dark-100 mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {section.fields.map(renderField)}
                  </div>
                </Card>
              );
            })}
          </div>
        </form>

        {/* Debug Panel */}
        <ValidationDebug errors={errors} formValues={watch()} session={sessionData} />
      </div>
    </Page>
  );
};

export default HealthForm;