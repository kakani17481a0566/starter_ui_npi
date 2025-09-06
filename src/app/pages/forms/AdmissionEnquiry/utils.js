// src\app\pages\forms\AdmissionEnquiry\utils.js

export const getDialFromCountry = (countryVal) =>
  countryVal?.dialCode || countryVal?.phone || countryVal?.callingCode || null;

export const normalizeCountry = (c) => c?.value || c?.code || c?.iso2 || c || null;
