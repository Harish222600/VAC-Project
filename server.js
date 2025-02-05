const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

// Connect to MongoDB
const uri = 'mongodb+srv://hariharish2604:HallManagement@hallmanagement.6bq6z.mongodb.net/';
mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  eventType: String,
  date: Date,
  guestCount: Number,
  message: String,
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML files
app.use(express.static(path.join(__dirname)));

// Serve the reservation form
app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'reservation.html'));
});

// Handle form submissions
app.post('/api/reservation', async (req, res) => {
  try {
    const { name, email, phone, eventType, date, guestCount, message } = req.body;

    const newReservation = new Reservation({
      name,
      email,
      phone,
      eventType,
      date,
      guestCount,
      message,
    });

    await newReservation.save();
    res.send('<h3>Reservation saved successfully! <a href="/reservation">Go Back</a></h3>');
  } catch (error) {
    console.error('Error saving reservation:', error);
    res.status(500).send('Failed to save reservation.');
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port} ,http://localhost:${port}`);
});
