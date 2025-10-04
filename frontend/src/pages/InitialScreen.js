import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import UseClickOutside from '../contexts/UseClickOutside';

const InitialScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [showNoResultsPrompt, setShowNoResultsPrompt] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Compare widget states
  const [showCompareWidget, setShowCompareWidget] = useState(false);
  const [compareUni1, setCompareUni1] = useState('');
  const [compareUni2, setCompareUni2] = useState('');
  const [compareResults1, setCompareResults1] = useState([]);
  const [compareResults2, setCompareResults2] = useState([]);
  const [showCompareDropdown1, setShowCompareDropdown1] = useState(false);
  const [showCompareDropdown2, setShowCompareDropdown2] = useState(false);
  const [selectedCompareUni1, setSelectedCompareUni1] = useState(null);
  const [selectedCompareUni2, setSelectedCompareUni2] = useState(null);
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const compareWidgetRef = useRef(null);
  const compareDropdown1Ref = useRef(null);
  const compareDropdown2Ref = useRef(null);
  const navigate = useNavigate();

  UseClickOutside(dropdownRef, () => {
    setShowDropdown(false);
    setShowNoResultsPrompt(false);
  });

  UseClickOutside(compareDropdown1Ref, () => setShowCompareDropdown1(false));
  UseClickOutside(compareDropdown2Ref, () => setShowCompareDropdown2(false));

  useEffect(() => {
    const loadFeaturedUniversities = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/specificUni/getFeaturedUniversities`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured universities');
        }
        const data = await response.json();
        setFeaturedUniversities(data);
      } catch (error) {
        console.error('Error loading featured universities:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    
    loadFeaturedUniversities();
  }, []);

  useEffect(() => {
    let noResultsTimer;

    const loadUniversities = async () => {
      if (!searchQuery.trim()) {
        setFilteredUniversities([]);
        setShowNoResultsPrompt(false);
        return;
      }
      setIsLoading(true);
      setShowNoResultsPrompt(false);
      clearTimeout(noResultsTimer);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/searchUniversity/limit?query=${searchQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }
        const data = await response.json();
  
        setFilteredUniversities(data);
        
        if (data.length === 0) {
          noResultsTimer = setTimeout(() => {
            setShowNoResultsPrompt(true);
          }, 100);
        }
      } catch (error) {
        console.error('Error loading universities:', error);
        noResultsTimer = setTimeout(() => {
          setShowNoResultsPrompt(true);
        }, 100);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(() => {
      loadUniversities();
    }, 300);
  
    return () => {
      clearTimeout(timer);
      clearTimeout(noResultsTimer);
    }
  }, [searchQuery]);

  // Compare search functionality
  useEffect(() => {
    const searchCompareUni = async (query, setResults) => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/searchUniversity/limit?query=${query}`);
        if (!response.ok) return;
        const data = await response.json();
        setResults(data.slice(0, 5));
      } catch (error) {
        console.error('Error searching universities:', error);
        setResults([]);
      }
    };

    const timer1 = setTimeout(() => {
      searchCompareUni(compareUni1, setCompareResults1);
    }, 300);

    return () => clearTimeout(timer1);
  }, [compareUni1]);

  useEffect(() => {
    const searchCompareUni = async (query, setResults) => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/searchUniversity/limit?query=${query}`);
        if (!response.ok) return;
        const data = await response.json();
        setResults(data.slice(0, 5));
      } catch (error) {
        console.error('Error searching universities:', error);
        setResults([]);
      }
    };

    const timer2 = setTimeout(() => {
      searchCompareUni(compareUni2, setCompareResults2);
    }, 300);

    return () => clearTimeout(timer2);
  }, [compareUni2]);

  const handleSearchClick = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search/university?name=${searchQuery}`);
  };

  const handleInputFocus = () => {
    if (filteredUniversities.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleCompare = () => {
    if (selectedCompareUni1 && selectedCompareUni2) {
      navigate(`/compare?uni1=${selectedCompareUni1.id}&uni2=${selectedCompareUni2.id}`);
    }
  };

  const handleSelectCompareUni1 = (uni) => {
    setSelectedCompareUni1(uni);
    setCompareUni1(uni.name);
    setShowCompareDropdown1(false);
  };

  const handleSelectCompareUni2 = (uni) => {
    setSelectedCompareUni2(uni);
    setCompareUni2(uni.name);
    setShowCompareDropdown2(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Rate My University - Discover & Share University Reviews</title>
        <link rel="canonical" href="https://ratemyuniversity.io/" />
        <meta name="description" content="Discover and rate universities. Read authentic reviews from students about academics, campus life, and more." />
      </Helmet>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-r from-pink-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-gradient-to-l from-blue-200 to-transparent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-tr from-yellow-100 to-transparent opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-3 sm:p-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-visible w-full max-w-2xl border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-pink-50/30 opacity-30"></div>
          <div className="relative p-5 sm:p-8 md:p-10">
            <div className="relative mb-6 sm:mb-10 text-center">
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-blue-400/20 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-teal-400/20 blur-xl"></div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 relative z-10">
                Rate My University
              </h1>
              <p className="text-center text-gray-600 mt-3 sm:mt-4 max-w-prose mx-auto leading-relaxed text-sm sm:text-base px-2">
                Discover and share your university experiences. Whether you're a prospective student or an alum, 
                get insights and rate your campus life!
              </p>
            </div>

            <div className="relative w-full mb-6 sm:mb-8">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full p-3 sm:p-4 text-sm sm:text-base bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm"
                  placeholder="Search for a university..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === '') {
                      setFilteredUniversities([]);
                      setShowDropdown(false);
                    } else {
                      setShowDropdown(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchClick();
                    }
                  }}
                  onFocus={handleInputFocus}
                />
                <button
                  onClick={handleSearchClick}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2"
                >
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 hover:text-blue-700 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>

              {isLoading && (
                <div className="absolute top-full left-0 w-full mt-2 sm:mt-3 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {showDropdown && filteredUniversities.length > 0 && (
                <div className="absolute z-20 w-full mt-2" ref={dropdownRef}>
                  <ul className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-lg overflow-y-auto max-h-[40vh] divide-y divide-gray-100">
                    {filteredUniversities.map((uni) => (
                      <li key={uni.id}>
                        <Link
                          to={`/university/${uni.id}`}
                          className="flex items-start p-3 sm:p-4 hover:bg-blue-50 transition duration-200 group cursor-pointer"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="flex-shrink-0 mr-3 sm:mr-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                              <svg 
                                className="w-5 h-5 sm:w-6 sm:h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                              </svg>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                                {uni.name}
                              </h3>
                            </div>

                            <div className="flex items-center mt-1 space-x-3 sm:space-x-4">
                              <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                                <svg 
                                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span className="truncate">{uni.country || 'Unknown country'}</span>
                              </p>
                              <span className="text-xs sm:text-sm font-bold underline text-blue-600 whitespace-nowrap">
                                Review University
                              </span>
                            </div>
                          </div>

                          <div className="ml-3 sm:ml-4 flex-shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors">
                            <svg 
                              className="w-4 h-4 sm:w-5 sm:h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showDropdown && searchQuery && filteredUniversities.length === 0 && !isLoading && showNoResultsPrompt && (
                <div className="absolute z-20 w-full mt-2" ref={dropdownRef}>
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 text-center">
                    <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No matches found</h3>
                    <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">We couldn't find "{searchQuery}" in our database</p>
                    <Link
                      to="/addSchool"
                      className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      onClick={() => {
                        setShowDropdown(false);
                        setShowNoResultsPrompt(false);
                      }}
                    >
                      <svg className="-ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Your School
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 sm:mt-6 text-center">
              <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 relative z-10 pb-2 sm:pb-3">
                Most Rated Universities
              </h2>
              
              {isLoadingFeatured ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {featuredUniversities.map((university) => (
                    <Link
                      key={university.id}
                      to={`/university/${university.id}`}
                      className="group flex flex-col p-2.5 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors duration-200"
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors mb-1 truncate">
                        {university.name}
                      </span>
                      <div className="flex justify-center items-center">
                        <svg 
                          className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-500 ml-1">
                          {university.review_count} reviews
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {!isLoadingFeatured && featuredUniversities.length === 0 && (
                <div className="text-center py-2 text-xs sm:text-sm text-gray-500">
                  No top rated universities found
                </div>
              )}
            </div>
            {/* Quick Compare Widget */}
            <div className="mt-8 sm:mt-10 mb-6 sm:mb-8">
              <button
                onClick={() => setShowCompareWidget(!showCompareWidget)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-teal-400 rounded-xl font-semibold text-gray-700 hover:text-teal-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Quick Compare Universities
                <svg className={`w-5 h-5 transition-transform ${showCompareWidget ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {showCompareWidget && (
                <div className="mt-4 p-4 bg-white/50 rounded-xl border border-teal-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First University Search */}
                    <div className="relative" ref={compareDropdown1Ref}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First University</label>
                      <input
                        type="text"
                        className="w-full p-3 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Search university..."
                        value={compareUni1}
                        onChange={(e) => {
                          setCompareUni1(e.target.value);
                          setShowCompareDropdown1(true);
                          if (e.target.value === '') {
                            setSelectedCompareUni1(null);
                          }
                        }}
                        onFocus={() => compareResults1.length > 0 && setShowCompareDropdown1(true)}
                      />
                      {showCompareDropdown1 && compareResults1.length > 0 && (
                        <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {compareResults1.map((uni) => (
                            <button
                              key={uni.id}
                              onClick={() => handleSelectCompareUni1(uni)}
                              className="w-full text-left p-3 hover:bg-teal-50 transition text-sm"
                            >
                              <div className="font-medium text-gray-800">{uni.name}</div>
                              <div className="text-xs text-gray-500">{uni.country}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Second University Search */}
                    <div className="relative" ref={compareDropdown2Ref}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Second University</label>
                      <input
                        type="text"
                        className="w-full p-3 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Search university..."
                        value={compareUni2}
                        onChange={(e) => {
                          setCompareUni2(e.target.value);
                          setShowCompareDropdown2(true);
                          if (e.target.value === '') {
                            setSelectedCompareUni2(null);
                          }
                        }}
                        onFocus={() => compareResults2.length > 0 && setShowCompareDropdown2(true)}
                      />
                      {showCompareDropdown2 && compareResults2.length > 0 && (
                        <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {compareResults2.map((uni) => (
                            <button
                              key={uni.id}
                              onClick={() => handleSelectCompareUni2(uni)}
                              className="w-full text-left p-3 hover:bg-teal-50 transition text-sm"
                            >
                              <div className="font-medium text-gray-800">{uni.name}</div>
                              <div className="text-xs text-gray-500">{uni.country}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleCompare}
                    disabled={!selectedCompareUni1 || !selectedCompareUni2}
                    className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Compare Now
                  </button>
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