import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa"; // React Icons

const Navbar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    if (searchInput) {
      onSearch(searchInput);
      setSearchInput(""); // Clear input after search
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Fetch weather for current location using lat and lon
        onSearch(`${latitude},${longitude}`);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">WeatherApp</div>
      <div className="navbar-icons">
        <input
          type="text"
          className="search-bar"
          placeholder="Search city"
          value={searchInput}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch}>
          <FaSearch />
        </button>
        <button className="location-button" onClick={handleCurrentLocation}>
          <FaMapMarkerAlt />
          <span>Current Location</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
