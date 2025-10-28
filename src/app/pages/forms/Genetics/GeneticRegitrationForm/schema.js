// schema.js
import * as yup from 'yup';

export const schema = yup.object({
  // Personal Information
  studentName: yup
    .string()
    .required('User name is required')
    .min(2, 'User name must be at least 2 characters')
    .max(100, 'User name must be less than 100 characters'),

  studentId: yup
    .string()
    .required('User ID is required'),

  // className: yup
  //   .string()
  //   .required('Class name is required'),

  // branch: yup
  //   .string()
  //   .required('Branch is required'),

  fatherName: yup
    .string()
    .required("Father's name is required"),

  fatherOccupation: yup
    .string()
    .required("Father's occupation is required"),

  motherName: yup
    .string()
    .required("Mother's name is required"),

  motherOccupation: yup
    .string()
    .required("Mother's occupation is required"),

  countryCode: yup
    .string()
    .required('Country code is required'),

  contactNumber: yup
    .string()
    .required('Contact number is required')
    .matches(/^\d{10}$/, 'Contact number must be 10 digits'),

  country: yup
    .string()
    .required('Country is required'),

  state: yup
    .string()
    .required('State is required'),

  city: yup
    .string()
    .required('City is required'),

  dateOfBirth: yup
    .string()
    .required("User's date of birth is required"),

  fatherDateOfBirth: yup
    .string()
    .required("Father's date of birth is required"),

  motherDateOfBirth: yup
    .string()
    .required("Mother's date of birth is required"),

  age: yup
    .string()
    .required('Age is required')
    .matches(/^\d+$/, 'Age must be a number'),

  // Health & Family History
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Please select a valid gender'),

  height: yup
    .string()
    .required('Height is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Height must be a valid number'),

  weight: yup
    .string()
    .required('Weight is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Weight must be a valid number'),

  familyType: yup
    .string()
    .required('Family type is required')
    .oneOf(['nuclear', 'extended','joint','single'], 'Please select a valid family type'),

  siblings: yup
    .string()
    .required('Number of siblings is required')
    .matches(/^\d+$/, 'Number of siblings must be a valid number'),

  consanguinity: yup
    .string()
    .required('Consanguinity information is required')
    .oneOf(['Y', 'N'], 'Please select Yes or No'),

  vaccination: yup
    .string()
    .required('Vaccination information is required')
    .oneOf(['yes', 'no'], 'Please select Yes or No'),

  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email address is required'),

  // Diet & Lifestyle
  dietType: yup
    .string()
    .required('Diet type is required')
    .oneOf(['vegetarian', 'vegan', 'non-vegetarian', 'pescatarian', 'eggetarian'], 'Please select a valid diet type'),

  activity: yup
    .string()
    .required('Extracurricular activity is required'),

  sleepDuration: yup
    .string()
    .required('Sleep duration is required'),

  screenTime: yup
    .string()
    .required('Screen time is required'),

  fruits: yup
    .string()
    .required('Fruits intake information is required'),

  vegetables: yup
    .string()
    .required('Vegetables intake information is required'),

  plantBasedProtein: yup
    .string()
    .required('Plant based protein intake is required'),

  animalBasedProtein: yup
    .string()
    .required('Animal based protein intake is required'),

  foodTiming: yup
    .string()
    .required('Food timing information is required'),

  // Environment & Exposure
  natureAccess: yup
    .string()
    .required('Nature access information is required')
    .oneOf(['daily', 'weekly', 'occasional', 'virtual', 'rarely'], 'Please select a valid option'),

  pollutionAir: yup
    .string()
    .required('Air pollution information is required')
    .oneOf(['yes', 'no'], 'Please select Yes or No'),

  pollutionNoise: yup
    .string()
    .required('Noise pollution information is required')
    .oneOf(['yes', 'no'], 'Please select Yes or No'),

  pollutionWater: yup
    .string()
    .required('Water pollution information is required')
    .oneOf(['yes', 'no'], 'Please select Yes or No'),

  passiveSmoking: yup
    .string()
    .required('Passive smoking information is required')
    .oneOf(['yes', 'no'], 'Please select Yes or No'),

  travelTime: yup
    .string()
    .required('Travel time information is required'),
});