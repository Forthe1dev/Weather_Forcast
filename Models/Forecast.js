const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    forecasts: [{
        date: {
            type: Date,
            required: true
        },
        day: {
            maxtemp_c: {
                type: Number,
                required: true
            },
            mintemp_c: {
                type: Number,
                required: true
            },

        }
    }],


    current: {
        temp_c: {
            type: Number,
            required: true
        },
        condition: {
            text: {
                type: String,
                required: true
            }
        },
        feelslike_c: {
            type: Number,
            required: true
        },

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}
);

module.exports = mongoose.model("Forecast", ForecastSchema);