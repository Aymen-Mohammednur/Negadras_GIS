require('dotenv').config({ path: './config/config.env' });
const path = require('path')
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')

app.use('/api/v1/pins', pinRoute);
app.use('/api/v1/users', userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));