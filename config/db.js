const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const conectarDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected');
    } catch (err) {
        console.log(err);
        process.exit(1); // Detiene la app
    }
}

module.exports = conectarDB;