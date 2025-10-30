import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ onSearch, showSearch = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="bg-black text-white px-2 py-1 rounded-full text-sm font-bold mr-2">
              Hd
            </div>
            <span className="text-lg font-semibold">highway delite</span>
          </div>
          
          {showSearch && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-primary text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                Search
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}