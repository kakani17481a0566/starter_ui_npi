// src/data.js

export const saveMood = async (text) => {
  return new Promise((resolve) => {
    console.log("Simulating API call with text:", text);
    setTimeout(() => {
      resolve({ success: true, message: "Mood saved successfully!" });
    }, 1000);
  });
};
