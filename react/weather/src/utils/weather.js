export function getWeatherIcon(icon) {
  const icons = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    "cloudy": "☁️",
    "fog": "🌫️",
    "hail": "🌨️",
    "partly-cloudy-day": "⛅",
    "partly-cloudy-night": "🌥️",
    "rain-snow-showers-day": "🌧️",
    "rain-snow-showers-night": "🌧️",
    "rain-snow": "🌧️",
    "rain": "🌧️",
    "showers-day": "🌦️",
    "showers-night": "🌦️",
    "sleet": "🌨️",
    "snow-showers-day": "🌨️",
    "snow-showers-night": "🌨️",
    "snow": "❄️",
    "thunder-rain": "⛈️",
    "thunder-showers-day": "⛈️",
    "thunder-showers-night": "⛈️",
    "thunder": "🌩️",
    "wind": "💨",
  };
  return icons[icon] || "🌡️";
}

export function formatTemp(temp) {
  return `${Math.round(temp)}°F`;
}

export function formatDay(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatTime(timeStr) {
  const [hours] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 || 12;
  return `${display}${suffix}`;
}

export function getUVLevel(uv) {
  if (uv <= 2) return { label: "Low", color: "#4caf50" };
  if (uv <= 5) return { label: "Moderate", color: "#ffeb3b" };
  if (uv <= 7) return { label: "High", color: "#ff9800" };
  if (uv <= 10) return { label: "Very High", color: "#f44336" };
  return { label: "Extreme", color: "#9c27b0" };
}

export function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}
