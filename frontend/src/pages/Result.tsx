import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, bookingId, error } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {success ? (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Confirmed
              </h1>
              
              <p className="text-gray-600 mb-8">
                Ref ID: {bookingId}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Failed
              </h1>
              
              <p className="text-gray-600 mb-8">
                {error || 'Something went wrong. Please try again.'}
              </p>
            </>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}