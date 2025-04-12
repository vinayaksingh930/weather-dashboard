const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
    
    // Check if API key exists
    if (!API_KEY) {
      console.error('API key is missing in environment variables');
      return res.status(500).json({ error: 'Server configuration error - API key missing' });
    }
    
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    console.log(`Attempting to fetch weather data for: ${city}`);
    
    const response = await axios.get(URL);
    const weatherData = response.data;
    
    // Format the response
    const formattedData = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
    };
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error details:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'City not found' });
      } else if (error.response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      } else {
        return res.status(error.response.status).json({ 
          error: 'Error from weather service', 
          details: error.response.data.message || 'Unknown error' 
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from weather API');
      return res.status(500).json({ error: 'No response from weather service' });
    } else {
      // Something happened in setting up the request
      console.error('Error setting up the request:', error.message);
      return res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key configured: ${process.env.OPENWEATHERMAP_API_KEY ? 'Yes' : 'No'}`);
});