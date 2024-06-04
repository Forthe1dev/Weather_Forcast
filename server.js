const express = require('express');
require('dotenv').config();

const cors = require('cors');

const apiRoutes = require('./API/api');


const connectDB = require('./database/connection');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);


const PORT = process.env.PORT || 8080;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;