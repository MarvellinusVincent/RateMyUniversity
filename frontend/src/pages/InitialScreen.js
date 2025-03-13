import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InitialScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  // Fetch universities from the backend
  useEffect(() => {
    const loadUniversities = async () => {
      if (!searchQuery.trim()) return; // Don't search if the query is empty
      try {
        const response = await fetch(`/api/searchUniversity?query=${searchQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }
        const data = await response.json();
        setFilteredUniversities(data);
      } catch (error) {
        console.error('Error loading universities:', error);
      }
    };
    loadUniversities();
  }, [searchQuery]); // Re-run whenever searchQuery changes

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Rate My University Life</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full relative">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search for a university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredUniversities.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                {filteredUniversities.map((uni) => (
                  <li key={uni}>
                    <Link
                      to={`/university?name=${uni}`}
                      className="block p-2 hover:bg-blue-500 hover:text-white transition duration-200"
                    >
                      {uni}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;
