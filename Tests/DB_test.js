const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Forecast = require('../Models/Forecast');
const connectDB = require('../database/connection');

// Load .env file
dotenv.config();

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await Forecast.deleteMany({});
});

describe('Database Operations', () => {
    it('should save a forecast to the database', async () => {
        const forecast = new Forecast({
            country: 'United States of America',
            city: 'New York',
            forecasts: [
                {
                    date: new Date(),
                    day: {
                        maxtemp_c: 25,
                        mintemp_c: 15,
                        condition: { text: 'Sunny' },
                    }
                }
            ],
            current: {
                temp_c: 20,
                condition: { text: 'Sunny' },
                feelslike_c: 19,
            },
            createdAt: new Date()
        });
        await forecast.save();

        const savedForecast = await Forecast.findOne({ city: 'New York' });
        expect(savedForecast).toBeTruthy();
        expect(savedForecast.city).toBe('New York');
    });

    it('should update an existing forecast in the database', async () => {
        const forecast = new Forecast({
            country: 'United States of America',
            city: 'New York',
            forecasts: [
                {
                    date: new Date(),
                    day: {
                        maxtemp_c: 25,
                        mintemp_c: 15,
                        condition: { text: 'Sunny' },
                    }
                }
            ],
            current: {
                temp_c: 20,
                condition: { text: 'Sunny' },
                feelslike_c: 19,
            },
            createdAt: new Date()
        });
        await forecast.save();

        await Forecast.findOneAndUpdate(
            { city: 'New York' },
            { 'current.temp_c': 30 }
        );

        const updatedForecast = await Forecast.findOne({ city: 'New York' });
        expect(updatedForecast.current.temp_c).toBe(30);
    });

    it('should fetch a forecast from the database', async () => {
        const forecast = new Forecast({
            country: 'United States of America',
            city: 'New York',
            forecasts: [
                {
                    date: new Date(),
                    day: {
                        maxtemp_c: 25,
                        mintemp_c: 15,
                        condition: { text: 'Sunny' },
                    }
                }
            ],
            current: {
                temp_c: 20,
                condition: { text: 'Sunny' },
                feelslike_c: 19,
            },
            createdAt: new Date()
        });
        await forecast.save();

        const fetchedForecast = await Forecast.findOne({ city: 'New York' });
        expect(fetchedForecast).toBeTruthy();
        expect(fetchedForecast.city).toBe('New York');
    });

    it('should handle invalid data gracefully', async () => {
        const invalidForecast = new Forecast({
            country: 'United States of America',
            city: 'New York',
            forecasts: [
                {
                    date: new Date(),
                    day: {
                        maxtemp_c: 'invalid_temp', // invalid data type
                        mintemp_c: 15,
                        condition: { text: 'Sunny' },
                    }
                }
            ],
            current: {
                temp_c: 20,
                condition: { text: 'Sunny' },
                feelslike_c: 19,
            },
            createdAt: new Date()
        });

        let error;
        try {
            await invalidForecast.save();
        } catch (e) {
            error = e;
        }
        expect(error).toBeTruthy();
    });
});
