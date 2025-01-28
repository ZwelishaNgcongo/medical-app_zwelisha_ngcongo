import axios from "axios";

const BASE_URL = "https://api.fda.gov/drug/event.json";

export const fetchDiseaseInfo = async (symptoms) => {
  try {
    const response = await axios.get(`${BASE_URL}/symptoms`, {
      params: { symptoms: symptoms.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching disease data:", error);
    return null;
  }
};
