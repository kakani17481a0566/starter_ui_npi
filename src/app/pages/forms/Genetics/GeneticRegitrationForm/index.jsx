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
import { useState, useEffect, useCallback, memo, useMemo } from "react";
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

// Data Imports
import {
  getInitialState,
  getFormSections,
  getCardStyle
} from "./data";

// ----------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------
const calculateAge = (birthDate) => {
  if (!birthDate) return "";

  try {
    const actualDate = Array.isArray(birthDate) ? birthDate[0] : birthDate;
    const today = new Date();
    const birth = new Date(actualDate);

    if (isNaN(birth.getTime())) return "";

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age > 0 ? age.toString() : "0";
  } catch {
    return "";
  }
};

// ----------------------------------------------------------------------
// Custom Location Select Components (FIXED)
// ----------------------------------------------------------------------
const CustomCountrySelect = memo(({
  onChange,
  value,
  placeholder,
  disabled,
  className
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (value) {
      setSelectedCountry(typeof value === 'string' ? { name: value } : value);
    } else {
      setSelectedCountry(null);
    }
  }, [value]);

  const handleChange = (val) => {
    const countryData = val ? { id: val.id, name: val.name } : null;
    setSelectedCountry(countryData);
    onChange(countryData);
  };

  return (
    <div>
      <CountrySelect
        onChange={handleChange}
        value={selectedCountry}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
      {selectedCountry?.name && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {selectedCountry.name}
        </div>
      )}
    </div>
  );
});

CustomCountrySelect.displayName = 'CustomCountrySelect';

const CustomStateSelect = memo(({
  countryid,
  onChange,
  value,
  placeholder,
  disabled,
  className
}) => {
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    if (value) {
      setSelectedState(typeof value === 'string' ? { name: value } : value);
    } else {
      setSelectedState(null);
    }
  }, [value]);

  const handleChange = (val) => {
    const stateData = val ? { id: val.id, name: val.name } : null;
    setSelectedState(stateData);
    onChange(stateData);
  };

  return (
    <div>
      <StateSelect
        countryid={countryid}
        onChange={handleChange}
        value={selectedState}
        placeholder={placeholder}
        disabled={disabled || !countryid}
        className={`${className} ${!countryid ? 'opacity-50' : ''}`}
      />
      {selectedState?.name && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {selectedState.name}
        </div>
      )}
      {!countryid && (
        <div className="mt-1 text-xs text-orange-500">
          Please select a country first
        </div>
      )}
    </div>
  );
});

CustomStateSelect.displayName = 'CustomStateSelect';

const CustomCitySelect = memo(({
  countryid,
  stateid,
  onChange,
  value,
  placeholder,
  disabled,
  className
}) => {
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (value) {
      setSelectedCity(typeof value === 'string' ? { name: value } : value);
    } else {
      setSelectedCity(null);
    }
  }, [value]);

  const handleChange = (val) => {
    const cityData = val ? { id: val.id, name: val.name } : null;
    setSelectedCity(cityData);
    onChange(cityData);
  };

  return (
    <div>
      <CitySelect
        countryid={countryid}
        stateid={stateid}
        onChange={handleChange}
        value={selectedCity}
        placeholder={placeholder}
        disabled={disabled || !stateid}
        className={`${className} ${!stateid ? 'opacity-50' : ''}`}
      />
      {selectedCity?.name && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {selectedCity.name}
        </div>
      )}
      {!stateid && (
        <div className="mt-1 text-xs text-orange-500">
          Please select a state first
        </div>
      )}
    </div>
  );
});

CustomCitySelect.displayName = 'CustomCitySelect';

