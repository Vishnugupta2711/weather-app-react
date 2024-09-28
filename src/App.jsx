import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar"; // Updated path to Navbar component
import MainWeatherCard from "./components/MainWeatherCard"; // Updated path to MainWeatherCard component
import FiveDayForecast from "./components/FiveDayForecast"; // Updated path to FiveDayForecast component
import TodayHighlights from "./components/TodayHighlights"; // Updated path to TodayHighlights component
import axios from "axios";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London"); // Default city is set to London
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // For error handling
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = "c0876f72901a47e3be056724ffecad0e"; // Replace with your OpenWeatherMap API key
    axios
      .get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then((response) => {
        setAirQualityData(response.data.list[0]); // Set the first item in the list as air quality data
      })
      .catch((error) => console.error("Error fetching the air quality data:", error));
  };

  const fetchWeatherData = (city) => {
    const API_KEY = "c0876f72901a47e3be056724ffecad0e"; // Use the same API key as above
    setIsLoading(true); // Start loading
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then((response) => {
        const data = response.data;
        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon); // Fetch air quality data

        return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
      })
      .then((response) => {
        setFiveDayForecast(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the weather or forecast data:", error);
        setErrorMessage("Failed to fetch data. Please try again."); // Set error message
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
    <div>
      <Navbar onSearch={handleSearch} />
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      {isLoading ? (
        <p>Loading weather data...</p> // Display while loading
      ) : (
        weatherData && airQualityData && (
          <div style={{ display: "flex", padding: "30px", gap: "20px" }}>
            <div style={{ flex: "1", marginRight: "10px" }}>
              <MainWeatherCard weatherData={weatherData} />
              <p style={{ fontWeight: "700", fontSize: "20px", marginTop: "20px" }}>5 Days Forecast</p>
              {fiveDayForecast && <FiveDayForecast forecastData={fiveDayForecast} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: "0.5", gap: "20px" }}>
              <TodayHighlights weatherData={weatherData} airQualityData={airQualityData} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherDashboard;
