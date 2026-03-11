import { getWeatherIcon, formatTemp, formatTime } from "../utils/weather";
import styles from "./HourlyForecast.module.css";

export default function HourlyForecast({ hours }) {
  const now = new Date();
  const currentHour = now.getHours();

  const upcoming = hours
    .filter((h) => {
      const [hr] = h.datetime.split(":").map(Number);
      return hr >= currentHour;
    })
    .slice(0, 12);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Hourly Forecast</h2>
      <div className={styles.scroll}>
        {upcoming.map((hour) => (
          <HourCard key={hour.datetime} hour={hour} />
        ))}
      </div>
    </div>
  );
}

function HourCard({ hour }) {
  return (
    <div className={styles.card}>
      <p className={styles.time}>{formatTime(hour.datetime)}</p>
      <span className={styles.icon}>{getWeatherIcon(hour.icon)}</span>
      <p className={styles.temp}>{formatTemp(hour.temp)}</p>
      {hour.precipprob > 10 && (
        <p className={styles.precip}>💧 {Math.round(hour.precipprob)}%</p>
      )}
    </div>
  );
}
