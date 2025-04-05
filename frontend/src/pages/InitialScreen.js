import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InitialScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      if (!searchQuery.trim()) {
        setFilteredUniversities([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:1234/searchUniversity?query=${searchQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }
        const data = await response.json();
        setFilteredUniversities(data);
      } catch (error) {
        console.error('Error loading universities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      loadUniversities();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-visible w-full max-w-2xl border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          <div className="relative p-8 sm:p-10">
            <div className="relative mb-10 text-center">
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-blue-400/20 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-teal-400/20 blur-xl"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 relative z-10">
                Rate My University
              </h1>
              <p className="text-center text-gray-600 mt-4 max-w-prose mx-auto leading-relaxed">
                Discover and share your university experiences. Whether you're a prospective student or an alum, 
                get insights and rate your campus life!
              </p>
            </div>

            {/* Search section */}
            <div className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm"
                  placeholder="Search for a university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute top-full left-0 w-full mt-3 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* Results dropdown */}
              {filteredUniversities.length > 0 && (
                <div className="absolute z-10 w-full mt-2">
                  <ul className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg overflow-y-auto max-h-[50vh]">
                    {filteredUniversities.map((uni) => (
                      <li key={uni}>
                        <Link
                          to={`/university?name=${uni}`}
                          className="block p-4 hover:bg-blue-50/50 transition duration-200 border-b border-gray-100/50 last:border-b-0 group"
                        >
                          <div className="flex items-center">
                            <div className="flex-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                              {uni}
                            </div>
                            <svg className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;