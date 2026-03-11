import { getWeatherIcon, formatTemp, getUVLevel, getWindDirection } from "../utils/weather";
import styles from "./CurrentWeather.module.css";

export default function CurrentWeather({ data }) {
  const { currentConditions, resolvedAddress, timezone } = data;
  const uv = getUVLevel(currentConditions.uvindex);

  return (
    <div className={styles.card}>
      <div className={styles.location}>
        <span className={styles.pin}>📍</span>
        <div>
          <h1 className={styles.city}>{resolvedAddress.split(",")[0]}</h1>
          <p className={styles.region}>{resolvedAddress.split(",").slice(1).join(",").trim()}</p>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.iconTemp}>
          <span className={styles.weatherIcon}>{getWeatherIcon(currentConditions.icon)}</span>
          <span className={styles.temp}>{formatTemp(currentConditions.temp)}</span>
        </div>
        <div className={styles.desc}>
          <p className={styles.conditions}>{currentConditions.conditions}</p>
          <p className={styles.feelsLike}>Feels like {formatTemp(currentConditions.feelslike)}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <StatItem icon="💧" label="Humidity" value={`${currentConditions.humidity}%`} />
        <StatItem icon="💨" label="Wind" value={`${Math.round(currentConditions.windspeed)} mph ${getWindDirection(currentConditions.winddir)}`} />
        <StatItem icon="👁️" label="Visibility" value={`${currentConditions.visibility} mi`} />
        <StatItem icon="🌡️" label="Dew Point" value={formatTemp(currentConditions.dew)} />
        <StatItem icon="☀️" label="UV Index" value={currentConditions.uvindex} color={uv.color} label2={uv.label} />
        <StatItem icon="🔵" label="Pressure" value={`${currentConditions.pressure} mb`} />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, color, label2 }) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue} style={color ? { color } : {}}>
          {value}
          {label2 && <span className={styles.statSub}> {label2}</span>}
        </p>
      </div>
    </div>
  );
}
