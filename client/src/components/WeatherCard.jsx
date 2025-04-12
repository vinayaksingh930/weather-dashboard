import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weatherData }) => {
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weatherData.city}, {weatherData.country}</h2>
        <img 
          src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
          alt={weatherData.description} 
        />
      </div>
      <div className="weather-info">
        <div className="temperature">
          <h1>{Math.round(weatherData.temperature)}°C</h1>
          <p>Feels like {Math.round(weatherData.feels_like)}°C</p>
        </div>
        <div className="details">
          <p className="condition">{weatherData.condition}</p>
          <p>{weatherData.description}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind: {weatherData.windSpeed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;