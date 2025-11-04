// data.js

// ----------------------------------------------------------------------
// Initial Values
// ----------------------------------------------------------------------
export const getInitialState = () => ({
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

  // Biological Birthplace
   isBiologicalSame: "no",
  biologicalCountry: "",
  biologicalState: "",
  biologicalCity: "",

  // Guardian Information
  hasGuardian: "no",
  guardianFirstName: "",
  guardianMiddleName: "",
  guardianLastName: "",
  guardianOccupation: "",
  guardianRelationship: "",
  guardianContactNumber: "",
  guardianEmail: "",

  // Health & Family History
  gender: "",
  height: "",
  weight: "",
  familyType: "",
  siblings: "",
  consanguinity: "N",
  vaccination: "no",
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
  pollutionAir: "no",
  pollutionNoise: "no",
  pollutionWater: "no",
  passiveSmoking: "no",
  travelTime: "",
});

// ----------------------------------------------------------------------
// Form Sections Configuration
// ----------------------------------------------------------------------
export const getFormSections = (hasGuardian) => [
  {
    title: "Personal Information",
    fields: [
      // Country, State, City
      {
        type: "country",
        key: "country",
        label: "Country Of Birth",
        placeholder: "Select country of birth"
      },
      {
        type: "state",
        key: "state",
        label: "State of Birth",
        placeholder: "Select state of birth"
      },
      {
        type: "city",
        key: "city",
        label: "Place Of Birth",
        placeholder: "Select city of birth"
      },

      // Biological Birthplace - Always enabled for separate entry
      {
        type: "biological-country",
        key: "biologicalCountry",
        label: "Biological Country Of Birth",
        placeholder: "Select biological country of birth"
      },
      {
        type: "biological-state",
        key: "biologicalState",
        label: "Biological State of Birth",
        placeholder: "Select biological state of birth"
      },
      {
        type: "biological-city",
        key: "biologicalCity",
        label: "Biological Place Of Birth",
        placeholder: "Select biological city of birth"
      },

      // Student Information
      {
        type: "input",
        key: "studentName",
        label: "Student Name",
        placeholder: "Enter student full name",
        inputType: "text"
      },
      {
        type: "date",
        key: "dateOfBirth",
        label: "Student's Date of Birth",
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
        label: "Student ID",
        placeholder: "Enter student ID",
        inputType: "text"
      },
      {
        type: "input",
        key: "className",
        label: "Class Name",
        placeholder: "Enter class/grade",
        inputType: "text"
      },
      {
        type: "input",
        key: "branch",
        label: "Branch",
        placeholder: "Enter school branch",
        inputType: "text"
      },

      // Father's Information
      {
        type: "input",
        key: "fatherName",
        label: "Father's Name",
        placeholder: "Enter father's full name",
        inputType: "text"
      },
      {
        type: "input",
        key: "fatherOccupation",
        label: "Father's Occupation",
        placeholder: "e.g., Engineer, Doctor, Business",
        inputType: "text"
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
        placeholder: "Enter mother's full name",
        inputType: "text"
      },
      {
        type: "input",
        key: "motherOccupation",
        label: "Mother's Occupation",
        placeholder: "e.g., Teacher, Homemaker, Professional",
        inputType: "text"
      },
      {
        type: "date",
        key: "motherDateOfBirth",
        label: "Mother's Date of Birth",
      },

      // Guardian Information
      // {
      //   type: "radio-small",
      //   key: "hasGuardian",
      //   label: "Has Guardian?",
      //   options: ["yes", "no"],
      // },
      // In your data.js file, add this to the "Personal Information" section fields array:
{
  type: "radio",
  key: "isBiologicalSame",
  label: "Is Biological Birthplace Same as Current?",
  options: ["yes", "no"],
  tooltip: "Select 'Yes' if the biological birthplace is the same as the current birthplace",
},
      {
        type: "input",
        key: "guardianFirstName",
        label: "Guardian First Name",
        placeholder: "Enter guardian first name",
        inputType: "text",
        disabled: hasGuardian !== "yes",
      },
      {
        type: "input",
        key: "guardianMiddleName",
        label: "Guardian Middle Name",
        placeholder: "Enter guardian middle name",
        inputType: "text",
        disabled: hasGuardian !== "yes",
      },
      {
        type: "input",
        key: "guardianLastName",
        label: "Guardian Last Name",
        placeholder: "Enter guardian last name",
        inputType: "text",
        disabled: hasGuardian !== "yes",
      },
      {
        type: "input",
        key: "guardianOccupation",
        label: "Guardian Occupation",
        placeholder: "e.g., Business, Professional",
        inputType: "text",
        disabled: hasGuardian !== "yes",
      },
      {
        type: "select",
        key: "guardianRelationship",
        label: "Guardian Relationship",
        options: [
          { value: "", label: "Select Relationship" },
          { value: "grandparent", label: "Grandparent" },
          { value: "uncle", label: "Uncle" },
          { value: "aunt", label: "Aunt" },
          { value: "sibling", label: "Sibling" },
          { value: "family_friend", label: "Family Friend" },
          { value: "other", label: "Other" },
        ],
        disabled: hasGuardian !== "yes",
      },
      {
        type: "phone",
        key: "guardianContactNumber",
        label: "Guardian Contact Number",
        placeholder: "Enter guardian phone number",
        disabled: hasGuardian !== "yes",
      },
      {
        type: "input",
        key: "guardianEmail",
        label: "Guardian Email",
        inputType: "email",
        placeholder: "Enter guardian email address",
        disabled: hasGuardian !== "yes",
      },
    ],
  },
  {
    title: "Health & Family History",
    fields: [
      // Gender Radio
      {
        type: "radio",
        key: "gender",
        label: "Gender",
        options: ["male", "female", "other"],
      },

      // Physical Attributes
      {
        type: "input",
        key: "height",
        label: "Height (cm)",
        inputType: "number",
        placeholder: "Enter height in centimeters",
        step: "0.1",
        min: "0"
      },
      {
        type: "input",
        key: "weight",
        label: "Weight (kg)",
        inputType: "number",
        placeholder: "Enter weight in kilograms",
        step: "0.1",
        min: "0"
      },

      // Family Information
      {
        type: "select",
        key: "familyType",
        label: "Type of Family",
        options: [
          { value: "", label: "Select Family Type" },
          { value: "nuclear", label: "Nuclear Family" },
          { value: "joint", label: "Joint Family" },
          { value: "extended", label: "Extended Family" },
          { value: "single_parent", label: "Single Parent" },
          { value: "other", label: "Other" },
        ],
      },
      {
        type: "input",
        key: "siblings",
        label: "Number of Siblings",
        inputType: "number",
        placeholder: "Enter number of siblings",
        min: "0",
        step: "1"
      },

      // Medical History
      {
        type: "radio",
        key: "consanguinity",
        label: "Consanguinity",
        options: ["Y", "N"],
        tooltip: "Refers to marriage or relation between individuals closely related by blood (e.g., cousins).",
      },
      {
        type: "radio",
        key: "vaccination",
        label: "Vaccination Status",
        options: ["yes", "no"],
        tooltip: "Is the student up-to-date with recommended vaccinations?",
      },

      // Contact Information
      {
        type: "phone",
        key: "contactNumber",
        label: "Parent's Contact Number",
        placeholder: "Enter parent's phone number"
      },
      {
        type: "input",
        key: "email",
        label: "Email Address",
        inputType: "email",
        placeholder: "Enter parent's email address",
      },
    ],
  },
  {
    title: "Diet & Lifestyle",
    fields: [
      // Physical Activity
      {
        type: "input",
        key: "activity",
        label: "Extracurricular Activities",
        placeholder: "e.g., Football, Swimming, Dance, Music",
        inputType: "text"
      },

      // Sleep Information
      {
        type: "input",
        key: "sleepDuration",
        label: "Sleep Duration (hours)",
        placeholder: "e.g., 8, 9, 10 hours",
        inputType: "text"
      },
      {
        type: "select",
        key: "sleepQuality",
        label: "Sleep Quality",
        options: [
          { value: "", label: "Select Sleep Quality" },
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" },
          { value: "poor", label: "Poor" },
        ],
      },

      // Screen Time
      {
        type: "input",
        key: "screenTime",
        label: "Daily Screen Time",
        placeholder: "e.g., 1 hour, 2 hours, 30 minutes",
        inputType: "text"
      },

      // Diet Information
      {
        type: "select",
        key: "dietType",
        label: "Diet Type",
        options: [
          { value: "", label: "Select Diet Type" },
          { value: "vegetarian", label: "Vegetarian" },
          { value: "vegan", label: "Vegan" },
          { value: "non_vegetarian", label: "Non-Vegetarian" },
          { value: "eggetarian", label: "Eggetarian" },
          { value: "pescatarian", label: "Pescatarian" },
          { value: "mediterranean", label: "Mediterranean" },
          { value: "other", label: "Other" },
        ],
      },
      {
        type: "select",
        key: "foodFrequency",
        label: "Food Frequency Pattern",
        options: [
          { value: "", label: "Select Food Frequency" },
          { value: "3_meals", label: "3 meals per day" },
          { value: "3_meals_snacks", label: "3 meals + snacks" },
          { value: "2_meals", label: "2 meals per day" },
          { value: "frequent_small", label: "Frequent small meals" },
          { value: "irregular", label: "Irregular timing" },
        ],
      },

      // Food Intake Details
      {
        type: "input",
        key: "fruits",
        label: "Fruits Intake",
        placeholder: "e.g., Daily apples, Weekly bananas, Seasonal fruits",
        inputType: "text"
      },
      {
        type: "input",
        key: "vegetables",
        label: "Vegetables Intake",
        placeholder: "e.g., Daily greens, Weekly carrots, Mixed vegetables",
        inputType: "text"
      },
      {
        type: "input",
        key: "plantBasedProtein",
        label: "Plant-Based Protein Intake",
        placeholder: "e.g., Lentils, Beans, Chickpeas, Tofu",
        inputType: "text",
        tooltip: {
          title: "Plant-Based Protein Sources",
          content: "Includes: Beans, lentils, chickpeas, peas, tofu, tempeh, edamame, quinoa, nuts, seeds, and other plant-derived protein sources.",
        },
      },
      {
        type: "input",
        key: "animalBasedProtein",
        label: "Animal-Based Protein Intake",
        placeholder: "e.g., Eggs, Fish, Chicken, Dairy",
        inputType: "text",
        tooltip: {
          title: "Animal-Based Protein Sources",
          content: "Includes: Meat, chicken, fish, eggs, dairy products (milk, cheese, yogurt), and other animal-derived protein sources.",
        },
      },
      {
        type: "input",
        key: "foodTiming",
        label: "Interval Between Meals",
        placeholder: "e.g., 4 hours, 3 hours, Irregular",
        inputType: "text"
      },
    ],
  },
  {
    title: "Environment & Exposure",
    fields: [
      // Nature Access
      {
        type: "select",
        key: "natureAccess",
        label: "Access to Nature/Greenery",
        options: [
          { value: "", label: "Select Nature Access" },
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never" },
        ],
        tooltip: "How often does the student access parks, gardens, or natural environments?",
      },

      // Pollution Exposure
      {
        type: "radio",
        key: "pollutionAir",
        label: "Air Pollution Exposure",
        options: ["yes", "no"],
        tooltip: "Does the student live in an area with significant air pollution?",
      },
      {
        type: "radio",
        key: "pollutionNoise",
        label: "Noise Pollution Exposure",
        options: ["yes", "no"],
        tooltip: "Does the student live in a noisy environment (near traffic, construction, etc.)?",
      },
      {
        type: "radio",
        key: "pollutionWater",
        label: "Water Quality Concerns",
        options: ["yes", "no"],
        tooltip: "Are there any concerns about water quality in the student's environment?",
      },
      {
        type: "radio",
        key: "passiveSmoking",
        label: "Passive Smoking Exposure",
        options: ["yes", "no"],
        tooltip: "Is the student exposed to secondhand smoke?",
      },

      // Travel Information
      {
        type: "input",
        key: "travelTime",
        label: "School Travel Time",
        placeholder: "e.g., 30 minutes, 1 hour, 15 minutes",
        inputType: "text",
        tooltip: "Average daily travel time to and from school",
      },
    ],
  },
];

