import { useState, useCallback } from "react";
import { fetchWeather } from "./api/weather";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import Forecast from "./components/Forecast";
import styles from "./App.module.css";

function getBackground(icon) {
  if (!icon) return "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)";
  if (icon.includes("clear") && icon.includes("day"))
    return "linear-gradient(135deg, #1a6fc4 0%, #0f4c8a 50%, #1a3a5c 100%)";
  if (icon.includes("clear") && icon.includes("night"))
    return "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0a0f1c 100%)";
  if (icon.includes("partly-cloudy"))
    return "linear-gradient(135deg, #2e6da4 0%, #3a7fc1 50%, #1e5a8a 100%)";
  if (icon.includes("rain") || icon.includes("shower"))
    return "linear-gradient(135deg, #2c3e50 0%, #3d5166 50%, #1a2530 100%)";
  if (icon.includes("snow") || icon.includes("sleet"))
    return "linear-gradient(135deg, #4a6fa5 0%, #6b8cba 50%, #3a5580 100%)";
  if (icon.includes("thunder"))
    return "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #0d0d1a 100%)";
  if (icon.includes("fog"))
    return "linear-gradient(135deg, #4a4e5a 0%, #6b7280 50%, #374151 100%)";
  if (icon.includes("wind"))
    return "linear-gradient(135deg, #1e3a5f 0%, #2e5280 50%, #152a47 100%)";
  return "linear-gradient(135deg, #2c3e50 0%, #3d5166 50%, #1e2d3d 100%)";
}

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (location) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(location);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const bg = getBackground(weatherData?.currentConditions?.icon);

  return (
    <div className={styles.app} style={{ background: bg }}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.appTitle}>WeatherNow</h1>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </header>

        {error && (
          <div className={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}

        {!weatherData && !loading && !error && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🌤️</div>
            <p className={styles.emptyText}>Search for any city to get started</p>
          </div>
        )}

        {weatherData && (
          <main className={styles.main}>
            <CurrentWeather data={weatherData} />
            <HourlyForecast hours={weatherData.days[0].hours} />
            <Forecast days={weatherData.days} />
          </main>
        )}
      </div>
    </div>
  );
}
