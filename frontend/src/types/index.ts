export interface Experience {
  _id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  image: string;
  availableDates: string[];
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: number;
  soldOut: boolean;
}

export interface BookingData {
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