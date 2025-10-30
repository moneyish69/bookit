import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI, promoAPI } from '../services/api';
import Header from '../components/Header';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    promoCode: '',
    agreeToTerms: false
  });
  
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const { experience, selectedDate, selectedTime, quantity, subtotal, taxes } = bookingData;
  const finalTotal = subtotal + taxes - promoDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePromoApply = async () => {
    if (!formData.promoCode) return;
    
    try {
      const response = await promoAPI.validate(formData.promoCode);
      if (response.data.valid) {
        const discount = response.data.type === 'percentage' 
          ? Math.round(subtotal * response.data.discount / 100)
          : response.data.discount;
        setPromoDiscount(discount);
        setPromoApplied(true);
      } else {
        alert('Invalid promo code');
      }
    } catch (error) {
      alert('Error validating promo code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        experienceId: experience._id,
        fullName: formData.fullName,
        email: formData.email,
        date: selectedDate,
        time: selectedTime,
        quantity,
        subtotal,
        taxes,
        total: finalTotal,
        promoCode: promoApplied ? formData.promoCode : undefined,
        discount: promoDiscount
      };

      const response = await bookingAPI.create(bookingPayload);
      
      navigate('/result', {
        state: {
          success: true,
          bookingId: response.data.bookingId
        }
      });
    } catch (error) {
      navigate('/result', {
        state: {
          success: false,
          error: 'Booking failed. Please try again.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-800"
        >
          ← Checkout
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder="Promo code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handlePromoApply}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  Apply
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-black py-3 rounded-lg font-medium hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg h-fit">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Experience</span>
                <span>{experience.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Date</span>
                <span>2025-10-22</span>
              </div>
              
              <div className="flex justify-between">
                <span>Time</span>
                <span>{selectedTime}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Qty</span>
                <span>{quantity}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({formData.promoCode})</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}