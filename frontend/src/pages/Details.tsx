import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import Header from '../components/Header';

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

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchExperience(id);
    }
  }, [id]);

  const fetchExperience = async (experienceId: string) => {
    try {
      const response = await experienceAPI.getById(experienceId);
      setExperience(response.data);
      setSelectedDate(response.data.availableDates[0] || '');
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!experience) return { subtotal: 0, taxes: 0, total: 0 };
    const subtotal = experience.price * quantity;
    const taxes = Math.round(subtotal * 0.06);
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  };

  const handleConfirm = () => {
    if (!experience || !selectedDate || !selectedTime) return;
    
    const { subtotal, taxes, total } = calculateTotal();
    
    navigate('/checkout', {
      state: {
        experience,
        selectedDate,
        selectedTime,
        quantity,
        subtotal,
        taxes,
        total
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading experience...</div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Experience not found</div>
        </div>
      </div>
    );
  }

  const { subtotal, taxes, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-800"
        >
          ← Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              src={experience.image}
              alt={experience.name}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
            
            <h1 className="text-3xl font-bold mb-4">{experience.name}</h1>
            <p className="text-gray-600 mb-8">{experience.description}</p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Choose date</h3>
              <div className="flex flex-wrap gap-2">
                {experience.availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedDate === date
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Choose time</h3>
              <div className="flex flex-wrap gap-2">
                {experience.timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => !slot.soldOut && setSelectedTime(slot.time)}
                    disabled={slot.soldOut}
                    className={`px-4 py-2 rounded-lg border relative ${
                      slot.soldOut
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                        : selectedTime === slot.time
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    {slot.time}
                    {!slot.soldOut && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded">
                        {slot.available} left
                      </span>
                    )}
                    {slot.soldOut && (
                      <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs px-1 rounded">
                        Sold out
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg h-fit">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Starts at</span>
                <span className="font-semibold">₹{experience.price}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Quantity</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-3 rounded-lg font-medium ${
                selectedDate && selectedTime
                  ? 'bg-primary text-black hover:bg-yellow-400'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}