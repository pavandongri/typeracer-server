const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const initSocket = require('./socket/socket');
require('dotenv').config();

const raceRoutes = require('./routes/raceRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();

const server = http.createServer(app);

console.log({indexClientUrl:  process.env.FRONTEND_URL})

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.options('*', cors())

app.use(express.json());

app.use('/race', raceRoutes);
app.use('/users', userRoutes);

connectDB()
  .then(() => {
    initSocket(server);
    server.listen(4000, () => {
      console.log('✅ Server running on port 4000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
