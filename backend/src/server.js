require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/user');
const serviceRoutes = require('./routes/service');
const customerRoutes = require('./routes/customer');
const ticketRoutes = require('./routes/ticket');

// express app
const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// TZ
process.env.TZ;

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api', loginRoutes);
app.use('/api', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', customerRoutes);
app.use('/api', ticketRoutes);

// Assicurati che il percorso sia corretto
app.use(express.static(path.join(__dirname, 'public')));

// Fallback per Single Page Applications
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
