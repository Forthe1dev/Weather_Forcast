const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            writeConcern: {
                w: 'majority',
                j: true,
                wtimeout: 1000
            }
        })

        console.log(`MongoDB connected : ${con.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB