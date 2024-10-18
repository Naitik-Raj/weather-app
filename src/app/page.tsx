"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const iconMap: { [key: string]: string } = {
  Rain: "wi-day-rain",
  Drizzle: "wi-day-rain",
  Clouds: "wi-day-cloudy",
  Clear: "wi-day-sunny",
  Snow: "wi-day-snow",
  Thunderstorm: "wi-day-thunderstorm",
  Fog: "wi-day-fog",
  Mist: "wi-day-fog"
};

interface WeatherData {
  weather: Array<{ main: string; description: string }>;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  name: string;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherReport = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `/api/weather`;
      
      if (location) {
        url += `?address=${encodeURIComponent(location)}`;
        // console.log("url"+url);
      } else if ("geolocation" in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
          // console.log("url"+url);
        });
        url += `?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        // console.log("url"+url);
      } else {
        throw new Error("Geolocation is not supported by your browser");
      }
      // console.log("url"+url);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      
      setWeatherData(await response.json());
    } catch (err) {
      console.error("Error fetching weather report:", err);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherReport();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();//it will prevent to reload the page
    fetchWeatherReport();
  };

  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <center>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name or address"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
        </center>
        {loading ? (
          <div className={styles.place}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : weatherData?.weather?.[0] ? (
          <>
            <div className={styles.icon_and_weatherInfo}>
              <div className={styles.weatherIcon}>
                <i className={`wi ${iconMap[weatherData.weather[0].main] || "wi-day-cloudy"}`}></i>
              </div>
              <div className={styles.weatherInfo}>
                <div className={styles.temperature}>
                  <span>
                    {(weatherData.main.temp - 273.15).toFixed(2)}
                    {String.fromCharCode(176)}
                  </span>
                </div>
                <div className={styles.weatherCondition}>
                  {weatherData.weather[0].description.toUpperCase()}
                </div>
              </div>
            </div>
            <div className={styles.place}>{weatherData.name}</div>
            <div className={styles.date}>{getCurrentDate()}</div>
            <div className={styles.extraInfo}>
              <center>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Humidity:</span>
                <span className={styles.infoValue}>{weatherData.main.humidity}%</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Wind:</span>
                <span className={styles.infoValue}>{weatherData.wind.speed} m/s</span>
              </div>
              </center>
            </div>
          </>
        ) : (
          <div className={styles.place}>No weather data available</div>
        )}
      </article>
    </main>
  );
}