// ----------------------------------------------------------------------
// Tooltip Components (FIXED)
// ----------------------------------------------------------------------
const CustomTooltip = memo(({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex cursor-help items-center"
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 transform">
          <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-sm shadow-lg">
            <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>
            {content}
          </div>
        </div>
      )}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

const ProteinTooltip = memo(({ title, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex cursor-help items-center"
      >
        <InformationCircleIcon className="text-primary-500 hover:text-primary-600 ml-1 h-4 w-4 transition-colors" />
      </div>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-80 -translate-x-1/2 transform">
          <div className="bg-gray-900 text-white rounded-lg px-4 py-3 shadow-xl">
            <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>
            <div className="relative z-10">
              <h4 className="mb-1 text-sm font-semibold text-white">
                {title}
              </h4>
              <p className="text-xs leading-relaxed text-gray-200">
                {content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProteinTooltip.displayName = 'ProteinTooltip';

// ----------------------------------------------------------------------
// Submit Button Component (FIXED ESLINT ERRORS)
// ----------------------------------------------------------------------
const SubmitButton = memo(({
  isSubmitting,
  errors,
  formValues,
  onClick,
  isAuthenticated
}) => {
  const hasErrors = Object.keys(errors).length > 0;
  const isFormEmpty = Object.values(formValues).every(value =>
    value === "" || value === null || value === undefined
  );

  const getButtonState = useCallback(() => {
    if (!isAuthenticated) return "not-authenticated";
    if (isSubmitting) return "submitting";
    if (hasErrors) return "has-errors";
    if (isFormEmpty) return "empty";
    return "ready";
  }, [isAuthenticated, isSubmitting, hasErrors, isFormEmpty]);

  // FIXED: Removed unused 'key' variable and fixed useEffect dependency
  useEffect(() => {
    console.log('🔍 SUBMIT BUTTON DEBUG:');
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - isSubmitting:', isSubmitting);
    console.log('  - hasErrors:', hasErrors, 'Error count:', Object.keys(errors).length);
    console.log('  - isFormEmpty:', isFormEmpty);

    if (hasErrors) {
      console.log('  - ERRORS DETAIL:', errors);
    }

    if (isFormEmpty) {
      const emptyFields = Object.entries(formValues)
        .filter(([, value]) => value === "" || value === null || value === undefined)
        .map(([fieldKey]) => fieldKey);
      console.log('  - EMPTY FIELDS:', emptyFields);
    }

    // Log button state
    const buttonState = getButtonState();
    console.log('  - BUTTON STATE:', buttonState);
    console.log('  - BUTTON DISABLED:', !isAuthenticated || isSubmitting || hasErrors || isFormEmpty);
  }, [isAuthenticated, isSubmitting, hasErrors, isFormEmpty, errors, formValues, getButtonState]);

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
});

SubmitButton.displayName = 'SubmitButton';

// ----------------------------------------------------------------------
// Session Validation Hook
// ----------------------------------------------------------------------
const useSessionValidation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const session = getSessionData();
    const hasValidSession = session.token && session.tenantId && session.userId;

    console.log('🔐 SESSION VALIDATION:', {
      hasToken: !!session.token,
      hasTenantId: !!session.tenantId,
      hasUserId: !!session.userId,
      isAuthenticated: !!hasValidSession
    });

    setIsAuthenticated(!!hasValidSession);
    setSessionData(session);
  }, []);

  return { isAuthenticated, sessionData };
};

// ----------------------------------------------------------------------
// Field Renderer Component (FIXED ESLINT ERRORS)
// ----------------------------------------------------------------------
const FieldRenderer = ({ fieldConfig, errors, register, control, selectedCountryId, selectedStateId, selectedBiologicalCountryId, selectedBiologicalStateId, handleCountryChange, handleStateChange, handleCityChange, handleBiologicalCountryChange, handleBiologicalStateChange, handleBiologicalCityChange, handleDateChange }) => {
  const { type, key, label, placeholder, options, inputType, tooltip, disabled, step, min } = fieldConfig;
  const error = errors[key]?.message;

  // FIXED: Moved useEffect outside of renderField to follow Rules of Hooks
  useEffect(() => {
    if (error) {
      console.log(`🚨 FIELD ERROR [${key}]:`, error);
    }
  }, [error, key]);

  const renderField = () => {
    switch (type) {
      case "input":
        return (
          <div className="relative">
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
              {tooltip && typeof tooltip === 'object' && (
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
              step={step}
              min={min}
            />
          </div>
        );

      case "select":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
              {tooltip && typeof tooltip === 'string' && (
                <CustomTooltip content={tooltip}>
                  <InformationCircleIcon className="text-primary-400 hover:text-primary-600 ml-1 h-4 w-4 cursor-help transition-colors" />
                </CustomTooltip>
              )}
            </label>
            <select
              {...register(key)}
              className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none"
              disabled={disabled}
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "radio-small":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <div className="mt-1 flex gap-4">
              {options?.map((val) => (
                <label
                  key={val}
                  className="text-primary-950 dark:text-dark-100 flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    value={val}
                    {...register(key)}
                    className="text-primary-600 focus:ring-primary-600 h-3 w-3 border-gray-300"
                  />
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </label>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block flex items-center gap-1 text-sm font-bold">
              {label}
              {tooltip && typeof tooltip === 'string' && (
                <CustomTooltip content={tooltip}>
                  <InformationCircleIcon className="text-primary-400 hover:text-primary-600 h-4 w-4 cursor-help transition-colors" />
                </CustomTooltip>
              )}
            </label>
            <div className="mt-1 flex gap-4">
              {options?.map((val) => (
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
          <div className="w-full">
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
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <CustomCountrySelect
                  onChange={handleCountryChange}
                  value={field.value}
                  placeholder="Select country"
                  className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "state":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <CustomStateSelect
                  countryid={selectedCountryId}
                  onChange={handleStateChange}
                  value={field.value}
                  placeholder="Select state"
                  className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "city":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <CustomCitySelect
                  countryid={selectedCountryId}
                  stateid={selectedStateId}
                  onChange={handleCityChange}
                  value={field.value}
                  placeholder="Select city"
                  className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "biological-country":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <CustomCountrySelect
                  onChange={handleBiologicalCountryChange}
                  value={field.value}
                  placeholder="Select biological country"
                  disabled={disabled}
                  className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "biological-state":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <CustomStateSelect
                  countryid={selectedBiologicalCountryId}
                  onChange={handleBiologicalStateChange}
                  value={field.value}
                  placeholder="Select biological state"
                  disabled={disabled}
                  className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "biological-city":
        return (
          <div>
            <label className="text-primary-950 dark:text-dark-100 mb-1 block text-sm font-bold">
              {label}
            </label>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <CustomCitySelect
                  countryid={selectedBiologicalCountryId}
                  stateid={selectedBiologicalStateId}
                  onChange={handleBiologicalCityChange}
                  value={field.value}
                  placeholder="Select biological city"
                  disabled={disabled}
                  className="focus:ring-primary-600 focus:border-primary-600 dark:bg-dark-600 dark:border-dark-500 dark:text-dark-100 w-full rounded-md border border-gray-300 bg-white font-normal italic placeholder:text-primary-950 dark:placeholder:text-primary-50 shadow-sm"
                />
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      case "phone":
        return (
          <div>
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
                disabled={disabled}
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return <div key={key}>{renderField()}</div>;
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
const HealthForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, touchedFields },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getInitialState(),
    mode: "onChange",
  });

  const { isAuthenticated, sessionData } = useSessionValidation();

  // Watch all form values for debugging
  const formValues = watch();

  // ADDED: Comprehensive form state logging
  useEffect(() => {
    console.log('📊 FORM STATE UPDATE:');
    console.log('  - isValid:', isValid);
    console.log('  - isDirty:', isDirty);
    console.log('  - isSubmitting:', isSubmitting);
    console.log('  - Error count:', Object.keys(errors).length);
    console.log('  - Touched fields:', Object.keys(touchedFields));
    console.log('  - Form values count:', Object.keys(formValues).length);
  }, [isValid, isDirty, isSubmitting, errors, touchedFields, formValues]);

  // ADDED: Log when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('❌ FORM ERRORS DETECTED:', errors);
    } else {
      console.log('✅ FORM VALID - No errors');
    }
  }, [errors]);

  // ADDED: Log initial form state
  useEffect(() => {
    console.log('🎯 INITIAL FORM STATE:', getInitialState());
    console.log('🎯 CURRENT FORM VALUES:', formValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Location state management
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedBiologicalCountryId, setSelectedBiologicalCountryId] = useState(null);
  const [selectedBiologicalStateId, setSelectedBiologicalStateId] = useState(null);

  // Watch form values for calculations and dependencies
  const dateOfBirth = watch("dateOfBirth");
  const hasGuardian = watch("hasGuardian");
  const isBiologicalSame = watch("isBiologicalSame");

  // ADDED: Debug form values changes
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && type) {
        console.log(`🔄 FIELD CHANGED: ${name} =`, value[name], `(type: ${type})`);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // FIXED: Define resetForm BEFORE onSubmit to avoid reference error
  const resetForm = useCallback(() => {
    console.log('🔄 RESETTING FORM');
    reset(getInitialState());
    setSelectedCountryId(null);
    setSelectedStateId(null);
    setSelectedBiologicalCountryId(null);
    setSelectedBiologicalStateId(null);
  }, [reset]);

  // Calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      console.log(`🎂 Age calculated: ${calculatedAge} from DOB: ${dateOfBirth}`);
      setValue("age", calculatedAge);
      trigger("age");
    } else {
      setValue("age", "");
    }
  }, [dateOfBirth, setValue, trigger]);

  // Handle guardian radio button
  useEffect(() => {
    if (hasGuardian === "no") {
      console.log('👤 Guardian disabled, clearing guardian fields');
      setValue("guardianFirstName", "");
      setValue("guardianMiddleName", "");
      setValue("guardianLastName", "");
      setValue("guardianOccupation", "");
      setValue("guardianRelationship", "");
      setValue("guardianContactNumber", "");
      setValue("guardianEmail", "");
    } else if (hasGuardian === "yes") {
      console.log('👤 Guardian enabled');
    }
  }, [hasGuardian, setValue]);

  // Handle isBiologicalSame radio button - auto-fill biological fields if "yes"
  useEffect(() => {
    if (isBiologicalSame === "yes") {
      console.log('🧬 Biological same as current, auto-filling biological fields');
      setValue("biologicalCountry", formValues.country);
      setValue("biologicalState", formValues.state);
      setValue("biologicalCity", formValues.city);
    } else if (isBiologicalSame === "no") {
      console.log('🧬 Biological different from current, clearing biological fields');
      setValue("biologicalCountry", "");
      setValue("biologicalState", "");
      setValue("biologicalCity", "");
    }
  }, [isBiologicalSame, setValue, formValues.country, formValues.state, formValues.city]);

  // ----------------------------------------------------------------------
  // Location Handlers (FIXED)
  // ----------------------------------------------------------------------
  const handleCountryChange = useCallback((countryData) => {
    console.log('🌍 Country changed:', countryData);
    if (countryData) {
      setSelectedCountryId(countryData.id || null);
      setValue("country", countryData.name);
      setValue("state", "");
      setValue("city", "");
      setSelectedStateId(null);
    } else {
      setSelectedCountryId(null);
      setValue("country", "");
      setValue("state", "");
      setValue("city", "");
      setSelectedStateId(null);
    }
    trigger(["country", "state", "city"]);
  }, [setValue, trigger]);

  const handleStateChange = useCallback((stateData) => {
    console.log('🏞️ State changed:', stateData);
    if (stateData) {
      setSelectedStateId(stateData.id || null);
      setValue("state", stateData.name);
      setValue("city", "");
    } else {
      setSelectedStateId(null);
      setValue("state", "");
      setValue("city", "");
    }
    trigger(["state", "city"]);
  }, [setValue, trigger]);

  const handleCityChange = useCallback((cityData) => {
    console.log('🏙️ City changed:', cityData);
    if (cityData) {
      setValue("city", cityData.name);
    } else {
      setValue("city", "");
    }
    trigger("city");
  }, [setValue, trigger]);

  const handleBiologicalCountryChange = useCallback((countryData) => {
    console.log('🧬 Biological country changed:', countryData);
    if (countryData) {
      setSelectedBiologicalCountryId(countryData.id || null);
      setValue("biologicalCountry", countryData.name);
      setValue("biologicalState", "");
      setValue("biologicalCity", "");
      setSelectedBiologicalStateId(null);
    } else {
      setSelectedBiologicalCountryId(null);
      setValue("biologicalCountry", "");
      setValue("biologicalState", "");
      setValue("biologicalCity", "");
      setSelectedBiologicalStateId(null);
    }
    trigger(["biologicalCountry", "biologicalState", "biologicalCity"]);
  }, [setValue, trigger]);

  const handleBiologicalStateChange = useCallback((stateData) => {
    console.log('🧬 Biological state changed:', stateData);
    if (stateData) {
      setSelectedBiologicalStateId(stateData.id || null);
      setValue("biologicalState", stateData.name);
      setValue("biologicalCity", "");
    } else {
      setSelectedBiologicalStateId(null);
      setValue("biologicalState", "");
      setValue("biologicalCity", "");
    }
    trigger(["biologicalState", "biologicalCity"]);
  }, [setValue, trigger]);

  const handleBiologicalCityChange = useCallback((cityData) => {
    console.log('🧬 Biological city changed:', cityData);
    if (cityData) {
      setValue("biologicalCity", cityData.name);
    } else {
      setValue("biologicalCity", "");
    }
    trigger("biologicalCity");
  }, [setValue, trigger]);

  // ----------------------------------------------------------------------
  // Date Handler Function (FIXED)
  // ----------------------------------------------------------------------
  const handleDateChange = useCallback((date, fieldName) => {
    console.log('📅 Date changed:', fieldName, date);
    let dateValue = "";

    if (Array.isArray(date) && date.length > 0) {
      dateValue = date[0];
    } else if (date instanceof Date) {
      dateValue = date;
    } else if (date) {
      dateValue = new Date(date);
    }

    // Store as ISO string for consistency
    const dateString = dateValue instanceof Date && !isNaN(dateValue.getTime())
      ? dateValue.toISOString()
      : "";

    setValue(fieldName, dateString);

    // Auto-calculate age if date of birth changes
    if (fieldName === "dateOfBirth") {
      const calculatedAge = calculateAge(dateValue);
      setValue("age", calculatedAge);
      trigger("age");
    }
  }, [setValue, trigger]);

  // ----------------------------------------------------------------------
  // Submit Handler (FIXED - moved after resetForm definition)
  // ----------------------------------------------------------------------
  const onSubmit = useCallback(async (data) => {
    console.log('🚀 SUBMITTING FORM DATA:', data);

    try {
      if (!isAuthenticated || !sessionData) {
        console.log('❌ AUTH FAILED: Not authenticated');
        toast.error("Please log in to submit the form");
        return;
      }

      console.log('🔍 VALIDATING FORM...');
      const isValid = await trigger();
      console.log('✅ FORM VALIDATION RESULT:', isValid);

      if (!isValid) {
        const errorCount = Object.keys(errors).length;
        console.log(`❌ VALIDATION FAILED: ${errorCount} errors`, errors);
        toast.error(`Please fix ${errorCount} form error${errorCount > 1 ? 's' : ''} before submitting`);
        return;
      }

      console.log('✅ FORM VALIDATION PASSED - Proceeding with submission');

      const currentTenantId = parseInt(sessionData.tenantId) || 1;
      const currentUserId = parseInt(sessionData.userId) || 1;

      // Format dates for API
      const formatDateForAPI = (dateValue) => {
        if (!dateValue) return null;
        try {
          const date = new Date(dateValue);
          return isNaN(date.getTime()) ? null : date.toISOString();
        } catch {
          return null;
        }
      };

      // Calculate BMI if height and weight are provided
      const calculateBMI = (height, weight) => {
        if (!height || !weight) return null;
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        return (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
      };

      const formData = {
        // Personal Information (MAPPED CORRECTLY)
        userName: data.studentName?.trim() || "",
        userId: data.studentId ? parseInt(data.studentId) : null,
        className: data.className?.trim() || null,
        branch: data.branch?.trim() || null,

        // Family Information
        fatherName: data.fatherName?.trim() || "",
        fatherOccupation: data.fatherOccupation?.trim() || "",
        motherName: data.motherName?.trim() || "",
        motherOccupation: data.motherOccupation?.trim() || "",
        parentsOccupation: `${data.fatherOccupation || ''} & ${data.motherOccupation || ''}`.trim(),

        // Contact Information
        countryCode: data.countryCode || "+91",
        contactNumber: data.contactNumber?.trim() || "",
        email: data.email?.trim() || "",

        // Location Information
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",

        // Dates
        dateOfBirth: formatDateForAPI(data.dateOfBirth),
        fatherDateOfBirth: formatDateForAPI(data.fatherDateOfBirth),
        motherDateOfBirth: formatDateForAPI(data.motherDateOfBirth),
        age: data.age ? parseInt(data.age) : null,

        // Biological Birthplace
        isBiologicalSame: data.isBiologicalSame === "yes",
        biologicalCountry: data.biologicalCountry || "",
        biologicalState: data.biologicalState || "",
        biologicalCity: data.biologicalCity || "",

        // Guardian Information
        hasGuardian: data.hasGuardian === "yes",
        guardianFirstName: data.guardianFirstName?.trim() || "",
        guardianMiddleName: data.guardianMiddleName?.trim() || "",
        guardianLastName: data.guardianLastName?.trim() || "",
        guardianOccupation: data.guardianOccupation?.trim() || "",
        guardianRelationship: data.guardianRelationship || "",
        guardianContactNumber: data.guardianContactNumber?.trim() || "",
        guardianEmail: data.guardianEmail?.trim() || "",

        // Health Information
        gender: data.gender || "",
        height: data.height ? parseFloat(data.height) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        bmi: calculateBMI(data.height, data.weight),
        consanguinity: data.consanguinity === "Y",

        // Diet & Lifestyle
        dietType: data.dietType || "",
        activity: data.activity?.trim() || "",
        sleepDuration: data.sleepDuration?.trim() || "",
        sleepQuality: data.sleepQuality || "Good",
        screenTime: data.screenTime?.trim() || "",
        foodTiming: data.foodTiming?.trim() || "",
        fruits: data.fruits?.trim() || "",
        vegetables: data.vegetables?.trim() || "",
        plantBasedProtein: data.plantBasedProtein?.trim() || "",
        animalBasedProtein: data.animalBasedProtein?.trim() || "",
        foodFrequency: data.foodFrequency || "3 meals per day",

        // Family & Environment
        familyType: data.familyType || "",
        siblings: data.siblings ? parseInt(data.siblings) : null,
        vaccination: data.vaccination === "yes",
        natureAccess: data.natureAccess || "",
        pollutionAir: data.pollutionAir === "yes",
        pollutionNoise: data.pollutionNoise === "yes",
        pollutionWater: data.pollutionWater === "yes",
        passiveSmoking: data.passiveSmoking === "yes",
        travelTime: data.travelTime?.trim() || "",

        // Session Data
        tenantId: currentTenantId,
        createdBy: currentUserId,
        updatedBy: null,
        isDeleted: false
      };

      console.log('📤 Submitting form data to API:', formData);

      await axios.post(HEALTH_REGISTRATION, formData, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.token}`
        }
      });

      toast.success("Genetic registration submitted successfully!");
      resetForm();

    } catch (error) {
      console.error('💥 FORM SUBMISSION ERROR:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          toast.error("Request timeout. Please try again.");
        } else if (error.response) {
          const serverError = error.response.data;
          const errorMessage = serverError?.message || serverError?.error || `Server error: ${error.response.status}`;
          toast.error(`Submission failed: ${errorMessage}`);
        } else if (error.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error("Failed to submit form. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }, [isAuthenticated, sessionData, trigger, errors, resetForm]);

  // FIXED: Updated handleSubmitClick with proper dependencies
  const handleSubmitClick = useCallback(() => {
    console.log('🖱️ Submit button clicked');
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  // ----------------------------------------------------------------------
  // Form Sections with Icons
  // ----------------------------------------------------------------------
  const formSectionsWithIcons = useMemo(() => {
    const sections = getFormSections(hasGuardian);
    const icons = {
      "Personal Information": UserCircleIcon,
      "Health & Family History": UsersIcon,
      "Diet & Lifestyle": HeartIcon,
      "Environment & Exposure": GlobeAltIcon,
    };

    return sections.map(section => ({
      ...section,
      icon: icons[section.title]
    }));
  }, [hasGuardian]);

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

        {/* ADDED: Debug Panel - Remove in production */}
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md max-h-64 overflow-auto z-50 border border-green-400">
          <h4 className="font-bold mb-2 text-green-400">🔍 FORM DEBUG PANEL</h4>
          <div><strong>Authenticated:</strong> {isAuthenticated ? '✅' : '❌'}</div>
          <div><strong>Submitting:</strong> {isSubmitting ? '⏳' : '✅'}</div>
          <div><strong>Valid:</strong> {isValid ? '✅' : '❌'}</div>
          <div><strong>Dirty:</strong> {isDirty ? '✅' : '❌'}</div>
          <div><strong>Errors:</strong> {Object.keys(errors).length}</div>
          <div><strong>Button Disabled:</strong> {(!isAuthenticated || isSubmitting || Object.keys(errors).length > 0 || Object.values(formValues).every(v => v === "" || v === null || v === undefined)) ? '✅' : '❌'}</div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-2 text-red-300">
              <strong>Error Fields:</strong>
              <div className="max-h-20 overflow-y-auto">
                {Object.keys(errors).map(field => (
                  <div key={field}>• {field}: {errors[field]?.message}</div>
                ))}
              </div>
            </div>
          )}
        </div>

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

        {/* Single Card Form */}
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="health-form"
        >
          <div className="dark:bg-dark-800 space-y-5 bg-gray-50 px-4">
            <Card className="w-full border-2 p-6 shadow-lg">
              <div className="space-y-8">
                {formSectionsWithIcons.map((section) => {
                  const cardStyle = getCardStyle(section.title);
                  return (
                    <div
                      key={section.title}
                      className={`rounded-lg p-6 ${cardStyle.background} ${cardStyle.border}`}
                    >
                      <h3 className="text-primary-950 dark:text-dark-100 flex items-center gap-2 text-lg font-semibold mb-6">
                        <section.icon className="text-primary-600 h-6 w-6" />
                        {section.title}
                      </h3>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {section.fields.map((fieldConfig) => (
                          <FieldRenderer
                            key={fieldConfig.key}
                            fieldConfig={fieldConfig}
                            errors={errors}
                            register={register}
                            control={control}
                            selectedCountryId={selectedCountryId}
                            selectedStateId={selectedStateId}
                            selectedBiologicalCountryId={selectedBiologicalCountryId}
                            selectedBiologicalStateId={selectedBiologicalStateId}
                            handleCountryChange={handleCountryChange}
                            handleStateChange={handleStateChange}
                            handleCityChange={handleCityChange}
                            handleBiologicalCountryChange={handleBiologicalCountryChange}
                            handleBiologicalStateChange={handleBiologicalStateChange}
                            handleBiologicalCityChange={handleBiologicalCityChange}
                            handleDateChange={handleDateChange}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default HealthForm;