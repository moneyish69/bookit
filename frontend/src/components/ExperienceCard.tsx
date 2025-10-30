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

interface ExperienceCardProps {
  experience: Experience;
  onClick: () => void;
}

export default function ExperienceCard({ experience, onClick }: ExperienceCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={experience.image}
          alt={experience.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
          {experience.location}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{experience.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{experience.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            From ₹{experience.price}
          </div>
          <button
            onClick={onClick}
            className="bg-primary text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}