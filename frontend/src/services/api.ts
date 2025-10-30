import axios from 'axios';

// Define interfaces inline
interface TimeSlot {
  time: string;
  available: number;
  soldOut: boolean;
}

interface Experience {
  _id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
  availableDates: string[];
  timeSlots: TimeSlot[];
}

interface BookingData {
  experienceId: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  promoCode?: string;
  discount?: number;
}

const API_BASE_URL = 'https://bookit-3vw7.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const experienceAPI = {
  getAll: (search?: string) => 
    api.get<Experience[]>(`/experiences${search ? `?search=${search}` : ''}`),
  getById: (id: string) => 
    api.get<Experience>(`/experiences/${id}`),
};

export const bookingAPI = {
  create: (data: BookingData) => 
    api.post('/bookings', data),
};

export const promoAPI = {
  validate: (code: string) => 
    api.post('/promo/validate', { code }),
};