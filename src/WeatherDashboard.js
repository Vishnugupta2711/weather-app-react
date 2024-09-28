import React, { useState, useEffect } from "react";
import Navbar from "../src/components/navbar";
import MainWeatherCard from "../src/components/mainweathercard";
import FiveDayForecast from "../src/components/fiveday";
import TodayHighlights from "../src/components/todayhighlights";

import axios from "axios";
import './App.css'; // Importing CSS

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London"); // Default city is London
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // For error handling
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // Using environment variable
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((response) => {
        setAirQualityData(response.data.list[0]);
      })
      .catch((error) =>
        console.error("Error fetching the air quality data:", error)
      );
  };

  const fetchWeatherData = (city) => {
    setIsLoading(true); // Start loading
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // Using environment variable
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then((response) => {
        const data = response.data;
        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon);

        return axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
      })
      .then((response) => {
        setFiveDayForecast(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the weather or forecast data:", error);
        setErrorMessage("Failed to fetch weather data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
    setErrorMessage(""); // Clear any previous error
  };

  return (
    <div className="weather-dashboard">
      <Navbar onSearch={handleSearch} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading weather data...</p> // Display while loading
      ) : (
        weatherData && airQualityData && (
          <div className="weather-content">
            <div className="weather-left">
              <MainWeatherCard weatherData={weatherData} />
              <p className="forecast-title">5 Days Forecast</p>
              {fiveDayForecast && <FiveDayForecast forecastData={fiveDayForecast} />}
            </div>
            <div className="weather-right">
              <TodayHighlights weatherData={weatherData} airQualityData={airQualityData} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherDashboard;
