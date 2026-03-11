const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export async function fetchWeather(location) {
  if (!API_KEY) {
    throw new Error("API key not configured. Add VITE_VISUAL_CROSSING_API_KEY to your .env file.");
  }

  const url = `${BASE_URL}/${encodeURIComponent(location)}?unitGroup=us&key=${API_KEY}&contentType=json&include=days,hours,current`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 400) throw new Error("Location not found. Please try another city.");
    if (response.status === 401) throw new Error("Invalid API key. Check your VITE_VISUAL_CROSSING_API_KEY.");
    throw new Error(`Failed to fetch weather data (${response.status})`);
  }

  return response.json();
}
