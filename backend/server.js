const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Experience Schema
const experienceSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  price: Number,
  image: String,
  availableDates: [String],
  timeSlots: [{
    time: String,
    available: Number,
    soldOut: Boolean
  }]
});

const Experience = mongoose.model('Experience', experienceSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
  fullName: String,
  email: String,
  date: String,
  time: String,
  quantity: Number,
  subtotal: Number,
  taxes: Number,
  total: Number,
  promoCode: String,
  discount: Number,
  bookingId: String,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Seed data
const seedData = async () => {
  // Clear existing data and reseed
  await Experience.deleteMany({});
  const count = await Experience.countDocuments();
  if (count === 0) {
    const experiences = [
      {
        name: "Kayaking",
        location: "Udupi",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 999,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "07:00 am", available: 4, soldOut: false },
          { time: "9:00 am", available: 2, soldOut: false },
          { time: "11:00 am", available: 5, soldOut: false },
          { time: "1:00 pm", available: 0, soldOut: true }
        ]
      },
      {
        name: "Nandi Hills Sunrise",
        location: "Bangalore",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 899,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "05:00 am", available: 6, soldOut: false },
          { time: "06:00 am", available: 3, soldOut: false }
        ]
      },
      {
        name: "Coffee Trail",
        location: "Coorg",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 1299,
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "08:00 am", available: 8, soldOut: false },
          { time: "10:00 am", available: 4, soldOut: false }
        ]
      },
      {
        name: "Boat Cruise",
        location: "Sunderban",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 999,
        image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "09:00 am", available: 10, soldOut: false },
          { time: "02:00 pm", available: 6, soldOut: false }
        ]
      },
      {
        name: "Bunjee Jumping",
        location: "Manali",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 999,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "10:00 am", available: 4, soldOut: false },
          { time: "12:00 pm", available: 2, soldOut: false }
        ]
      },
      {
        name: "Desert Safari",
        location: "Rajasthan",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 1599,
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "04:00 pm", available: 12, soldOut: false },
          { time: "06:00 pm", available: 8, soldOut: false }
        ]
      },
      {
        name: "Scuba Diving",
        location: "Goa",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 2499,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "09:00 am", available: 6, soldOut: false },
          { time: "11:00 am", available: 4, soldOut: false },
          { time: "02:00 pm", available: 5, soldOut: false }
        ]
      },
      {
        name: "Mountain Trekking",
        location: "Himachal",
        description: "Curated small-group experience. Certified guide. Safety first with gear included.",
        price: 1899,
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
        availableDates: ["Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26"],
        timeSlots: [
          { time: "06:00 am", available: 8, soldOut: false },
          { time: "08:00 am", available: 6, soldOut: false }
        ]
      }
    ];
    await Experience.insertMany(experiences);
    console.log('Sample data inserted');
  }
};

// Routes
app.get('/api/experiences', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }
    const experiences = await Experience.find(query);
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/promo/validate', (req, res) => {
  const { code } = req.body;
  const promoCodes = {
    'SAVE10': { discount: 10, type: 'percentage' },
    'FLAT100': { discount: 100, type: 'fixed' }
  };
  
  if (promoCodes[code]) {
    res.json({ valid: true, ...promoCodes[code] });
  } else {
    res.json({ valid: false, message: 'Invalid promo code' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const bookingId = 'HUF' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const booking = new Booking({
      ...req.body,
      bookingId
    });
    await booking.save();
    res.json({ success: true, bookingId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedData();
});