// ----------------------------------------------------------------------
// Card Style Helper
// ----------------------------------------------------------------------
export const getCardStyle = (sectionTitle) => {
  const styles = {
    "Personal Information": {
      background: "bg-orange-50 dark:bg-[rgba(252,211,77,0.1)]",
      border: "border border-orange-200 dark:border-[rgba(252,211,77,0.3)]",
    },
    "Health & Family History": {
      background: "bg-green-50 dark:bg-[rgba(110,231,183,0.1)]",
      border: "border border-green-200 dark:border-[rgba(110,231,183,0.3)]",
    },
    "Diet & Lifestyle": {
      background: "bg-pink-50 dark:bg-[rgba(249,168,212,0.1)]",
      border: "border border-pink-200 dark:border-[rgba(249,168,212,0.3)]",
    },
    "Environment & Exposure": {
      background: "bg-violet-50 dark:bg-[rgba(196,181,253,0.1)]",
      border: "border border-violet-200 dark:border-[rgba(196,181,253,0.3)]",
    },
  };

  return styles[sectionTitle] || {
    background: "bg-white dark:bg-dark-700",
    border: "border border-gray-200 dark:border-dark-600",
  };
};

// ----------------------------------------------------------------------
// Field Type Configuration
// ----------------------------------------------------------------------
export const FIELD_TYPES = {
  INPUT: "input",
  SELECT: "select",
  RADIO: "radio",
  RADIO_SMALL: "radio-small",
  DATE: "date",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
  BIOLOGICAL_COUNTRY: "biological-country",
  BIOLOGICAL_STATE: "biological-state",
  BIOLOGICAL_CITY: "biological-city",
  PHONE: "phone",
};

