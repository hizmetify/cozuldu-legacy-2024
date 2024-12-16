const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const adRoutes = require('./routes/adRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/ads', adRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
