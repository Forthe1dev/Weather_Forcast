const request = require('supertest');
const app = require('../server');

describe('Weather API Integration', () => {
    jest.setTimeout(10000);

    it('should fetch weather data from WeatherAPI', async () => {
        const response = await request(app)
            .get('/api/fetch-weather')
            .query({ city: 'New York', days: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('country', 'United States of America');
        expect(response.body).toHaveProperty('city', 'New York');
        expect(response.body).toHaveProperty('forecasts');
        expect(response.body.forecasts).toBeInstanceOf(Array);
        expect(response.body.forecasts.length).toBe(5);
    });

    it('should handle invalid inputs gracefully', async () => {
        const response = await request(app)
            .get('/api/fetch-weather')
            .query({ city: '', days: 0 });

        expect(response.status).toBe(500);
    });
});