// ----------------------------------------------------------------------
// Validation Messages
// ----------------------------------------------------------------------
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  PHONE: "Please enter a valid phone number",
  NUMBER: "Please enter a valid number",
  MIN_LENGTH: "Value is too short",
  MAX_LENGTH: "Value is too long",
};

// ----------------------------------------------------------------------
// Country Code Options
// ----------------------------------------------------------------------
export const COUNTRY_CODES = [
  { value: "+91", label: "🇮🇳 +91 (India)" },
  { value: "+1", label: "🇺🇸 +1 (USA)" },
  { value: "+44", label: "🇬🇧 +44 (UK)" },
  { value: "+39", label: "🇮🇹 +39 (Italy)" },
  { value: "+33", label: "🇫🇷 +33 (France)" },
  { value: "+49", label: "🇩🇪 +49 (Germany)" },
  { value: "+34", label: "🇪🇸 +34 (Spain)" },
  { value: "+971", label: "🇦🇪 +971 (UAE)" },
  { value: "+966", label: "🇸🇦 +966 (Saudi Arabia)" },
  { value: "+65", label: "🇸🇬 +65 (Singapore)" },
];

// ----------------------------------------------------------------------
// API Field Mappings
// ----------------------------------------------------------------------
export const API_FIELD_MAPPINGS = {
  // Frontend to Backend field name mappings
  studentName: "userName",
  studentId: "userId",
  className: "className",
  branch: "branch",

  // Pollution field value mappings
  pollutionMapping: {
    air: { yes: "High", no: "Low" },
    noise: { yes: "High", no: "Low" },
    water: { yes: "Concern", no: "Clean" },
  },

  // Consanguinity mapping
  consanguinityMapping: {
    Y: "Yes",
    N: "No"
  },

  // Vaccination mapping
  vaccinationMapping: {
    yes: "Complete as per WHO schedule",
    no: "Not complete"
  }
};

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

