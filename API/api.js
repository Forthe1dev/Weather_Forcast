const express = require('express');
const axios = require('axios');
const Forecast = require('../Models/Forecast');

const router = express.Router();

// Endpoint to fetch weather forecast
router.get('/fetch-weather', async (req, res) => {
    const { city, days } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`;

    try {
        // Fetch weather data from WeatherAPI
        const response = await axios.get(url);
        const weatherData = response.data;

        if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
            throw new Error('Invalid weather data received from the API');
        }

        // Extract forecast data for the specified number of days
        const forecasts = weatherData.forecast.forecastday.map(day => ({
            date: new Date(day.date),
            day: {
                maxtemp_c: day.day.maxtemp_c,
                mintemp_c: day.day.mintemp_c,
                condition: {
                    text: day.day.condition.text
                }
            }
        }));

        const forecastData = {
            country: weatherData.location.country,
            city: weatherData.location.name,
            forecasts: forecasts,
            current: {
                temp_c: weatherData.current.temp_c,
                condition: {
                    text: weatherData.current.condition.text
                },
                feelslike_c: weatherData.current.feelslike_c
            },
            createdAt: new Date()
        };

        // Upserting forecast data to MongoDB
        const savedForecast = await Forecast.findOneAndUpdate(
            { city: weatherData.location.name, country: weatherData.location.country },
            forecastData,
            { upsert: true, new: true }
        );

        // Sending response with the saved forecast data
        res.status(200).json(savedForecast);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;