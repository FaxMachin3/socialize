const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        console.log('mongoose connection started');
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log('mongoose connection established');
    } catch (error) {
        console.log(error.message);
        // exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
