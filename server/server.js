require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const connectDB = require('./src/config/mongodb'); 


const authRoutes = require('./src/routes/authRoutes');
const linkRoutes = require('./src/routes/linksRoutes');
const userRoutes = require('./src/routes/userRoutes');


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true 
}));

connectDB()
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
    


app.use('/auth', authRoutes);
app.use('/links', linkRoutes);
app.use('/users' ,userRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});