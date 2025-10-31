import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client once with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generates review highlight tabs based on a business description using a generative AI model.
 * This function reuses the exact logic from the ProfileSettingsPage.
 * @param {string} description - The description of the business.
 * @returns {Promise<string[]>} A promise that resolves to an array of highlight tab strings.
 */
export const generateHighlightTabs = async (description) => {
  if (!description) {
    console.log("No description provided, returning default tabs.");
    return ["Service", "Quality", "Price", "Ambiance"];
  }

  try {
    const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_GEMINI_MODEL_NAME });

    const prompt = `Based on the following business description, generate between 4 and 8 concise, one or two-word highlight tabs for customer reviews. The output MUST be a valid JSON array of strings.
    Description: "${description}"
    
    Example output for a coffee shop: ["Coffee", "Pastries", "Ambiance", "Service", "Price"]
    Example output for a hair salon: ["Haircut", "Color", "Styling", "Service", "Price"]

    JSON Array:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const newTabs = JSON.parse(jsonString);
    
    if (Array.isArray(newTabs)) {
      return newTabs;
    } else {
       console.error("AI did not return a valid array. Fallback response:", text);
       return ["Service", "Quality", "Price", "Ambiance"];
    }

  } catch (e) {
    console.error("Error generating highlight tabs:", e);
    // Return a default array in case of any error
    return ["Service", "Quality", "Price", "Ambiance"];
  }
};