/**
 * Calculate age from date of birth
 */
export const calculateAge = (birthDate) => {
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

/**
 * Generate registration number
 */
export const generateRegistrationNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString().substr(2, 4);
  return `REG-${year}-${random}`;
};

/**
 * Check if biological birthplace is same as current birthplace
 */
export const isBiologicalSame = (currentLocation, biologicalLocation) => {
  return (
    currentLocation.country === biologicalLocation.country &&
    currentLocation.state === biologicalLocation.state &&
    currentLocation.city === biologicalLocation.city
  );
};

/**
 * Calculate BMI from height and weight
 */
export const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  const heightInMeters = parseFloat(height) / 100;
  const weightInKg = parseFloat(weight);
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return bmi.toFixed(2);
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return null;

  const bmiValue = parseFloat(bmi);
  if (bmiValue < 18.5) return "Underweight";
  if (bmiValue < 25) return "Normal weight";
  if (bmiValue < 30) return "Overweight";
  return "Obese";
};

export default {
  getInitialState,
  getFormSections,
  getCardStyle,
  FIELD_TYPES,
  VALIDATION_MESSAGES,
  COUNTRY_CODES,
  API_FIELD_MAPPINGS,
  calculateAge,
  generateRegistrationNumber,
  isBiologicalSame,
  calculateBMI,
  getBMICategory,
};