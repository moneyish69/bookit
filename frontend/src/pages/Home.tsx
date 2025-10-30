import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';

// Define interfaces inline to avoid import issues
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

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async (search?: string) => {
    try {
      setLoading(true);
      console.log('Fetching experiences...');
      const response = await experienceAPI.getAll(search);
      console.log('API Response:', response.data);
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    fetchExperiences(query);
  };

  const handleExperienceClick = (experienceId: string) => {
    navigate(`/experience/${experienceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading experiences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug info */}

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience._id}
              experience={experience}
              onClick={() => handleExperienceClick(experience._id)}
            />
          ))}
        </div>
        
        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No experiences found.</p>
          </div>
        )}
      </main>
    </div>
  );
} 