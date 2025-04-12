import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Dashboard</h1>
      </header>
      <main>
        <SearchBar onSearch={fetchWeatherData} />
        
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && weatherData && (
          <WeatherCard weatherData={weatherData} />
        )}
        
        {!loading && !error && !weatherData && (
          <div className="initial-message">
            <p>Enter a city name to get weather information</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;