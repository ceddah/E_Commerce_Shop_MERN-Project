const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log('MongoDB Database connected.');
    })
};

module.exports = connectDatabase;