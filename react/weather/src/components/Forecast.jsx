import { getWeatherIcon, formatTemp, formatDay } from "../utils/weather";
import styles from "./Forecast.module.css";

export default function Forecast({ days }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>7-Day Forecast</h2>
      <div className={styles.grid}>
        {days.slice(0, 7).map((day) => (
          <DayCard key={day.datetime} day={day} />
        ))}
      </div>
    </div>
  );
}

function DayCard({ day }) {
  const precipChance = Math.round(day.precipprob);

  return (
    <div className={styles.card}>
      <p className={styles.day}>{formatDay(day.datetime)}</p>
      <span className={styles.icon}>{getWeatherIcon(day.icon)}</span>
      <p className={styles.conditions}>{day.conditions.split(",")[0]}</p>
      <div className={styles.temps}>
        <span className={styles.high}>{formatTemp(day.tempmax)}</span>
        <span className={styles.low}>{formatTemp(day.tempmin)}</span>
      </div>
      {precipChance > 0 && (
        <div className={styles.precip}>
          <span className={styles.precipIcon}>💧</span>
          <span>{precipChance}%</span>
        </div>
      )}
    </div>
  );
}
